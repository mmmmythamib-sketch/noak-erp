# NOAK ERP — Technical Architecture & Component Specification

## 1. System Overview
**NOAK ERP** is a high-reliability, desktop-first Enterprise Resource Planning application designed specifically for industrial manufacturing and interior contracting firms operating in woodwork and aluminum fabrication.

### Core Architectural Pillars
1. **Strict Divisional Isolation**: Woodwork and Aluminum operations maintain separate ledgers, warehouses, projects, revenue, expenses, and partner equity accounts.
2. **Double-Entry Accrual Accounting**: All transactions balance ($\sum \text{Debits} = \sum \text{Credits}$) and adhere to accrual revenue/cost recognition.
3. **Specific Batch Costing**: Inventory valuation and project material costs are derived strictly from specific purchase batches, avoiding arbitrary average distortions.
4. **Section 14 Compliance**: Workshop rent, utilities, general overhead, and shared labor are recorded as operating expenses and are **never** bundled into project material cost.
5. **Native Arabic RTL Experience**: Built specifically for right-to-left workflows, Cairo typography, and pixel-perfect A4/A5 print layouts.
6. **Future-Proof Deployment**: Operates out-of-the-box on a standalone Windows workstation using PostgreSQL, with seamless LAN migration capabilities.

---

## 2. 5-Layer Architectural Boundaries

```
+--------------------------------------------------------------------------+
| 1. PRESENTATION LAYER (React 18 + Tailwind CSS + Cairo Typography)      |
|    - Split Dashboard (Independent Wood & Aluminum Panels)                |
|    - High-density Arabic forms, data tables, search filters              |
|    - A4/A5 Print Layouts with printable quotation toggle                 |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| 2. APPLICATION LAYER (Workflows & Use Cases)                            |
|    - Document Lifecycle (Draft -> Submitted -> Approved -> Posted)       |
|    - Material Issue Orchestration                                        |
|    - Billing & Receipt Voucher Allocations                               |
|    - Payroll Generation & Shared Labor Distribution                      |
|    - Period Closing & Partner Profit Distribution                        |
|    - Disaster Recovery & Backup Integrity Verification                   |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| 3. DOMAIN LAYER (Pure Business Invariants)                               |
|    - DoubleEntryValidator (Debits == Credits, No negatives, Reversals)   |
|    - ProjectCostingEngine (Section 14: Material cost = Issued batches)   |
|    - InventoryBatchEngine (Non-negative stock, Batch unit cost)          |
|    - ProfitDistributionCalculator (Section 15: Post-closing, Reserves)   |
|    - SharedLaborAllocator (Section 16: Zero-drift divisional allocation) |
|    - PreciseMoney (Arbitrary-precision math via decimal.js)              |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| 4. PERSISTENCE LAYER (PostgreSQL & Node pg Pool)                        |
|    - ACID Transaction Boundaries (`withTransaction`)                     |
|    - Versioned Migration Runner (`schema_migrations`)                    |
|    - Concurrency-safe Document Numbering (`document_sequences`)          |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| 5. INFRASTRUCTURE & SECURITY LAYER                                      |
|    - Cryptographic Password Hashing (scrypt / PBKDF2)                    |
|    - Immutable Audit Logger (`audit_logs`) with credential masking       |
|    - Automated Daily Backup Engine (JSON + SHA-256)                      |
|    - Config Manager (`config.json`)                                      |
+--------------------------------------------------------------------------+
```

---

## 3. Database Schema Overview & Migration Tracking

The database consists of 16 core relational modules tracked in versioned migrations (`src/core/database/migrations/001_initial_schema.sql`):
1. `divisions`: Wood (`WOOD`) and Aluminum (`ALUMINUM`).
2. `users` & `user_permissions`: Granular role-based access control.
3. `audit_logs`: Immutable security journal with before/after state snapshots.
4. `document_sequences`: Atomic sequence generators for `QUO`, `CNT`, `PRJ`, `PUR`, `ISS`, `INV`, `RCP`, `PAY`, `JV`.
5. `chart_of_accounts` & `accounting_periods`: Standard Arabic COA and period close locks.
6. `journal_entries` & `journal_lines`: Double-entry transaction records.
7. `customers` & `suppliers`: Shared business partner directories.
8. `warehouses` & `materials`: Independent warehouses and raw material catalogs.
9. `purchases` & `inventory_batches`: Actual unit cost tracking by purchase receipt.
10. `quotations` & `contracts`: Commercial sales pipeline with milestone installments.
11. `projects`: Industrial manufacturing orders and lifecycle stages.
12. `material_issues` & `material_returns`: Project consumption tracking.
13. `waste_records`: Separate workshop waste and damage expenses.
14. `sales_invoices`, `receipt_vouchers`, `payment_vouchers`: Financial transactions.
15. `partners` & `profit_distributions`: Divisional equity and post-closing distributions.
16. `employees`, `attendance_records`, `payroll_runs`: Payroll and shared labor allocation.
