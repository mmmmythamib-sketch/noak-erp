import { Account, AccountType, DivisionId } from '../../../shared/types';

export interface DefaultAccountDefinition {
  code: string;
  nameAr: string;
  nameEn: string;
  type: AccountType;
  parentCode?: string;
  divisionId?: DivisionId | null;
  isSystem: boolean;
}

export const DEFAULT_CHART_OF_ACCOUNTS: DefaultAccountDefinition[] = [
  // ================= 1. الأصول (Assets) =================
  { code: '1000', nameAr: 'الأصول', nameEn: 'Assets', type: 'ASSET', isSystem: true },
  
  // 1100 النقد وما يعادله
  { code: '1100', nameAr: 'النقدية والأرصدة لدى البنوك', nameEn: 'Cash and Bank Balances', type: 'ASSET', parentCode: '1000', isSystem: true },
  { code: '1110', nameAr: 'صندوق الشركة الرئيسي (نقد)', nameEn: 'Main Cash Safe', type: 'ASSET', parentCode: '1100', isSystem: true },
  { code: '1120', nameAr: 'الحساب البنكي الجاري', nameEn: 'Current Bank Account', type: 'ASSET', parentCode: '1100', isSystem: true },

  // 1200 المدينون وحسابات القبض
  { code: '1200', nameAr: 'المدينون وحسابات القبض', nameEn: 'Accounts Receivable', type: 'ASSET', parentCode: '1000', isSystem: true },
  { code: '1210', nameAr: 'ذمم العملاء المدينة', nameEn: 'Trade Customer Receivables', type: 'ASSET', parentCode: '1200', isSystem: true },
  { code: '1220', nameAr: 'سلف الموظفين', nameEn: 'Employee Advances', type: 'ASSET', parentCode: '1200', isSystem: true },

  // 1300 المخزون (مستقل لكل قسم)
  { code: '1300', nameAr: 'المخزون السلعي', nameEn: 'Inventory Assets', type: 'ASSET', parentCode: '1000', isSystem: true },
  { code: '1310', nameAr: 'مخزون مواد قسم النجارة والديكور', nameEn: 'Wood Division Inventory', type: 'ASSET', parentCode: '1300', divisionId: 'WOOD', isSystem: true },
  { code: '1320', nameAr: 'مخزون مواد قسم الألمنيوم', nameEn: 'Aluminum Division Inventory', type: 'ASSET', parentCode: '1300', divisionId: 'ALUMINUM', isSystem: true },

  // ================= 2. الخصوم والالتزامات (Liabilities) =================
  { code: '2000', nameAr: 'الخصوم والالتزامات', nameEn: 'Liabilities', type: 'LIABILITY', isSystem: true },
  
  // 2100 الدائنون
  { code: '2100', nameAr: 'الدائنون وحسابات الدفع', nameEn: 'Accounts Payable', type: 'LIABILITY', parentCode: '2000', isSystem: true },
  { code: '2110', nameAr: 'ذمم الموردين الدائنة', nameEn: 'Trade Supplier Payables', type: 'LIABILITY', parentCode: '2100', isSystem: true },

  // 2200 مستحقات والتزامات متداولة
  { code: '2200', nameAr: 'مستحقات والتزامات متداولة', nameEn: 'Accrued Current Liabilities', type: 'LIABILITY', parentCode: '2000', isSystem: true },
  { code: '2210', nameAr: 'رواتب وأجور مستحقة الأداء', nameEn: 'Accrued Payroll Payable', type: 'LIABILITY', parentCode: '2200', isSystem: true },
  { code: '2220', nameAr: 'دفعات مقدمة من العملاء (أمانات عقود)', nameEn: 'Customer Contract Advances', type: 'LIABILITY', parentCode: '2200', isSystem: true },
  { code: '2230', nameAr: 'أمانات الضرائب والرسوم', nameEn: 'Taxes and Fees Payable', type: 'LIABILITY', parentCode: '2200', isSystem: false },

  // ================= 3. حقوق الملكية ورؤوس الأموال (Equity) =================
  { code: '3000', nameAr: 'حقوق الملكية', nameEn: 'Equity', type: 'EQUITY', isSystem: true },
  
  // قسم النجارة (مستقل تماماً)
  { code: '3100', nameAr: 'رؤوس أموال شركاء قسم النجارة', nameEn: 'Wood Division Partners Capital', type: 'EQUITY', parentCode: '3000', divisionId: 'WOOD', isSystem: true },
  { code: '3200', nameAr: 'جاري ومسحوبات شركاء قسم النجارة', nameEn: 'Wood Division Partners Current/Drawings', type: 'EQUITY', parentCode: '3000', divisionId: 'WOOD', isSystem: true },

  // قسم الألمنيوم (مستقل تماماً)
  { code: '3300', nameAr: 'رؤوس أموال شركاء قسم الألمنيوم', nameEn: 'Aluminum Division Partners Capital', type: 'EQUITY', parentCode: '3000', divisionId: 'ALUMINUM', isSystem: true },
  { code: '3400', nameAr: 'جاري ومسحوبات شركاء قسم الألمنيوم', nameEn: 'Aluminum Division Partners Current/Drawings', type: 'EQUITY', parentCode: '3000', divisionId: 'ALUMINUM', isSystem: true },

  // الأرباح والاحتياطيات
  { code: '3500', nameAr: 'أرباح (خسائر) مدورة مرحلة', nameEn: 'Retained Earnings', type: 'EQUITY', parentCode: '3000', isSystem: true },
  { code: '3600', nameAr: 'احتياطي عام وتوسعات', nameEn: 'General Reserve', type: 'EQUITY', parentCode: '3000', isSystem: false },

  // ================= 4. الإيرادات (Revenues) =================
  { code: '4000', nameAr: 'الإيرادات', nameEn: 'Revenues', type: 'REVENUE', isSystem: true },
  { code: '4100', nameAr: 'إيرادات مبيعات ومشاريع النجارة والديكور', nameEn: 'Wood Division Sales Revenue', type: 'REVENUE', parentCode: '4000', divisionId: 'WOOD', isSystem: true },
  { code: '4200', nameAr: 'إيرادات مبيعات ومشاريع الألمنيوم', nameEn: 'Aluminum Division Sales Revenue', type: 'REVENUE', parentCode: '4000', divisionId: 'ALUMINUM', isSystem: true },

  // ================= 5. كلفة المواد المباشرة المنصرفة للمشاريع (Direct Material Costs) =================
  { code: '5100', nameAr: 'كلفة المواد المنصرفة للمشاريع', nameEn: 'Direct Project Material Costs', type: 'DIRECT_COST', isSystem: true },
  { code: '5110', nameAr: 'كلفة المواد المباشرة - مشاريع النجارة', nameEn: 'Wood Direct Material Cost', type: 'DIRECT_COST', parentCode: '5100', divisionId: 'WOOD', isSystem: true },
  { code: '5120', nameAr: 'كلفة المواد المباشرة - مشاريع الألمنيوم', nameEn: 'Aluminum Direct Material Cost', type: 'DIRECT_COST', parentCode: '5100', divisionId: 'ALUMINUM', isSystem: true },

  // ================= 6. المصاريف التشغيلية والتالف (Operating Expenses & Waste) =================
  { code: '5200', nameAr: 'مصاريف التالف والهدر غير المحمل على المشاريع', nameEn: 'Approved Waste & Damage Expenses', type: 'EXPENSE', isSystem: true },
  { code: '5210', nameAr: 'تالف وهدر ورشة النجارة (مصروف عام)', nameEn: 'Wood Workshop Waste Expense', type: 'EXPENSE', parentCode: '5200', divisionId: 'WOOD', isSystem: true },
  { code: '5220', nameAr: 'تالف وهدر ورشة الألمنيوم (مصروف عام)', nameEn: 'Aluminum Workshop Waste Expense', type: 'EXPENSE', parentCode: '5200', divisionId: 'ALUMINUM', isSystem: true },

  // الرواتب والأجور (مصروف تشغيلي، غير مضاف لتكلفة المواد المباشرة)
  { code: '5300', nameAr: 'الرواتب والأجور ومستحقات العاملين', nameEn: 'Salaries and Wages Expenses', type: 'EXPENSE', isSystem: true },
  { code: '5310', nameAr: 'أجور ورواتب عمال قسم النجارة', nameEn: 'Wood Division Wages Expense', type: 'EXPENSE', parentCode: '5300', divisionId: 'WOOD', isSystem: true },
  { code: '5320', nameAr: 'أجور ورواتب عمال قسم الألمنيوم', nameEn: 'Aluminum Division Wages Expense', type: 'EXPENSE', parentCode: '5300', divisionId: 'ALUMINUM', isSystem: true },
  { code: '5330', nameAr: 'أجور ورواتب الإدارة العامة المشتركة', nameEn: 'Shared Administration Wages Expense', type: 'EXPENSE', parentCode: '5300', isSystem: true },

  // المصاريف الإدارية والعمومية
  { code: '5400', nameAr: 'المصاريف التشغيلية والإدارية والعمومية', nameEn: 'General & Administrative Expenses', type: 'EXPENSE', isSystem: true },
  { code: '5410', nameAr: 'إيجار المعامل والمعارض', nameEn: 'Workshop & Showroom Rent', type: 'EXPENSE', parentCode: '5400', isSystem: true },
  { code: '5420', nameAr: 'كهرباء ومياه ومحروقات', nameEn: 'Utilities & Fuel', type: 'EXPENSE', parentCode: '5400', isSystem: true },
  { code: '5430', nameAr: 'صيانة دورية للآلات والمعدات', nameEn: 'Equipment Maintenance', type: 'EXPENSE', parentCode: '5400', isSystem: true },
  { code: '5440', nameAr: 'مصاريف نقل وشحن بضائع عامة', nameEn: 'General Freight & Transport', type: 'EXPENSE', parentCode: '5400', isSystem: true },
  { code: '5450', nameAr: 'قرطاسية ومستلزمات مكتبية واتصالات', nameEn: 'Office Supplies & Telecommunications', type: 'EXPENSE', parentCode: '5400', isSystem: false },
];
