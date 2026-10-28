-- ====================================================================
-- NOAK ERP — Complete Relational PostgreSQL Database Schema
-- Migration 001: Initial Core Schema
-- Strict Double-Entry Accounting, Batch Costing, and Divisional Isolation
-- ====================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(100) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. الأقسام (Divisions: Woodwork & Aluminum)
CREATE TABLE IF NOT EXISTS divisions (
    id VARCHAR(20) PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO divisions (id, name_ar, name_en, code, description) VALUES
('WOOD', 'قسم النجارة والديكور الداخلي', 'Woodwork & Interior Decoration Division', 'WOD', 'تصنيع الأثاث الخشبي والديكورات الداخلية والقواطع'),
('ALUMINUM', 'قسم الألمنيوم والواجهات', 'Aluminum Fabrication Division', 'ALM', 'تصنيع الواجهات والشبابيك والأبواب وهياكل الألمنيوم')
ON CONFLICT (id) DO NOTHING;

-- 2. المستخدمون والصلاحيات (Users & Permissions)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL,
    division_id VARCHAR(20) REFERENCES divisions(id), -- NULL = إشراف عام على الشركة (مدير عام، محاسب رئيسي)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_permissions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, resource, action)
);

-- 3. سجل التدقيق غير القابل للتعديل (Immutable Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    division_id VARCHAR(20) REFERENCES divisions(id),
    previous_values JSONB,
    new_values JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. متتبع التسلسل الآمن للمستندات (Document Sequence Tracker)
CREATE TABLE IF NOT EXISTS document_sequences (
    doc_type VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    current_val INT NOT NULL DEFAULT 0,
    PRIMARY KEY (doc_type, year)
);

-- 5. دليل الحسابات المحاسبي (Chart of Accounts)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    type VARCHAR(50) NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, DIRECT_COST, EXPENSE
    parent_id UUID REFERENCES chart_of_accounts(id),
    division_id VARCHAR(20) REFERENCES divisions(id),
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. الفترات المالية والإقفال (Accounting Periods & Closures)
CREATE TABLE IF NOT EXISTS accounting_periods (
    id UUID PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_period_dates CHECK (end_date >= start_date)
);

-- 7. اليومية العامة والقيود المحاسبية (Journal Entries & Lines)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY,
    entry_number VARCHAR(100) NOT NULL UNIQUE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    division_id VARCHAR(20) REFERENCES divisions(id),
    period_id UUID REFERENCES accounting_periods(id),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, POSTED, CANCELLED
    source_document_type VARCHAR(50),
    source_document_id VARCHAR(100),
    posted_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_lines (
    id UUID PRIMARY KEY,
    entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    debit NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (debit >= 0),
    credit NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (credit >= 0),
    description TEXT,
    division_id VARCHAR(20) REFERENCES divisions(id),
    cost_center_id VARCHAR(100),
    CONSTRAINT chk_not_both_positive CHECK (NOT (debit > 0 AND credit > 0)),
    CONSTRAINT chk_not_both_zero CHECK (debit > 0 OR credit > 0)
);

-- 8. العملاء والموردين (Customers & Suppliers)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    address TEXT,
    notes TEXT,
    pipeline_stage VARCHAR(50) NOT NULL DEFAULT 'LEAD',
    follow_up_date DATE,
    assigned_employee_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    address TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. المستودعات والمواد (Warehouses & Materials)
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    location TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    unit VARCHAR(50) NOT NULL,
    length NUMERIC(12, 3),
    width NUMERIC(12, 3),
    thickness NUMERIC(12, 3),
    min_stock_alert NUMERIC(12, 3) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 10. المشتريات والدفعات المخزنية الفعلية (Purchases & Batch Inventory)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY,
    purchase_number VARCHAR(100) NOT NULL UNIQUE,
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    date DATE NOT NULL,
    invoice_reference VARCHAR(100),
    subtotal NUMERIC(18, 4) NOT NULL CHECK (subtotal >= 0),
    tax_total NUMERIC(18, 4) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
    grand_total NUMERIC(18, 4) NOT NULL CHECK (grand_total >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_lines (
    id UUID PRIMARY KEY,
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity NUMERIC(18, 4) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL,
    unit_cost NUMERIC(18, 4) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(18, 4) NOT NULL CHECK (total_cost >= 0)
);

CREATE TABLE IF NOT EXISTS inventory_batches (
    id UUID PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL UNIQUE,
    material_id UUID NOT NULL REFERENCES materials(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    purchase_id UUID REFERENCES purchases(id),
    initial_quantity NUMERIC(18, 4) NOT NULL CHECK (initial_quantity >= 0),
    remaining_quantity NUMERIC(18, 4) NOT NULL CHECK (remaining_quantity >= 0),
    unit_cost NUMERIC(18, 4) NOT NULL CHECK (unit_cost >= 0),
    received_date DATE NOT NULL,
    CONSTRAINT chk_remaining_le_initial CHECK (remaining_quantity <= initial_quantity)
);

-- 11. عروض الأسعار والعقود (Quotations & Contracts)
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY,
    quotation_number VARCHAR(100) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    date DATE NOT NULL,
    valid_until DATE,
    subtotal NUMERIC(18, 4) NOT NULL CHECK (subtotal >= 0),
    discount_total NUMERIC(18, 4) NOT NULL DEFAULT 0,
    tax_total NUMERIC(18, 4) NOT NULL DEFAULT 0,
    grand_total NUMERIC(18, 4) NOT NULL CHECK (grand_total >= 0),
    print_show_itemized BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_lines (
    id UUID PRIMARY KEY,
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(18, 4) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL,
    unit_price NUMERIC(18, 4) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(18, 4) NOT NULL DEFAULT 0,
    tax NUMERIC(18, 4) NOT NULL DEFAULT 0,
    line_total NUMERIC(18, 4) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    quotation_id UUID REFERENCES quotations(id),
    date DATE NOT NULL,
    total_amount NUMERIC(18, 4) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contract_installments (
    id UUID PRIMARY KEY,
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    description VARCHAR(200),
    due_date DATE NOT NULL,
    amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    paid_date DATE
);

CREATE TABLE IF NOT EXISTS contract_amendments (
    id UUID PRIMARY KEY,
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    amendment_number INT NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    old_amount NUMERIC(18, 4) NOT NULL,
    new_amount NUMERIC(18, 4) NOT NULL,
    approved_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. المشاريع وصرف المواد (Projects & Material Issues)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    project_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    contract_id UUID REFERENCES contracts(id),
    manager_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    expected_end_date DATE,
    actual_end_date DATE,
    current_stage VARCHAR(100) NOT NULL DEFAULT 'تصميم ومقاسات',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    contract_amount NUMERIC(18, 4) NOT NULL DEFAULT 0,
    invoiced_amount NUMERIC(18, 4) NOT NULL DEFAULT 0,
    collected_amount NUMERIC(18, 4) NOT NULL DEFAULT 0,
    actual_material_cost NUMERIC(18, 4) NOT NULL DEFAULT 0, -- تكلفة المواد المنصرفة فقط
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_issues (
    id UUID PRIMARY KEY,
    issue_number VARCHAR(100) NOT NULL UNIQUE,
    project_id UUID NOT NULL REFERENCES projects(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    batch_id UUID NOT NULL REFERENCES inventory_batches(id),
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity NUMERIC(18, 4) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(18, 4) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(18, 4) NOT NULL CHECK (total_cost >= 0),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'POSTED',
    issued_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_returns (
    id UUID PRIMARY KEY,
    return_number VARCHAR(100) NOT NULL UNIQUE,
    issue_id UUID NOT NULL REFERENCES material_issues(id),
    batch_id UUID NOT NULL REFERENCES inventory_batches(id),
    quantity NUMERIC(18, 4) NOT NULL CHECK (quantity > 0),
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    approved_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waste_records (
    id UUID PRIMARY KEY,
    record_number VARCHAR(100) NOT NULL UNIQUE,
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    material_id UUID NOT NULL REFERENCES materials(id),
    batch_id UUID NOT NULL REFERENCES inventory_batches(id),
    quantity NUMERIC(18, 4) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(18, 4) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(18, 4) NOT NULL CHECK (total_cost >= 0),
    reason TEXT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    reported_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. فواتير المبيعات وسندات القبض والدفع (Sales Invoices, Receipts & Payments)
CREATE TABLE IF NOT EXISTS sales_invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    project_id UUID REFERENCES projects(id),
    date DATE NOT NULL,
    due_date DATE,
    subtotal NUMERIC(18, 4) NOT NULL CHECK (subtotal >= 0),
    tax_total NUMERIC(18, 4) NOT NULL DEFAULT 0,
    grand_total NUMERIC(18, 4) NOT NULL CHECK (grand_total >= 0),
    paid_amount NUMERIC(18, 4) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID REFERENCES users(id),
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS receipt_vouchers (
    id UUID PRIMARY KEY,
    voucher_number VARCHAR(100) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    project_id UUID REFERENCES projects(id),
    invoice_id UUID REFERENCES sales_invoices(id),
    date DATE NOT NULL,
    amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL, -- CASH, BANK
    reference_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'POSTED',
    notes TEXT,
    approved_by UUID REFERENCES users(id),
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_vouchers (
    id UUID PRIMARY KEY,
    voucher_number VARCHAR(100) NOT NULL UNIQUE,
    recipient_name VARCHAR(200) NOT NULL,
    division_id VARCHAR(20) REFERENCES divisions(id),
    expense_account_id UUID REFERENCES chart_of_accounts(id),
    supplier_id UUID REFERENCES suppliers(id),
    partner_id UUID,
    date DATE NOT NULL,
    amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    approved_by UUID NOT NULL REFERENCES users(id), -- MANDATORY ADMIN APPROVAL
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. الشركاء وتوزيع الأرباح (Partners, Equity & Profit Distributions)
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(100),
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    initial_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    current_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    profit_percentage NUMERIC(6, 2) NOT NULL CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
    total_withdrawals NUMERIC(18, 4) NOT NULL DEFAULT 0,
    total_distributions NUMERIC(18, 4) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profit_distributions (
    id UUID PRIMARY KEY,
    distribution_number VARCHAR(100) NOT NULL UNIQUE,
    division_id VARCHAR(20) NOT NULL REFERENCES divisions(id),
    period_id UUID NOT NULL REFERENCES accounting_periods(id),
    distributable_profit NUMERIC(18, 4) NOT NULL,
    reserve_deduction NUMERIC(18, 4) NOT NULL DEFAULT 0,
    net_distributed NUMERIC(18, 4) NOT NULL,
    partner_id UUID NOT NULL REFERENCES partners(id),
    percentage NUMERIC(6, 2) NOT NULL,
    amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. الموظفون ومستحقات الرواتب (Employees, Attendance & Payroll)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(100),
    division_id VARCHAR(20) REFERENCES divisions(id),
    job_title VARCHAR(100) NOT NULL,
    monthly_salary NUMERIC(18, 4) NOT NULL DEFAULT 0,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    hire_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- PRESENT, ABSENT, LEAVE
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY,
    run_number VARCHAR(100) NOT NULL UNIQUE,
    month INT NOT NULL,
    year INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    total_gross NUMERIC(18, 4) NOT NULL DEFAULT 0,
    total_advances NUMERIC(18, 4) NOT NULL DEFAULT 0,
    total_deductions NUMERIC(18, 4) NOT NULL DEFAULT 0,
    total_net NUMERIC(18, 4) NOT NULL DEFAULT 0,
    prepared_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id), -- MANDATORY ADMIN APPROVAL BEFORE PAYMENT
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. إعدادات النظام (Company Settings)
CREATE TABLE IF NOT EXISTS company_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- الفهارس لتحسين الأداء وسرعة الاستعلام (Indexes)
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_division ON journal_entries(division_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batches_mat ON inventory_batches(material_id, division_id);
CREATE INDEX IF NOT EXISTS idx_material_issues_proj ON material_issues(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_cust ON sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_receipt_vouchers_cust ON receipt_vouchers(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at);

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema')
ON CONFLICT (version) DO NOTHING;
