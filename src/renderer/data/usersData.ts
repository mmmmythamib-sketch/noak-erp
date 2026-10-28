export interface SystemUser {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  title: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ACCOUNTANT' | 'MANAGER' | 'SALES';
  roleArabic: string;
  roleBadge: string;
  divisionId?: 'WOOD' | 'ALUMINUM' | 'ALL' | null;
  permissions: 'ALL' | string[];
  isActive: boolean;
  initials: string;
  avatarColor: string;
  phone?: string;
  email?: string;
}

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-abbas',
    username: 'abbas',
    password: 'noak2026',
    fullName: 'عباس علي سلمان',
    title: 'المدير العام والرئيس التنفيذي',
    role: 'SUPER_ADMIN',
    roleArabic: 'المدير العام (صلاحيات كاملة)',
    roleBadge: 'Super Admin',
    divisionId: 'ALL',
    permissions: 'ALL',
    isActive: true,
    initials: 'ع.س',
    avatarColor: 'bg-emerald-600',
    phone: '07701112233',
    email: 'abbas@noak.iq',
  },
  {
    id: 'usr-maytham',
    username: 'maytham',
    password: '1988',
    fullName: 'م. ميثم ابراهيم',
    title: 'مبرمج ومطور النظام',
    role: 'SUPER_ADMIN',
    roleArabic: 'مبرمج ومطور النظام (التحكم الكامل)',
    roleBadge: 'System Programmer',
    divisionId: 'ALL',
    permissions: 'ALL',
    isActive: true,
    initials: 'م.إ',
    avatarColor: 'bg-indigo-600',
    phone: '07700000000',
    email: 'maytham@noak.iq',
  },
  {
    id: 'usr-hassan',
    username: 'hassan',
    password: 'noak2026',
    fullName: 'حسن المصري',
    title: 'مدير قسم الألمنيوم والشريك المفوض',
    role: 'ADMIN',
    roleArabic: 'مدير قسم الألمنيوم',
    roleBadge: 'Division Manager',
    divisionId: 'ALUMINUM',
    permissions: ['PROJECT', 'INVENTORY', 'CONTRACT', 'SALES'],
    isActive: true,
    initials: 'ح.م',
    avatarColor: 'bg-sky-600',
    phone: '07704445566',
    email: 'hassan@noak.iq',
  },
  {
    id: 'usr-haider',
    username: 'haider',
    password: 'noak2026',
    fullName: 'حيدر الصراف',
    title: 'المحاسب المالي وأمين الصندوق',
    role: 'ACCOUNTANT',
    roleArabic: 'المحاسب المالي',
    roleBadge: 'Accountant',
    divisionId: 'ALL',
    permissions: ['RECEIPT_VOUCHER', 'PAYMENT_VOUCHER', 'JOURNAL', 'REPORTS'],
    isActive: true,
    initials: 'ح.ص',
    avatarColor: 'bg-purple-600',
    phone: '07801122334',
    email: 'finance@noak.iq',
  },
];
