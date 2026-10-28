/**
 * NOAK ERP — Core Shared Types & Interfaces
 * Production System for Woodwork & Aluminum Fabrication
 */

export type DivisionId = 'WOOD' | 'ALUMINUM';

export interface Division {
  id: DivisionId;
  nameAr: string;
  nameEn: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export type UserRole = 
  | 'ADMIN'                 // مدير النظام (Company Administrator)
  | 'ACCOUNTANT'            // محاسب (Accountant)
  | 'WOOD_MANAGER'          // مدير قسم النجارة والديكور (Wood Division Manager)
  | 'ALUMINUM_MANAGER'      // مدير قسم الألمنيوم (Aluminum Division Manager)
  | 'WAREHOUSE_KEEPER'      // أمين المستودع (Warehouse Keeper)
  | 'SALES_REP'             // موظف المبيعات (Sales Employee)
  | 'ATTENDANCE_OFFICER';   // مسؤول الحضور (Attendance Officer)

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT_DRAFT'
  | 'SUBMIT'
  | 'APPROVE'
  | 'POST'
  | 'CANCEL'
  | 'PRINT'
  | 'EXPORT'
  | 'MANAGE_USERS'
  | 'MANAGE_SETTINGS'
  | 'BACKUP'
  | 'RESTORE';

export type PermissionResource =
  | 'QUOTATION'
  | 'CONTRACT'
  | 'PROJECT'
  | 'PURCHASE'
  | 'INVENTORY'
  | 'MATERIAL_ISSUE'
  | 'PRODUCTION'
  | 'SALES_INVOICE'
  | 'RECEIPT_VOUCHER'
  | 'PAYMENT_VOUCHER'
  | 'JOURNAL'
  | 'PARTNER'
  | 'PAYROLL'
  | 'REPORTS'
  | 'SETTINGS';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  divisionId?: DivisionId | null; // null = Company-wide (Admin/Accountant)
  isActive: boolean;
  permissions?: string[];
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  divisionId?: DivisionId | null;
  timestamp: string;
}

export type DocumentStatus =
  | 'DRAFT'              // مسودة
  | 'SUBMITTED'          // بانتظار الاعتماد
  | 'APPROVED'           // معتمد
  | 'POSTED'             // مرحل
  | 'PARTIALLY_SETTLED'  // مسدد جزئياً
  | 'FULLY_SETTLED'      // مسدد كلياً
  | 'CANCELLED';         // ملغى

export type AccountType =
  | 'ASSET'              // أصول
  | 'LIABILITY'          // خصوم
  | 'EQUITY'             // حقوق ملكية ورؤوس أموال
  | 'REVENUE'            // إيرادات
  | 'DIRECT_COST'        // كلفة مواد مباشرة
  | 'EXPENSE';           // مصاريف تشغيلية وعامة

export interface Account {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  type: AccountType;
  parentId?: string | null;
  divisionId?: DivisionId | null; // null = General / Company-level
  isSystem: boolean;
  balance: string; // Decimal representation
  isActive: boolean;
}

export interface JournalLine {
  id?: string;
  accountId: string;
  accountCode?: string;
  accountNameAr?: string;
  debit: string;   // Decimal string
  credit: string;  // Decimal string
  description?: string;
  divisionId?: DivisionId | null;
  costCenterId?: string | null;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  divisionId?: DivisionId | null;
  status: DocumentStatus;
  lines: JournalLine[];
  sourceDocumentType?: string;
  sourceDocumentId?: string;
  postedBy?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  pipelineStage: 'LEAD' | 'CONTACTED' | 'MEASUREMENT' | 'QUOTATION' | 'NEGOTIATION' | 'WON' | 'LOST';
  followUpDate?: string;
  assignedEmployeeId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export type ContactType = 'CUSTOMER' | 'SUPPLIER';

export interface CustomerPayment {
  id: string;
  voucherNumber: string;
  contactId: string;
  contactName: string;
  amount: string; // المبلغ المستلم/المدفوع
  date: string; // تاريخ الدفعة
  paymentMethod: 'CASH' | 'BANK' | 'CHEQUE'; // طريقة القبض
  remainingAfter: string; // المتبقي بعد هذه الدفعة
  notes?: string; // البيان / الغرض
  receivedBy?: string; // المستلم / المحاسب
  projectName?: string; // اسم المشروع المرتبط
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  code: string;
  name: string;
  type: ContactType;
  phone: string;
  address?: string;
  divisionId?: DivisionId | null;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  paymentHistory?: CustomerPayment[];
  notes?: string;
  email?: string;
  commercialRegister?: string;
  pipelineStage?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Material {
  id: string;
  code: string;
  nameAr: string;
  divisionId: DivisionId;
  unit: string; // قطعة, لوح, متر طولي, متر مربع, كغم
  length?: number | null;
  width?: number | null;
  thickness?: number | null;
  minStockAlert: number;
  currentStock: string;
  notes?: string;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  code: string;
  nameAr: string;
  divisionId: DivisionId;
  location?: string;
  isActive: boolean;
}

export interface InventoryBatch {
  id: string;
  materialId: string;
  materialNameAr?: string;
  warehouseId: string;
  divisionId: DivisionId;
  purchaseInvoiceId: string;
  batchNumber: string;
  initialQuantity: string;
  remainingQuantity: string;
  unitCost: string; // Exact purchase price per unit
  receivedDate: string;
}

export interface PurchaseInvoiceLine {
  id?: string;
  materialCode: string;
  materialNameAr: string;
  unit: string;
  quantity: string;
  unitCost: string;
  lineTotal: string;
  notes?: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber?: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  divisionId: DivisionId;
  warehouseId: string;
  warehouseName?: string;
  date: string;
  paymentMethod: 'CASH' | 'BANK' | 'CHEQUE' | 'CREDIT';
  status: DocumentStatus;
  lines: PurchaseInvoiceLine[];
  subtotal: string;
  discount: string;
  grandTotal: string;
  paidAmount: string;
  remainingAmount: string;
  notes?: string;
  receivedBy?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  customerId: string;
  customerName?: string;
  divisionId: DivisionId;
  contractId?: string;
  managerId?: string;
  managerName?: string;
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  currentStage: string; // تصميم ومقاسات, شراء وتجهيز, تصنيع, تركيب, تسليم
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  contractAmount: string;
  invoicedAmount: string;
  collectedAmount: string;
  actualMaterialCost: string; // ONLY actual issued materials, NOT labor/rent
  notes?: string;
  createdAt: string;
}

export interface QuotationLine {
  id?: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discount: string;
  tax: string;
  lineTotal: string;
}

export interface QuotationImage {
  id: string;
  name: string;
  url: string; // base64 DataURL or image path
  type: 'DECOR' | 'BLUEPRINT'; // ديكور أو مخطط هندسي
  notes?: string;
  uploadedAt: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  subject?: string; // موضوع العرض / المشروع
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  divisionId: DivisionId;
  date: string;
  validUntil: string;
  status: DocumentStatus | 'ACCEPTED' | 'CONVERTED_TO_CONTRACT';
  lines: QuotationLine[];
  images?: QuotationImage[];
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  grandTotal: string;
  printShowItemized: boolean; // True = detail line prices, False = Grand total only
  paymentTerms?: string;
  approvedBy?: string;
  contractId?: string;
  contractNumber?: string;
  projectId?: string;
  notes?: string;
  createdAt: string;
}

export interface ContractInstallment {
  id?: string;
  installmentNumber: number;
  description: string;
  dueDate: string;
  amount: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  subject?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  divisionId: DivisionId;
  quotationId?: string;
  quotationNumber?: string;
  projectId?: string;
  projectNumber?: string;
  date: string;
  deliveryDate?: string;
  totalAmount: string;
  advanceAmount?: string;
  status: DocumentStatus | 'ACTIVE' | 'SIGNED' | 'COMPLETED';
  installments: ContractInstallment[];
  scopeOfWork?: string;
  warrantyTerms?: string;
  penaltyClause?: string;
  notes?: string;
  approvedBy?: string;
  signedByCustomer?: string;
  signedDate?: string;
  createdAt: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  divisionId: DivisionId;
  projectId?: string;
  date: string;
  dueDate?: string;
  status: DocumentStatus;
  subtotal: string;
  taxTotal: string;
  grandTotal: string;
  paidAmount: string;
  balanceAmount: string;
  approvedBy?: string;
  postedBy?: string;
  createdAt: string;
}

export interface ReceiptVoucher {
  id: string;
  voucherNumber: string;
  customerId: string;
  customerName?: string;
  divisionId: DivisionId;
  projectId?: string;
  invoiceId?: string;
  date: string;
  amount: string;
  paymentMethod: 'CASH' | 'BANK';
  referenceNumber?: string;
  status: DocumentStatus;
  notes?: string;
  approvedBy?: string;
  postedBy?: string;
  createdAt: string;
}

export interface PaymentVoucher {
  id: string;
  voucherNumber: string;
  recipientName: string;
  divisionId: DivisionId | null; // null if company-level
  expenseAccountId?: string;
  supplierId?: string;
  partnerId?: string;
  date: string;
  amount: string;
  paymentMethod: 'CASH' | 'BANK';
  referenceNumber?: string;
  status: DocumentStatus;
  notes?: string;
  approvedBy?: string; // MANDATORY: Administrator must approve all outgoing payments
  postedBy?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'ELECTRICITY'
  | 'INTERNET'
  | 'RENT'
  | 'MAINTENANCE'
  | 'SALARIES'
  | 'HOSPITALITY'
  | 'FUEL_TRANSPORT'
  | 'OTHER';

export interface GeneralExpense {
  id: string;
  voucherNumber: string;
  date: string;
  category: ExpenseCategory;
  categoryLabelAr: string;
  divisionId: DivisionId | 'SHARED';
  amount: string;
  paymentMethod: 'CASH' | 'BANK' | 'CHEQUE';
  beneficiary: string;
  referenceInvoiceNo?: string;
  notes: string;
  approvedBy?: string;
  paidBy?: string;
  createdAt: string;
}

export interface MaterialIssue {
  id: string;
  issueNumber: string;
  projectId: string;
  projectName?: string;
  divisionId: DivisionId;
  batchId: string;
  materialId: string;
  materialNameAr?: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
  date: string;
  status: DocumentStatus;
  issuedBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface WasteRecord {
  id: string;
  recordNumber: string;
  divisionId: DivisionId;
  materialId: string;
  materialNameAr?: string;
  batchId: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
  reason: string;
  date: string;
  status: DocumentStatus;
  reportedBy: string;
  approvedBy?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  divisionId: DivisionId; // Strict division isolation: Partner belongs to Wood or Aluminum
  initialCapital: string;
  currentCapital: string;
  profitPercentage: string; // e.g., 50.00%
  totalWithdrawals: string;
  totalDistributions: string;
  isActive: boolean;
}

export interface ProfitDistribution {
  id: string;
  distributionNumber: string;
  divisionId: DivisionId;
  periodId: string;
  periodName: string;
  distributableProfit: string;
  reserveDeduction: string;
  netDistributed: string;
  partnerId: string;
  partnerName?: string;
  percentage: string;
  amount: string;
  status: DocumentStatus;
  approvedBy?: string;
  date: string;
}

export interface PartnerAdvance {
  id: string;
  voucherNumber: string;
  partnerId: string;
  partnerName: string;
  divisionId: DivisionId;
  date: string;
  amount: string;
  paymentMethod: 'CASH' | 'BANK';
  reason: string;
  status: 'ACTIVE' | 'SETTLED';
  paidBy?: string;
  createdAt: string;
}

export interface PartnerSettlementRecord {
  partnerId: string;
  partnerName: string;
  divisionId: DivisionId;
  profitPercentage: string;
  grossProfitShare: string;
  advancesDeducted: string;
  netPayableShare: string;
}

export interface PartnerSettlementCycle {
  id: string;
  settlementNumber: string;
  divisionId: DivisionId;
  periodName: string;
  startDate: string;
  endDate: string;
  totalRevenue: string;
  totalExpenses: string;
  netProfit: string;
  reserveDeduction: string;
  distributableProfit: string;
  records: PartnerSettlementRecord[];
  status: 'SETTLED' | 'PENDING';
  settledDate: string;
  notes?: string;
}

export interface Employee {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  divisionId: DivisionId | null; // null = shared employee
  jobTitle: string;
  monthlySalary: string;
  isShared: boolean;
  shiftStartTime?: string; // e.g. "08:00"
  shiftEndTime?: string;   // e.g. "16:00"
  workingDaysPerMonth?: number; // e.g. 26
  dailyHours?: number;     // e.g. 8
  hireDate: string;
  isActive: boolean;
}

export interface DailyAttendance {
  id: string;
  employeeId: string;
  employeeName: string;
  divisionId: DivisionId | 'SHARED';
  date: string; // YYYY-MM-DD
  clockIn: string; // "08:15"
  clockOut: string; // "17:30"
  scheduledIn: string; // "08:00"
  scheduledOut: string; // "16:00"
  lateMinutes: number;
  lateDeduction: string;
  overtimeMinutes: number;
  overtimeAddition: string;
  status: 'PRESENT' | 'LATE' | 'OVERTIME' | 'LATE_AND_OVERTIME';
  notes?: string;
  recordedBy?: string;
  createdAt: string;
}

export interface SalaryAdvance {
  id: string;
  voucherNumber: string;
  employeeId: string;
  employeeName: string;
  divisionId: DivisionId | 'SHARED';
  date: string;
  amount: string;
  reason: string;
  paymentMethod: 'CASH' | 'BANK';
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface ArchivedPayrollEmployeeRecord {
  employeeId: string;
  employeeName: string;
  divisionId: DivisionId | 'SHARED';
  baseSalary: string;
  additions: string;
  deductions: string;
  advances: string;
  netSalary: string;
  attendanceDaysCount: number;
  totalLateMinutes: number;
  totalOvertimeMinutes: number;
}

export interface ArchivedPayrollCycle {
  id: string;
  cycleNumber: string;
  monthNameAr: string;
  closedDate: string;
  totalBaseSalaries: string;
  totalAdditions: string;
  totalDeductions: string;
  totalAdvances: string;
  totalNetPaid: string;
  employeeCount: number;
  records: ArchivedPayrollEmployeeRecord[];
}

export interface PayrollRun {
  id: string;
  runNumber: string;
  month: number;
  year: number;
  status: DocumentStatus;
  totalGross: string;
  totalAdvances: string;
  totalDeductions: string;
  totalNet: string;
  preparedBy: string;
  approvedBy?: string; // Administrator approval required before payment
  date: string;
}

export interface CompanySettings {
  companyNameAr: string;
  companyNameEn: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  taxRegistrationNumber?: string;
  currency: string; // IQD
  sharedLaborWoodPercentage: string;     // Default 50.00
  sharedLaborAluminumPercentage: string; // Default 50.00
  autoLockMinutes: number;
  backupPath: string;
}

// ---------------------------------------------------------------------------
// Assets & Showroom Management (الأصول الثابتة ومعروضات المعرض)
// ---------------------------------------------------------------------------
export type FixedAssetCategory =
  | 'MACHINERY'            // آلات وماكينات الورش والـ CNC
  | 'VEHICLES'             // سيارات وشاحنات النقل
  | 'TOOLS_EQUIPMENT'      // عدد وأدوات كهربائية وهيدروليكية
  | 'BUILDINGS_PREMISES'   // مباني المعرض والورش والتجهيزات الثابتة
  | 'IT_OFFICE'            // أجهزة حاسوب وسيرفرات وتصميم هندسي
  | 'OTHER';               // أصول أخرى

export interface FixedAsset {
  id: string;
  assetCode: string;
  nameAr: string;
  divisionId: DivisionId | 'SHARED';
  category: FixedAssetCategory;
  categoryLabelAr: string;
  purchaseDate: string;
  originalCost: string; // IQD
  currentValue: string;  // IQD
  location: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED';
  notes?: string;
}

export interface DivisionAssetLumpSum {
  divisionId: DivisionId | 'SHARED';
  lumpSumAmount: string; // IQD
  lastUpdated: string;
  notes?: string;
}

export interface ShowroomItem {
  id: string;
  itemCode: string; // e.g. "SHW-WOD-001"
  nameAr: string;
  divisionId: DivisionId;
  category: string;
  productionCost: string; // IQD - تكلفة التصنيع (أصل المعرض)
  proposedSalePrice: string; // IQD - سعر العرض المقترح
  status: 'IN_SHOWROOM' | 'SOLD';
  displayDate: string;
  dimensions?: string;
  notes?: string;
  // Sale transaction data (if status === 'SOLD')
  soldDate?: string;
  actualSalePrice?: string; // IQD - سعر البيع الفعلي المحصل
  buyerName?: string;
  buyerPhone?: string;
  paymentMethod?: 'CASH' | 'BANK';
  netProfit?: string; // IQD = actualSalePrice - productionCost
  voucherNumber?: string;
}
