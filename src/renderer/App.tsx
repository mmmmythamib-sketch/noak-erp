import React, { useState, useEffect } from 'react';
import noakLogo from './assets/noak-logo-2026.png';
import {
  Building2,
  FolderKanban,
  FileText,
  FileCheck2,
  Boxes,
  ArrowUpRight,
  Calculator,
  Users2,
  UserCheck,
  User,
  Globe,
  Moon,
  Sun,
  Settings,
  Bell,
  Search,
  Plus,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Info,
  Download,
  CheckCircle2,
  Layers,
  Sparkles,
  Database,
  Users,
  UserPlus,
  UserX,
  Phone,
  MapPin,
  Filter,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  LogOut,
  RefreshCw,
  FileSpreadsheet,
  ArrowDownLeft,
  X,
  Copy,
  Check,
  Trash2,
  Wallet,
  Receipt,
  Clock,
  TrendingUp,
  Calendar,
  Briefcase,
  Image as ImageIcon,
  Upload,
  Edit3,
  FileSignature,
  FilePlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  CreditCard,
  ExternalLink,
  Package,
  PackagePlus,
  PackageCheck,
  ShoppingBag,
  Zap,
  Wifi,
  Wrench,
  Archive,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Landmark,
  Store,
  Tags,
  Square,
  CheckSquare
} from 'lucide-react';
import {
  DivisionId,
  Project,
  Quotation,
  QuotationLine,
  QuotationImage,
  Contract,
  MaterialIssue,
  Partner,
  InventoryBatch,
  JournalEntry,
  ContactRecord,
  CustomerPayment,
  DocumentStatus,
  PurchaseInvoice,
  PurchaseInvoiceLine,
  Material,
  Warehouse,
  GeneralExpense,
  ExpenseCategory,
  Employee,
  DailyAttendance,
  SalaryAdvance,
  ArchivedPayrollCycle,
  ArchivedPayrollEmployeeRecord,
  PartnerAdvance,
  PartnerSettlementCycle,
  PartnerSettlementRecord,
  FixedAsset,
  FixedAssetCategory,
  DivisionAssetLumpSum,
  ShowroomItem,
} from '../shared/types';
import { tafqeetIQD } from '../core/utils/tafqeet';
import {
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_WAREHOUSES,
  INITIAL_MATERIALS,
  INITIAL_BATCHES,
  INITIAL_PROJECTS,
  INITIAL_PARTNERS,
  INITIAL_EMPLOYEES,
  INITIAL_CONTACTS,
  INITIAL_QUOTATIONS,
  INITIAL_CONTRACTS,
  INITIAL_MATERIAL_ISSUES,
  INITIAL_PURCHASE_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_ATTENDANCES,
  INITIAL_SALARY_ADVANCES,
  INITIAL_ARCHIVED_PAYROLLS,
  INITIAL_PARTNER_ADVANCES,
  INITIAL_SETTLEMENT_CYCLES,
  INITIAL_FIXED_ASSETS,
  INITIAL_DIVISION_LUMP_SUMS,
  INITIAL_SHOWROOM_ITEMS,
} from './data/initialData';
import { ProjectCostingEngine } from '../core/domain/costing/project-costing';
import { InventoryBatchEngine } from '../core/domain/inventory/batch-engine';
import { DoubleEntryValidator } from '../core/domain/accounting/double-entry';
import { ProfitDistributionCalculator } from '../core/domain/partners/profit-distribution';
import { SharedLaborAllocator } from '../core/domain/payroll/labor-allocation';
import { PreciseMoney, formatThousands, cleanNumeric, formatInputNumber } from '../core/utils/decimal';
import { SequenceFormatter } from '../core/utils/sequence';
import { LoginScreen } from './components/LoginScreen';
import { INITIAL_SYSTEM_USERS, SystemUser } from './data/usersData';
// ----------------------------------------------------------------------
// Reusable Action Gear Dropdown Menu (قائمة الإجراءات بالترس مع ظهور طافي فوق الكارت التالي)
// ----------------------------------------------------------------------
export interface ActionMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  badge?: string;
  description?: string;
  disabled?: boolean;
}

export interface ActionGearMenuProps {
  items: ActionMenuItem[];
  title?: string;
  dropUp?: boolean;
  align?: 'left' | 'right';
}

export function ActionGearMenu({
  items,
  title = 'قائمة الإجراءات',
  dropUp = false,
  align = 'left',
}: ActionGearMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleItemClick = (e: React.MouseEvent, itemOnClick: () => void, disabled?: boolean) => {
    e.stopPropagation();
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(false);
    itemOnClick();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div
      className={`relative inline-block text-right ${isOpen ? 'z-50' : 'z-10'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gear Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center ${
          isOpen
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20 rotate-45'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200 shadow-xs'
        }`}
        title="قائمة الإجراءات والعمليات"
        aria-label="قائمة الإجراءات"
        aria-expanded={isOpen}
      >
        <Settings className="w-4 h-4 transition-transform duration-200" />
      </button>

      {/* Floating Action Menu Dropdown */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${
            dropUp ? 'bottom-full mb-1.5 origin-bottom-left' : 'top-full mt-1.5 origin-top-left'
          } ${
            align === 'right' ? 'right-0' : 'left-0'
          } w-64 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 ring-1 ring-slate-900/10 p-1.5 z-[100] text-right animate-in fade-in zoom-in-95 duration-100 select-none`}
          style={{ minWidth: '220px' }}
        >
          {/* Header */}
          <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {title}
            </span>
            <span className="text-[10px] font-mono text-slate-300">⚙️ خيارات</span>
          </div>

          {/* Action Items List */}
          <div className="py-1 space-y-0.5">
            {items.map((item) => {
              const isDanger = item.variant === 'danger';
              const isPrimary = item.variant === 'primary';
              const isSuccess = item.variant === 'success';
              const isWarning = item.variant === 'warning';

              let colorClasses = 'text-slate-700 hover:bg-slate-50 hover:text-slate-900';
              let iconBg = 'bg-slate-100 text-slate-600';

              if (isDanger) {
                colorClasses = 'text-rose-700 hover:bg-rose-50 hover:text-rose-800';
                iconBg = 'bg-rose-50 text-rose-600';
              } else if (isPrimary) {
                colorClasses = 'text-blue-700 hover:bg-blue-50 hover:text-blue-800';
                iconBg = 'bg-blue-50 text-blue-600';
              } else if (isSuccess) {
                colorClasses = 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800';
                iconBg = 'bg-emerald-50 text-emerald-600';
              } else if (isWarning) {
                colorClasses = 'text-amber-800 hover:bg-amber-50 hover:text-amber-900';
                iconBg = 'bg-amber-50 text-amber-700';
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={(e) => handleItemClick(e, item.onClick, item.disabled)}
                  className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-right group ${colorClasses} ${
                    item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${iconBg}`}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col text-right truncate">
                      <span className="truncate leading-tight">{item.label}</span>
                      {item.description && (
                        <span className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable CSV Exporter Helper
// ----------------------------------------------------------------------
function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitize = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };
  const csvContent = '\uFEFF' + [headers.map(sanitize).join(','), ...rows.map(r => r.map(sanitize).join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ----------------------------------------------------------------------
// Unified Export Button (زر موحد لتصدير الكشف: Excel و PDF)
// ----------------------------------------------------------------------
export interface UnifiedExportButtonProps {
  onExportExcel: () => void;
  onExportPdf?: () => void;
  label?: string;
  excelLabel?: string;
  pdfLabel?: string;
  className?: string;
}

export function UnifiedExportButton({
  onExportExcel,
  onExportPdf = () => window.print(),
  label = 'تصدير الكشف',
  excelLabel = 'تصدير كشف Excel (CSV)',
  pdfLabel = 'تصدير وطباعة PDF (A4)',
  className = '',
}: UnifiedExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition active:scale-95 shrink-0"
        title="تصدير الكشف (Excel و PDF)"
      >
        <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportExcel();
            }}
            className="w-full text-right px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">{excelLabel}</div>
              <div className="text-[10px] text-slate-400">جدول بيانات متوافق مع Excel</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportPdf();
            }}
            className="w-full text-right px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-200 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">{pdfLabel}</div>
              <div className="text-[10px] text-slate-400">تنسيق رسمي للطباعة والحفظ PDF</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App(props?: {
  rootActiveUser?: SystemUser;
  rootSystemUsers?: SystemUser[];
  onRootLogout?: () => void;
}) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'projects' | 'quotations' | 'inventory' | 'expenses' | 'issues' | 'assets' | 'accounting' | 'partners' | 'payroll' | 'settings'>('dashboard');
  const [activeDivision, setActiveDivision] = useState<DivisionId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  // Session-based dismissed notifications (تختفي مؤقتاً في الجلسة الحالية وتعاود الظهور في الجلسة القادمة إذا لم يتم اتخاذ إجراء)
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Top Bar System States (التاريخ، الساعة، المستخدم الحالي، تبديل اللغة، والوضع الليلي)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User Authentication & Session State (بوابة تسجيل الدخول السحابية)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [activeUser, setActiveUser] = useState<SystemUser>(() => {
    if (props?.rootActiveUser) return props.rootActiveUser;
    try {
      const saved = sessionStorage.getItem('noak_auth_session') || localStorage.getItem('noak_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.fullName) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SYSTEM_USERS[0]; // عباس علي سلمان (المدير العام - صلاحيات كاملة)
  });

  const [currentUser, setCurrentUser] = useState({
    name: activeUser?.fullName || INITIAL_SYSTEM_USERS[0].fullName,
    role: activeUser?.roleArabic || INITIAL_SYSTEM_USERS[0].roleArabic,
  });

  const handleLoginSuccess = (user: SystemUser) => {
    setActiveUser(user);
    setIsAuthenticated(true);
    setCurrentUser({
      name: user.fullName,
      role: user.roleArabic,
    });
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من النظام السحابي؟')) {
      try {
        sessionStorage.removeItem('noak_auth_session');
        localStorage.removeItem('noak_auth_session');
      } catch {
        // ignore
      }
      setIsAuthenticated(false);
      if (props?.onRootLogout) {
        props.onRootLogout();
      }
    }
  };

  // --------------------------------------------------------------------------
  // System Users Management & Cloud Domain Access (إدارة المستخدمين وكلمات المرور)
  // --------------------------------------------------------------------------
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('noak_system_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: SystemUser) => {
            if (u.id === 'usr-maytham' || u.username === 'maytham') {
              return {
                ...u,
                password: '1988',
                fullName: 'م. ميثم ابراهيم',
                title: 'مبرمج ومطور النظام',
                roleArabic: 'مبرمج ومطور النظام (التحكم الكامل)',
                roleBadge: 'System Programmer',
                initials: 'م.إ',
              };
            }
            return u;
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SYSTEM_USERS;
  });

  const saveSystemUsers = (newUsers: SystemUser[]) => {
    setSystemUsers(newUsers);
    try {
      localStorage.setItem('noak_system_users', JSON.stringify(newUsers));
    } catch (e) {
      console.error('Failed to save system users', e);
    }
  };

  // التحقق الحصري من هوية مبرمج ومطور النظام (م. ميثم ابراهيم)
  const isSystemProgrammer = Boolean(
    activeUser &&
      (activeUser.username?.toLowerCase() === 'maytham' ||
        activeUser.id === 'usr-maytham' ||
        activeUser.fullName?.includes('ميثم'))
  );

  // Feedback banner for user operations
  const [userMgmtFeedback, setUserMgmtFeedback] = useState<string | null>(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('noak2026');
  const [newUserRole, setNewUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'ACCOUNTANT' | 'MANAGER' | 'SALES'>('ACCOUNTANT');
  const [newUserDivision, setNewUserDivision] = useState<'WOOD' | 'ALUMINUM' | 'ALL'>('ALL');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserError, setNewUserError] = useState<string | null>(null);
  const [showAddUserPassword, setShowAddUserPassword] = useState(false);

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [targetUserForPassword, setTargetUserForPassword] = useState<SystemUser | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);

  const handleOpenAddUserModal = () => {
    if (!isSystemProgrammer) {
      alert('عذراً، صلاحية إضافة المستخدمين مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('noak2026');
    setNewUserRole('ACCOUNTANT');
    setNewUserDivision('ALL');
    setNewUserTitle('');
    setNewUserPhone('');
    setNewUserEmail('');
    setNewUserError(null);
    setShowAddUserPassword(false);
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setNewUserError(null);

    if (!isSystemProgrammer) {
      setNewUserError('عذراً، هذه الصلاحية مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }

    const cleanName = newUserName.trim();
    const cleanUsername = newUserUsername.trim().toLowerCase();
    const cleanPassword = newUserPassword.trim();

    if (!cleanName) {
      setNewUserError('يرجى إدخال اسم المستخدم الكامل.');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      setNewUserError('اسم تسجيل الدخول يجب أن يكون 3 أحرف إنجليزية على الأقل وبدون مسافات.');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      setNewUserError('اسم تسجيل الدخول يجب أن يحتوي فقط على أحرف إنجليزية وأرقام أو رموز (_.-).');
      return;
    }
    if (systemUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      setNewUserError(`اسم تسجيل الدخول (@${cleanUsername}) مستخدم بالفعل، يرجى اختيار اسم آخر.`);
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setNewUserError('كلمة المرور يجب أن لا تقل عن 4 خانات.');
      return;
    }

    const parts = cleanName.split(/\s+/).filter(Boolean);
    const initials = parts.length >= 2
      ? `${parts[0][0]}.${parts[1][0]}`
      : cleanName.slice(0, 2);

    const colors = [
      'bg-emerald-600',
      'bg-blue-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-indigo-600',
      'bg-rose-600',
      'bg-teal-600',
      'bg-cyan-600',
    ];
    const avatarColor = colors[systemUsers.length % colors.length];

    let roleArabic = 'المحاسب المالي';
    let roleBadge = 'Accountant';
    let defaultTitle = 'المحاسب المالي';
    let permissions: 'ALL' | string[] = ['RECEIPT_VOUCHER', 'PAYMENT_VOUCHER', 'JOURNAL', 'REPORTS'];

    if (newUserRole === 'SUPER_ADMIN') {
      roleArabic = 'المدير العام (صلاحيات كاملة)';
      roleBadge = 'Super Admin';
      defaultTitle = 'المدير العام';
      permissions = 'ALL';
    } else if (newUserRole === 'ADMIN') {
      roleArabic = 'مدير قسم';
      roleBadge = 'Division Manager';
      defaultTitle = newUserDivision === 'WOOD' ? 'مدير قسم الديكور والنجارة' : 'مدير قسم الألمنيوم';
      permissions = ['PROJECT', 'INVENTORY', 'CONTRACT', 'SALES'];
    } else if (newUserRole === 'ACCOUNTANT') {
      roleArabic = 'المحاسب المالي';
      roleBadge = 'Accountant';
      defaultTitle = 'المحاسب المالي';
      permissions = ['RECEIPT_VOUCHER', 'PAYMENT_VOUCHER', 'JOURNAL', 'REPORTS'];
    } else if (newUserRole === 'MANAGER') {
      roleArabic = 'مسؤول العمليات والمستودع';
      roleBadge = 'Operations Manager';
      defaultTitle = 'مسؤول العمليات والإنتاج';
      permissions = ['PROJECT', 'MATERIAL_ISSUE', 'INVENTORY'];
    } else if (newUserRole === 'SALES') {
      roleArabic = 'مسؤول المبيعات والعملاء';
      roleBadge = 'Sales Specialist';
      defaultTitle = 'مسؤول المبيعات وعروض الأسعار';
      permissions = ['QUOTATION', 'CUSTOMERS', 'CONTRACT'];
    }

    const newUserObj: SystemUser = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      password: cleanPassword,
      fullName: cleanName,
      title: newUserTitle.trim() || defaultTitle,
      role: newUserRole,
      roleArabic,
      roleBadge,
      divisionId: newUserDivision,
      permissions,
      isActive: true,
      initials,
      avatarColor,
      phone: newUserPhone.trim() || undefined,
      email: newUserEmail.trim() || `${cleanUsername}@noak.iq`,
    };

    const updated = [...systemUsers, newUserObj];
    saveSystemUsers(updated);
    setIsAddUserModalOpen(false);
    setUserMgmtFeedback(`تمت إضافة المستخدم (${cleanName}) بنجاح! يمكنه الآن تسجيل الدخول.`);
  };

  const handleOpenChangePasswordModal = (user: SystemUser) => {
    if (!isSystemProgrammer) {
      alert('عذراً، صلاحية تغيير كلمات المرور مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }
    setTargetUserForPassword(user);
    setNewPasswordValue('');
    setConfirmPasswordValue('');
    setShowNewPassword(false);
    setPasswordModalError(null);
    setIsChangePasswordModalOpen(true);
  };

  const handleChangePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasswordModalError(null);

    if (!isSystemProgrammer) {
      setPasswordModalError('عذراً، هذه العملية مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }

    if (!targetUserForPassword) return;

    const cleanPass = newPasswordValue.trim();
    const cleanConfirm = confirmPasswordValue.trim();

    if (!cleanPass || cleanPass.length < 4) {
      setPasswordModalError('كلمة المرور الجديدة يجب أن تكون 4 خانات على الأقل.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setPasswordModalError('كلمتا المرور غير متطابقتين، يرجى التأكد من تطابق الحقلين.');
      return;
    }

    const updated = systemUsers.map((u) => {
      if (u.id === targetUserForPassword.id || u.username === targetUserForPassword.username) {
        return { ...u, password: cleanPass };
      }
      return u;
    });

    saveSystemUsers(updated);

    if (activeUser.id === targetUserForPassword.id || activeUser.username === targetUserForPassword.username) {
      const updatedActive = { ...activeUser, password: cleanPass };
      setActiveUser(updatedActive);
      try {
        localStorage.setItem('noak_auth_session', JSON.stringify(updatedActive));
      } catch (err) {
        console.error('Failed to update session password', err);
      }
    }

    setIsChangePasswordModalOpen(false);
    setUserMgmtFeedback(`تم تغيير كلمة المرور للمستخدم (${targetUserForPassword.fullName}) بنجاح!`);
  };

  const handleToggleUserStatus = (user: SystemUser) => {
    if (!isSystemProgrammer) {
      alert('عذراً، صلاحية تعديل حالة المستخدمين مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }
    if (user.username === 'abbas') {
      alert('لا يمكن تعطيل حساب المدير العام الرئيسي (عباس علي سلمان).');
      return;
    }
    const updated = systemUsers.map((u) => {
      if (u.id === user.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    saveSystemUsers(updated);
    setUserMgmtFeedback(`تم ${user.isActive ? 'تعطيل' : 'تفعيل'} حساب المستخدم (${user.fullName}) بنجاح.`);
  };

  const handleDeleteUser = (user: SystemUser) => {
    if (!isSystemProgrammer) {
      alert('عذراً، صلاحية حذف المستخدمين مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم).');
      return;
    }
    if (user.username === 'abbas') {
      alert('لا يمكن حذف حساب المدير العام الرئيسي (عباس علي سلمان).');
      return;
    }
    if (user.id === activeUser.id || user.username === activeUser.username) {
      alert('لا يمكنك حذف الحساب الذي قمت بتسجيل الدخول به حالياً.');
      return;
    }
    if (confirm(`هل أنت متأكد من رغبتك في حذف المستخدم (${user.fullName}) نهائياً من النظام؟`)) {
      const updated = systemUsers.filter((u) => u.id !== user.id);
      saveSystemUsers(updated);
      setUserMgmtFeedback(`تم حذف المستخدم (${user.fullName}) من النظام بنجاح.`);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Business State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [batches, setBatches] = useState<InventoryBatch[]>(INITIAL_BATCHES);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [issues, setIssues] = useState<MaterialIssue[]>(INITIAL_MATERIAL_ISSUES);

  // Project Collapsible Drawer State & Payments Modal State
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const toggleExpandProject = (id: string) => {
    setExpandedProjectIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const [isProjectPaymentsModalOpen, setIsProjectPaymentsModalOpen] = useState(false);
  const [activeProjectForPayments, setActiveProjectForPayments] = useState<Project | null>(null);

  // Customers & Suppliers State
  const [contacts, setContacts] = useState<ContactRecord[]>(INITIAL_CONTACTS);
  const [contactTypeFilter, setContactTypeFilter] = useState<'ALL' | 'CUSTOMER' | 'SUPPLIER' | 'OUTSTANDING'>('ALL');
  const [contactDivisionFilter, setContactDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM' | 'SHARED'>('ALL');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'CHEQUE'>('CASH');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);

  // Collapsible Payment History & Receipt Voucher States
  const [expandedContactIds, setExpandedContactIds] = useState<string[]>([]);
  const [isReceiptVoucherModalOpen, setIsReceiptVoucherModalOpen] = useState(false);
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<CustomerPayment | null>(null);
  const [activeReceiptContact, setActiveReceiptContact] = useState<ContactRecord | null>(null);

  const toggleExpandContact = (id: string) => {
    setExpandedContactIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenReceiptVoucher = (contact: ContactRecord, payment: CustomerPayment) => {
    setActiveReceiptContact(contact);
    setActiveReceiptPayment(payment);
    setIsReceiptVoucherModalOpen(true);
  };

  // New Contact Form State
  const [newContactType, setNewContactType] = useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER');
  const [newContactName, setNewContactName] = useState('');
  const [newContactCode, setNewContactCode] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactAddress, setNewContactAddress] = useState('');
  const [newContactDivision, setNewContactDivision] = useState<DivisionId | 'SHARED'>('SHARED');
  const [newContactTotal, setNewContactTotal] = useState('');
  const [newContactPaid, setNewContactPaid] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactNotes, setNewContactNotes] = useState('');

  // Dedicated Projects State & Filters
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectDivisionFilter, setProjectDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState<string | null>(null);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCustomerMode, setNewProjectCustomerMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [newProjectCustomerId, setNewProjectCustomerId] = useState('');
  const [newProjectCustomerName, setNewProjectCustomerName] = useState('');
  const [newProjectCustomerPhone, setNewProjectCustomerPhone] = useState('');
  const [newProjectDivision, setNewProjectDivision] = useState<DivisionId>('WOOD');
  const [newProjectManager, setNewProjectManager] = useState('م. أحمد الخشاب');
  const [newProjectContractAmount, setNewProjectContractAmount] = useState('');
  const [newProjectCollectedAmount, setNewProjectCollectedAmount] = useState('0');
  const [newProjectCurrentStage, setNewProjectCurrentStage] = useState('تصنيع في الورشة');
  const [newProjectStatus, setNewProjectStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'>('IN_PROGRESS');
  const [newProjectStartDate, setNewProjectStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProjectExpectedEndDate, setNewProjectExpectedEndDate] = useState('');
  const [newProjectNotes, setNewProjectNotes] = useState('');
  const [newProjectError, setNewProjectError] = useState<string | null>(null);

  // Dialog States
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueDestinationType, setIssueDestinationType] = useState<'PROJECT' | 'SHOWROOM'>('PROJECT');
  const [issueProjectId, setIssueProjectId] = useState('proj-1');
  const [issueBatchId, setIssueBatchId] = useState('batch-w1');
  const [issueQty, setIssueQty] = useState('2');
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);

  // Showroom issue dedicated fields (مستودع المعرض للمواد الجاهزة)
  const [issueShowroomMode, setIssueShowroomMode] = useState<'NEW' | 'EXISTING'>('NEW');
  const [issueSelectedShowroomItemId, setIssueSelectedShowroomItemId] = useState<string>('');
  const [issueShowroomPieceName, setIssueShowroomPieceName] = useState('');
  const [issueShowroomCategory, setIssueShowroomCategory] = useState('أبواب ونماذج ديكورية');
  const [issueShowroomDimensions, setIssueShowroomDimensions] = useState('');
  const [issueShowroomProposedPrice, setIssueShowroomProposedPrice] = useState('');
  const [issueShowroomLocation, setIssueShowroomLocation] = useState('صالة العرض الرئيسية');

  // Labor Allocation Dialog State
  const [sharedLaborAmount, setSharedLaborAmount] = useState('3000000');
  const [woodLaborPct, setWoodLaborPct] = useState('50');
  const [alumLaborPct, setAlumLaborPct] = useState('50');

  // Profit Distribution Dialog State
  const [distDivision, setDistDivision] = useState<DivisionId>('WOOD');
  const [distNetProfit, setDistNetProfit] = useState('10000000');
  const [distReservePct, setDistReservePct] = useState('10');
  const [distResult, setDistResult] = useState<any>(null);

  // Print Quotation State
  const [printItemized, setPrintItemized] = useState(true);

  // Quotations & Contracts State
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [quotationSearchQuery, setQuotationSearchQuery] = useState('');
  const [quotationDivisionFilter, setQuotationDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [quotationStatusFilter, setQuotationStatusFilter] = useState<'ALL' | 'DRAFT' | 'APPROVED' | 'ACCEPTED' | 'CONVERTED_TO_CONTRACT'>('ALL');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(INITIAL_QUOTATIONS[0] || null);
  const [activeQuotationTab, setActiveQuotationTab] = useState<'ARCHIVE' | 'PREVIEW'>('ARCHIVE');
  const [quotationFeedback, setQuotationFeedback] = useState<string | null>(null);

  // Collapsible Quotation Drawer State
  const [expandedQuotationIds, setExpandedQuotationIds] = useState<string[]>(['quo-1']);
  const toggleExpandQuotation = (id: string) => {
    setExpandedQuotationIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Multi-page Quotation Print View Selector: 'ALL_PAGES' | 'PAGE_1' | 'PAGE_2'
  const [activePrintPage, setActivePrintPage] = useState<'ALL_PAGES' | 'PAGE_1' | 'PAGE_2'>('ALL_PAGES');

  // Quotation Editor State (Create / Edit)
  const [isQuotationEditorOpen, setIsQuotationEditorOpen] = useState(false);
  const [editingQuoId, setEditingQuoId] = useState<string | null>(null);
  const [editQuoNumber, setEditQuoNumber] = useState('');
  const [editQuoSubject, setEditQuoSubject] = useState('');
  const [editQuoCustomerMode, setEditQuoCustomerMode] = useState<'EXISTING' | 'CUSTOM'>('EXISTING');
  const [editQuoCustomerId, setEditQuoCustomerId] = useState('');
  const [editQuoCustomerName, setEditQuoCustomerName] = useState('');
  const [editQuoCustomerPhone, setEditQuoCustomerPhone] = useState('');
  const [editQuoCustomerAddress, setEditQuoCustomerAddress] = useState('');
  const [editQuoDivision, setEditQuoDivision] = useState<DivisionId>('WOOD');
  const [editQuoDate, setEditQuoDate] = useState(new Date().toISOString().split('T')[0]);
  const [editQuoValidDays, setEditQuoValidDays] = useState('15');
  const [editQuoStatus, setEditQuoStatus] = useState<DocumentStatus | 'ACCEPTED' | 'CONVERTED_TO_CONTRACT'>('APPROVED');
  const [editQuoLines, setEditQuoLines] = useState<QuotationLine[]>([]);
  const [editQuoImages, setEditQuoImages] = useState<QuotationImage[]>([]);
  const [editQuoDiscount, setEditQuoDiscount] = useState('0');
  const [editQuoPaymentTerms, setEditQuoPaymentTerms] = useState('50% دفعة مقدمة عند توقيع العقد، 40% عند اكتمال التصنيع بالورشة، 10% بعد التسليم النهائي والتركيب.');
  const [editQuoNotes, setEditQuoNotes] = useState('الأسعار شاملة التوصيل والتركيب الداخلي مع ضمان صيانة لمدة 12 شهراً ضد عيوب التصنيع.');
  const [editQuoShowItemized, setEditQuoShowItemized] = useState(true);
  const [editQuoError, setEditQuoError] = useState<string | null>(null);

  // Contract Modal State (Convert Accepted Quotation to Contract)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [activeContract, setActiveContract] = useState<Contract | null>(null);

  // Dedicated Inventory & Purchasing State
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryDivisionFilter, setInventoryDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [activeInventoryTab, setActiveInventoryTab] = useState<'BATCHES' | 'INVOICES'>('BATCHES');
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(INITIAL_PURCHASE_INVOICES);
  const [inventoryMaterials, setInventoryMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [inventoryFeedback, setInventoryFeedback] = useState<string | null>(null);

  // Dynamic Calculation of Notifications based on Live Application State
  // (الدفعات المتأخرة، مراحل تقدم المشاريع، مخزون المواد والحد الأدنى، وعروض الأسعار المعلقة)
  const systemNotifications = React.useMemo(() => {
    const list: Array<{
      id: string;
      category: 'PAYMENT' | 'PROJECT' | 'INVENTORY' | 'QUOTATION';
      title: string;
      description: string;
      detailBadge: string;
      priority: 'CRITICAL' | 'WARNING' | 'INFO';
      targetTab: 'customers' | 'projects' | 'inventory' | 'quotations';
      createdAtText: string;
    }> = [];

    // 1. الدفعات المتأخرة والذمم المستحقة للعملاء (Overdue & Pending Customer Payments)
    contacts.forEach(contact => {
      if (contact.type === 'CUSTOMER' && Number(contact.remainingAmount || 0) > 0) {
        const rem = Number(contact.remainingAmount);
        list.push({
          id: `notif-payment-${contact.id}`,
          category: 'PAYMENT',
          title: `دفعة مستحقة بذمة: ${contact.name}`,
          description: `متبقي بذمة العميل مبلغ ${rem.toLocaleString('en-US')} د.ع بحاجة إلى متابعة التحصيل وتسجيل سند قبض.`,
          detailBadge: `${rem.toLocaleString('en-US')} د.ع متبقي`,
          priority: rem >= 5000000 ? 'CRITICAL' : 'WARNING',
          targetTab: 'customers',
          createdAtText: 'ذمة مالية معلقة',
        });
      }
    });

    // 2. مراحل تقدم المشاريع ومواعيد التسليم (Project Progress & Milestones)
    projects.forEach(project => {
      if (project.status === 'IN_PROGRESS' || project.status === 'OPEN') {
        const isPastDue = project.expectedEndDate && new Date(project.expectedEndDate) < new Date();
        const collected = Number(project.collectedAmount || 0);
        const contract = Number(project.contractAmount || 0);
        const collectionPercent = contract > 0 ? Math.round((collected / contract) * 100) : 100;

        if (isPastDue) {
          list.push({
            id: `notif-project-due-${project.id}`,
            category: 'PROJECT',
            title: `تجاوز موعد التسليم: ${project.name}`,
            description: `المشروع في مرحلة (${project.currentStage}) وتجاوز تاريخ الإنجاز المقرر في ${project.expectedEndDate}.`,
            detailBadge: `المرحلة: ${project.currentStage}`,
            priority: 'CRITICAL',
            targetTab: 'projects',
            createdAtText: 'تأخر بالتسليم',
          });
        } else if (collectionPercent < 50) {
          list.push({
            id: `notif-project-progress-${project.id}`,
            category: 'PROJECT',
            title: `متابعة مرحلة ودفعات: ${project.name}`,
            description: `المشروع في مرحلة (${project.currentStage}) ونسبة التحصيل (${collectionPercent}%) فقط من قيمة العقد.`,
            detailBadge: `${collectionPercent}% تحصيل`,
            priority: 'WARNING',
            targetTab: 'projects',
            createdAtText: 'متابعة العمليات',
          });
        }
      }
    });

    // 3. مخزون المواد والحد الأدنى للطلب (Material Inventory Stock Alerts)
    inventoryMaterials.forEach(material => {
      const stock = Number(material.currentStock || 0);
      const minAlert = material.minStockAlert || 10;

      if (stock === 0) {
        list.push({
          id: `notif-stock-zero-${material.id}`,
          category: 'INVENTORY',
          title: `نفاد مخزون مادة: ${material.nameAr}`,
          description: `الرصيد المتبقي (0 ${material.unit}). يرجى إصدار فاتورة شراء لتفادي توقف العمل بالورشة.`,
          detailBadge: 'نفاد تام (0)',
          priority: 'CRITICAL',
          targetTab: 'inventory',
          createdAtText: 'مخزون حرج',
        });
      } else if (stock <= minAlert) {
        list.push({
          id: `notif-stock-low-${material.id}`,
          category: 'INVENTORY',
          title: `انخفاض مخزون: ${material.nameAr}`,
          description: `الرصيد الحالي (${stock} ${material.unit}) قارب أو عادل حد الأمان الأدنى (${minAlert} ${material.unit}).`,
          detailBadge: `المتبقي: ${stock} ${material.unit}`,
          priority: 'WARNING',
          targetTab: 'inventory',
          createdAtText: 'حد الطلب الأدنى',
        });
      }
    });

    // 4. عروض الأسعار بانتظار الاعتماد (Pending Quotations)
    quotations.forEach(quote => {
      if (quote.status === 'SUBMITTED' || quote.status === 'DRAFT') {
        list.push({
          id: `notif-quote-${quote.id}`,
          category: 'QUOTATION',
          title: `عرض سعر معلق: ${quote.quotationNumber}`,
          description: `عرض السعر المقدم إلى (${quote.customerName || 'العميل'}) بقيمة ${Number(quote.grandTotal).toLocaleString('en-US')} د.ع بانتظار الاعتماد.`,
          detailBadge: `${Number(quote.grandTotal).toLocaleString('en-US')} د.ع`,
          priority: 'INFO',
          targetTab: 'quotations',
          createdAtText: 'بانتظار التعميد',
        });
      }
    });

    return list;
  }, [contacts, projects, inventoryMaterials, quotations]);

  // Active notifications excluding session-dismissed items
  const activeNotifications = systemNotifications.filter(
    item => !dismissedNotificationIds.includes(item.id)
  );

  const handleDismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedNotificationIds(prev => [...prev, id]);
  };

  const handleDismissAllForSession = () => {
    setDismissedNotificationIds(systemNotifications.map(n => n.id));
  };

  const handleRestoreDismissed = () => {
    setDismissedNotificationIds([]);
  };

  const handleNotificationAction = (targetTab: 'customers' | 'projects' | 'inventory' | 'quotations') => {
    setActiveTab(targetTab);
    setNotificationOpen(false);
  };

  // New Purchase Invoice Modal State
  const [isPurchaseInvoiceModalOpen, setIsPurchaseInvoiceModalOpen] = useState(false);
  const [purchaseDivision, setPurchaseDivision] = useState<DivisionId>('WOOD');
  const [purchaseInvoiceNumber, setPurchaseInvoiceNumber] = useState('');
  const [purchaseSupplierInvoiceNo, setPurchaseSupplierInvoiceNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseSupplierMode, setPurchaseSupplierMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('');
  const [purchaseNewSupplierName, setPurchaseNewSupplierName] = useState('');
  const [purchaseNewSupplierPhone, setPurchaseNewSupplierPhone] = useState('');
  const [purchaseWarehouseId, setPurchaseWarehouseId] = useState('wh-wood-1');
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState<'CASH' | 'BANK' | 'CHEQUE' | 'CREDIT'>('CASH');
  const [purchasePaidAmount, setPurchasePaidAmount] = useState('');
  const [purchaseDiscount, setPurchaseDiscount] = useState('0');
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [purchaseLines, setPurchaseLines] = useState<PurchaseInvoiceLine[]>([
    {
      materialCode: 'MAT-W01',
      materialNameAr: 'لوح خشب MDF سماكة 18 ملم أسباني',
      unit: 'لوح',
      quantity: '20',
      unitCost: '35000',
      lineTotal: '700000',
      notes: '',
    },
  ]);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Invoice Inspection / Printable Voucher Modal
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState<PurchaseInvoice | null>(null);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);

  // Dedicated General Expenses State & Date Range Filters
  const [expenses, setExpenses] = useState<GeneralExpense[]>(INITIAL_EXPENSES);
  const [expenseDivisionFilter, setExpenseDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<'ALL' | ExpenseCategory>('ALL');
  const [expenseFromDate, setExpenseFromDate] = useState<string>('');
  const [expenseToDate, setExpenseToDate] = useState<string>('');
  const [expenseSearchQuery, setExpenseSearchQuery] = useState<string>('');
  const [expenseFeedback, setExpenseFeedback] = useState<string | null>(null);

  // New Expense Modal State
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [newExpenseVoucherNo, setNewExpenseVoucherNo] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>('ELECTRICITY');
  const [newExpenseDivision, setNewExpenseDivision] = useState<DivisionId | 'SHARED'>('WOOD');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePaymentMethod, setNewExpensePaymentMethod] = useState<'CASH' | 'BANK' | 'CHEQUE'>('CASH');
  const [newExpenseBeneficiary, setNewExpenseBeneficiary] = useState('');
  const [newExpenseRefInvoiceNo, setNewExpenseRefInvoiceNo] = useState('');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');
  const [newExpenseError, setNewExpenseError] = useState<string | null>(null);

  // Printable Expense Voucher State
  const [selectedExpenseForPrint, setSelectedExpenseForPrint] = useState<GeneralExpense | null>(null);
  const [isPrintExpenseModalOpen, setIsPrintExpenseModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Partners & Profit Settlement State (الشركاء وتوزيع الأرباح وسلف الشركاء)
  // ---------------------------------------------------------------------------
  const [partnerAdvances, setPartnerAdvances] = useState<PartnerAdvance[]>(INITIAL_PARTNER_ADVANCES);
  const [settlementCycles, setSettlementCycles] = useState<PartnerSettlementCycle[]>(INITIAL_SETTLEMENT_CYCLES);

  // Settlement Period Filters (مدة تحدد بين تاريخين)
  const [partnerDateFrom, setPartnerDateFrom] = useState<string>('2026-01-01');
  const [partnerDateTo, setPartnerDateTo] = useState<string>('2026-12-31');
  const [partnerReservePct, setPartnerReservePct] = useState<string>('0');
  const [partnerActiveSubTab, setPartnerActiveSubTab] = useState<'ROWS' | 'ADVANCES' | 'DETAILS' | 'ARCHIVE'>('ROWS');
  const [partnerFeedback, setPartnerFeedback] = useState<string | null>(null);

  // Partner Advance Modal State
  const [isPartnerAdvanceModalOpen, setIsPartnerAdvanceModalOpen] = useState(false);
  const [selectedPartnerForAdvance, setSelectedPartnerForAdvance] = useState<string>('part-w1');
  const [padvVoucherNo, setPadvVoucherNo] = useState(`Noak - 2026 - 0003`);
  const [padvDate, setPadvDate] = useState(new Date().toISOString().split('T')[0]);
  const [padvAmount, setPadvAmount] = useState('');
  const [padvPaymentMethod, setPadvPaymentMethod] = useState<'CASH' | 'BANK'>('CASH');
  const [padvReason, setPadvReason] = useState('');
  const [padvError, setPadvError] = useState<string | null>(null);

  // Printable Partner Settlement Sheet Modal State
  const [isSettlementPrintModalOpen, setIsSettlementPrintModalOpen] = useState(false);
  const [selectedSettlementForPrint, setSelectedSettlementForPrint] = useState<{
    divisionId: DivisionId;
    periodName: string;
    summary: any;
  } | null>(null);

  // Printable Partner Advance Voucher Modal State
  const [selectedPadvForPrint, setSelectedPadvForPrint] = useState<PartnerAdvance | null>(null);
  const [isPadvPrintModalOpen, setIsPadvPrintModalOpen] = useState(false);

  // Confirm Settlement & Archive Modal State
  const [isConfirmSettlementModalOpen, setIsConfirmSettlementModalOpen] = useState(false);
  const [targetDivisionForSettlement, setTargetDivisionForSettlement] = useState<DivisionId>('WOOD');
  const [settlementPeriodTitle, setSettlementPeriodTitle] = useState('تصفية دورة الربع الرابع 2026');

  // ---------------------------------------------------------------------------
  // Assets & Showroom State (الأصول الثابتة ومعروضات المعرض ونماذج الديكور)
  // ---------------------------------------------------------------------------
  const [divisionLumpSums, setDivisionLumpSums] = useState<Record<DivisionId | 'SHARED', DivisionAssetLumpSum>>(INITIAL_DIVISION_LUMP_SUMS);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(INITIAL_FIXED_ASSETS);
  const [showroomItems, setShowroomItems] = useState<ShowroomItem[]>(INITIAL_SHOWROOM_ITEMS);

  // Asset Filters & View State
  const [assetDivisionFilter, setAssetDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [assetShowroomStatusFilter, setAssetShowroomStatusFilter] = useState<'ALL' | 'IN_SHOWROOM' | 'SOLD'>('ALL');
  const [assetSearchQuery, setAssetSearchQuery] = useState<string>('');
  const [assetActiveSubTab, setAssetActiveSubTab] = useState<'SHOWROOM' | 'LUMP_SUMS' | 'FIXED_ASSETS'>('SHOWROOM');
  const [assetFeedback, setAssetFeedback] = useState<string | null>(null);

  // Modal 1: Quick Edit Lump-Sum Fixed Amounts per Division
  const [isEditLumpSumsModalOpen, setIsEditLumpSumsModalOpen] = useState(false);
  const [editWoodLumpSum, setEditWoodLumpSum] = useState('45000000');
  const [editAlumLumpSum, setEditAlumLumpSum] = useState('52000000');
  const [editSharedLumpSum, setEditSharedLumpSum] = useState('25000000');

  // Modal 2: Sell Showroom Item Modal (بيع قطعة معروضة وتسجيل الإيراد والربح)
  const [isSellShowroomModalOpen, setIsSellShowroomModalOpen] = useState(false);
  const [selectedShowroomItemForSale, setSelectedShowroomItemForSale] = useState<ShowroomItem | null>(null);
  const [salePrice, setSalePrice] = useState('');
  const [saleBuyerName, setSaleBuyerName] = useState('');
  const [saleBuyerPhone, setSaleBuyerPhone] = useState('');
  const [salePaymentMethod, setSalePaymentMethod] = useState<'CASH' | 'BANK'>('CASH');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleNotes, setSaleNotes] = useState('');
  const [saleError, setSaleError] = useState<string | null>(null);

  // Modal 3: Replenish / Add New Showroom Item Modal (تعويض / إضافة قطعة جديدة للمعرض)
  const [isReplenishModalOpen, setIsReplenishModalOpen] = useState(false);
  const [newShowroomItemName, setNewShowroomItemName] = useState('');
  const [newShowroomDivision, setNewShowroomDivision] = useState<DivisionId>('WOOD');
  const [newShowroomCategory, setNewShowroomCategory] = useState('أبواب ديكورية فاخرة');
  const [newShowroomCost, setNewShowroomCost] = useState('');
  const [newShowroomProposedPrice, setNewShowroomProposedPrice] = useState('');
  const [newShowroomDimensions, setNewShowroomDimensions] = useState('');
  const [newShowroomNotes, setNewShowroomNotes] = useState('');
  const [newShowroomError, setNewShowroomError] = useState<string | null>(null);

  // Modal 4: Add Detailed Fixed Asset Modal (إضافة أصل وماكينة تفصيلية)
  const [isAddFixedAssetModalOpen, setIsAddFixedAssetModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDivision, setNewAssetDivision] = useState<DivisionId | 'SHARED'>('WOOD');
  const [newAssetCategory, setNewAssetCategory] = useState<FixedAssetCategory>('MACHINERY');
  const [newAssetCost, setNewAssetCost] = useState('');
  const [newAssetLocation, setNewAssetLocation] = useState('ورشة النجارة - قسم القص الآلي');
  const [newAssetPurchaseDate, setNewAssetPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAssetNotes, setNewAssetNotes] = useState('');
  const [newAssetError, setNewAssetError] = useState<string | null>(null);

  // Modal 5: Printable Asset & Showroom Inventory Sheet
  const [isPrintAssetsModalOpen, setIsPrintAssetsModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Human Resources & Attendance State (الموارد البشرية والدوام وسلف الرواتب)
  // ---------------------------------------------------------------------------
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendances, setAttendances] = useState<DailyAttendance[]>(INITIAL_ATTENDANCES);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(INITIAL_SALARY_ADVANCES);
  const [archivedPayrolls, setArchivedPayrolls] = useState<ArchivedPayrollCycle[]>(INITIAL_ARCHIVED_PAYROLLS);

  // HR Filters & View State
  const [hrDivisionFilter, setHrDivisionFilter] = useState<'ALL' | 'WOOD' | 'ALUMINUM'>('ALL');
  const [hrDateFrom, setHrDateFrom] = useState<string>('2026-10-01');
  const [hrDateTo, setHrDateTo] = useState<string>('2026-10-31');
  const [hrSearchQuery, setHrSearchQuery] = useState<string>('');
  const [hrActiveSubTab, setHrActiveSubTab] = useState<'EMPLOYEES' | 'ATTENDANCE' | 'ARCHIVE' | 'SHARED_ALLOCATION'>('EMPLOYEES');
  const [hrFeedback, setHrFeedback] = useState<string | null>(null);

  // Modal 1: New Employee Modal State
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpCode, setNewEmpCode] = useState('');
  const [newEmpDivision, setNewEmpDivision] = useState<DivisionId | 'SHARED'>('WOOD');
  const [newEmpJobTitle, setNewEmpJobTitle] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpMonthlySalary, setNewEmpMonthlySalary] = useState('');
  const [newEmpShiftStart, setNewEmpShiftStart] = useState('08:00');
  const [newEmpShiftEnd, setNewEmpShiftEnd] = useState('16:00');
  const [newEmpWorkingDays, setNewEmpWorkingDays] = useState('26');
  const [newEmpDailyHours, setNewEmpDailyHours] = useState('8');
  const [newEmpError, setNewEmpError] = useState<string | null>(null);

  // Modal 2: Daily Attendance Modal State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attEmployeeId, setAttEmployeeId] = useState('emp-1');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attClockIn, setAttClockIn] = useState('08:00');
  const [attClockOut, setAttClockOut] = useState('16:00');
  const [attNotes, setAttNotes] = useState('');
  const [attError, setAttError] = useState<string | null>(null);

  // Modal 3: Salary Advance Modal State
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [advanceEmpId, setAdvanceEmpId] = useState('emp-1');
  const [advVoucherNo, setAdvVoucherNo] = useState(`Noak-2026-0004`);
  const [advDate, setAdvDate] = useState(new Date().toISOString().split('T')[0]);
  const [advAmount, setAdvAmount] = useState('');
  const [advReason, setAdvReason] = useState('');
  const [advPaymentMethod, setAdvPaymentMethod] = useState<'CASH' | 'BANK'>('CASH');
  const [advError, setAdvError] = useState<string | null>(null);

  // Modal 4: Monthly Payroll Disbursement & Archive Modal State
  const [isClosePayrollModalOpen, setIsClosePayrollModalOpen] = useState(false);
  const [payrollMonthName, setPayrollMonthName] = useState('تشرين الأول (أكتوبر) 2026');

  // Modal 5: Printable Salary Slip Modal State
  const [selectedEmpForSlip, setSelectedEmpForSlip] = useState<Employee | null>(null);
  const [isSalarySlipModalOpen, setIsSalarySlipModalOpen] = useState(false);

  // Helper: Minute Rate for an employee based on working days and daily hours
  const calculateEmployeeMinuteRate = (emp: Employee): PreciseMoney => {
    const workingDays = emp.workingDaysPerMonth && emp.workingDaysPerMonth > 0 ? emp.workingDaysPerMonth : 26;
    const dailyHours = emp.dailyHours && emp.dailyHours > 0 ? emp.dailyHours : 8;
    const totalMinutes = workingDays * dailyHours * 60;
    if (totalMinutes === 0) return PreciseMoney.zero();
    return new PreciseMoney(emp.monthlySalary).div(new PreciseMoney(totalMinutes.toString()));
  };

  // Helper: Parse HH:MM to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
  };

  // Filtered Employees according to top division and search
  const filteredEmployees = employees.filter((emp) => {
    const matchesDiv =
      hrDivisionFilter === 'ALL' ||
      emp.divisionId === hrDivisionFilter;

    const term = hrSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      emp.fullName.toLowerCase().includes(term) ||
      emp.code.toLowerCase().includes(term) ||
      emp.jobTitle.toLowerCase().includes(term) ||
      (emp.phone && emp.phone.includes(term));

    return matchesDiv && matchesSearch;
  });

  // Filtered Attendances according to division, search, and date range
  const filteredAttendances = attendances.filter((att) => {
    const matchesDiv =
      hrDivisionFilter === 'ALL' ||
      att.divisionId === hrDivisionFilter;

    const matchesDate =
      (!hrDateFrom || att.date >= hrDateFrom) &&
      (!hrDateTo || att.date <= hrDateTo);

    const term = hrSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      att.employeeName.toLowerCase().includes(term) ||
      att.date.includes(term);

    return matchesDiv && matchesDate && matchesSearch;
  });

  // Per-employee Payroll & Attendance Breakdown for current period
  const getEmployeePayrollBreakdown = (emp: Employee) => {
    const empAttendances = attendances.filter(
      (a) =>
        a.employeeId === emp.id &&
        (!hrDateFrom || a.date >= hrDateFrom) &&
        (!hrDateTo || a.date <= hrDateTo)
    );

    const totalDaysAttended = empAttendances.length;
    const totalLateMinutes = empAttendances.reduce((acc, a) => acc + (a.lateMinutes || 0), 0);
    const totalOvertimeMinutes = empAttendances.reduce((acc, a) => acc + (a.overtimeMinutes || 0), 0);

    const totalLateDeductions = empAttendances.reduce(
      (acc, a) => acc.add(new PreciseMoney(a.lateDeduction || '0')),
      PreciseMoney.zero()
    );

    const totalOvertimeAdditions = empAttendances.reduce(
      (acc, a) => acc.add(new PreciseMoney(a.overtimeAddition || '0')),
      PreciseMoney.zero()
    );

    const empAdvances = salaryAdvances.filter(
      (adv) =>
        adv.employeeId === emp.id &&
        adv.status === 'ACTIVE' &&
        (!hrDateFrom || adv.date >= hrDateFrom) &&
        (!hrDateTo || adv.date <= hrDateTo)
    );

    const totalAdvances = empAdvances.reduce(
      (acc, adv) => acc.add(new PreciseMoney(adv.amount || '0')),
      PreciseMoney.zero()
    );

    const baseSalary = new PreciseMoney(emp.monthlySalary || '0');
    const netSalary = baseSalary
      .add(totalOvertimeAdditions)
      .sub(totalLateDeductions)
      .sub(totalAdvances);

    const minuteRate = calculateEmployeeMinuteRate(emp);

    return {
      baseSalary,
      totalDaysAttended,
      totalLateMinutes,
      totalOvertimeMinutes,
      totalLateDeductions,
      totalOvertimeAdditions,
      totalAdvances,
      netSalary,
      minuteRate,
      advancesList: empAdvances,
      attendancesList: empAttendances,
    };
  };

  // HR Top 6 KPIs (Computed over filteredEmployees)
  const hrKpis = filteredEmployees.reduce(
    (acc, emp) => {
      const breakdown = getEmployeePayrollBreakdown(emp);
      return {
        totalEmployees: acc.totalEmployees + 1,
        totalBaseSalaries: acc.totalBaseSalaries.add(breakdown.baseSalary),
        totalNetPayable: acc.totalNetPayable.add(breakdown.netSalary),
        totalDeductions: acc.totalDeductions.add(breakdown.totalLateDeductions),
        totalAdditions: acc.totalAdditions.add(breakdown.totalOvertimeAdditions),
        totalAdvances: acc.totalAdvances.add(breakdown.totalAdvances),
        totalLateMinutes: acc.totalLateMinutes + breakdown.totalLateMinutes,
        totalOvertimeMinutes: acc.totalOvertimeMinutes + breakdown.totalOvertimeMinutes,
      };
    },
    {
      totalEmployees: 0,
      totalBaseSalaries: PreciseMoney.zero(),
      totalNetPayable: PreciseMoney.zero(),
      totalDeductions: PreciseMoney.zero(),
      totalAdditions: PreciseMoney.zero(),
      totalAdvances: PreciseMoney.zero(),
      totalLateMinutes: 0,
      totalOvertimeMinutes: 0,
    }
  );

  // HR Handlers
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) {
      setNewEmpError('يرجى كتابة اسم الموظف كاملاً.');
      return;
    }
    const cleanSalary = newEmpMonthlySalary.replace(/,/g, '').trim();
    if (!cleanSalary || isNaN(Number(cleanSalary)) || Number(cleanSalary) <= 0) {
      setNewEmpError('يرجى تحديد راتب شهري نظامي أكبر من صفر.');
      return;
    }

    const nextId = `emp-${Date.now().toString().slice(-4)}`;
    const nextCode = newEmpCode.trim() || `EMP-${String(employees.length + 1).padStart(3, '0')}`;

    const newEmp: Employee = {
      id: nextId,
      code: nextCode,
      fullName: newEmpName.trim(),
      phone: newEmpPhone.trim() || '07700000000',
      divisionId: newEmpDivision === 'SHARED' ? null : newEmpDivision,
      jobTitle: newEmpJobTitle.trim() || 'فني صناعي',
      monthlySalary: new PreciseMoney(cleanSalary).toDbString(2),
      isShared: newEmpDivision === 'SHARED',
      shiftStartTime: newEmpShiftStart || '08:00',
      shiftEndTime: newEmpShiftEnd || '16:00',
      workingDaysPerMonth: Number(newEmpWorkingDays) || 26,
      dailyHours: Number(newEmpDailyHours) || 8,
      hireDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsNewEmployeeModalOpen(false);
    setNewEmpName('');
    setNewEmpCode('');
    setNewEmpJobTitle('');
    setNewEmpPhone('');
    setNewEmpMonthlySalary('');
    setNewEmpError(null);
    setHrFeedback(`تمت إضافة الموظف "${newEmp.fullName}" بكود [${newEmp.code}] بنجاح، وتثبيت مواعيد دوامه.`);
    setTimeout(() => setHrFeedback(null), 4000);
  };

  const handleRecordAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = employees.find((emp) => emp.id === attEmployeeId);
    if (!targetEmp) {
      setAttError('يرجى اختيار الموظف المراد تسجيل دوامه.');
      return;
    }
    if (!attClockIn || !attClockOut) {
      setAttError('يرجى تحديد وقت الدخول ووقت الخروج بدقة.');
      return;
    }

    const scheduledIn = targetEmp.shiftStartTime || '08:00';
    const scheduledOut = targetEmp.shiftEndTime || '16:00';

    const scheduledInMin = timeToMinutes(scheduledIn);
    const scheduledOutMin = timeToMinutes(scheduledOut);
    const clockInMin = timeToMinutes(attClockIn);
    const clockOutMin = timeToMinutes(attClockOut);

    const minuteRate = calculateEmployeeMinuteRate(targetEmp);

    // Calculate Late Minutes & Deduction
    const lateMin = Math.max(0, clockInMin - scheduledInMin);
    const lateDeductionAmount = minuteRate.mul(lateMin);

    // Calculate Overtime Minutes & Addition
    const otMin = Math.max(0, clockOutMin - scheduledOutMin);
    const otAdditionAmount = minuteRate.mul(otMin);

    let status: 'PRESENT' | 'LATE' | 'OVERTIME' | 'LATE_AND_OVERTIME' = 'PRESENT';
    if (lateMin > 0 && otMin > 0) status = 'LATE_AND_OVERTIME';
    else if (lateMin > 0) status = 'LATE';
    else if (otMin > 0) status = 'OVERTIME';

    const newAttendance: DailyAttendance = {
      id: `att-${Date.now()}`,
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      divisionId: (targetEmp.divisionId || 'SHARED') as DivisionId | 'SHARED',
      date: attDate,
      clockIn: attClockIn,
      clockOut: attClockOut,
      scheduledIn,
      scheduledOut,
      lateMinutes: lateMin,
      lateDeduction: lateDeductionAmount.toDbString(2),
      overtimeMinutes: otMin,
      overtimeAddition: otAdditionAmount.toDbString(2),
      status,
      notes: attNotes.trim() || undefined,
      recordedBy: 'مسؤول الحضور والورشة',
      createdAt: new Date().toISOString(),
    };

    setAttendances((prev) => [newAttendance, ...prev]);
    setIsAttendanceModalOpen(false);
    setAttNotes('');
    setAttError(null);
    setHrFeedback(
      `تم تسجيل دوام الموظف "${targetEmp.fullName}" لتاريخ ${attDate} بنجاح. (تأخير: ${lateMin} دقيقة - إضافي: ${otMin} دقيقة).`
    );
    setTimeout(() => setHrFeedback(null), 4000);
  };

  const handleDisburseAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = employees.find((emp) => emp.id === advanceEmpId);
    if (!targetEmp) {
      setAdvError('يرجى اختيار الموظف المستفيد من السلفة.');
      return;
    }
    const cleanAmount = advAmount.replace(/,/g, '').trim();
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      setAdvError('يرجى تحديد مبلغ سلفة صحيح أكبر من صفر.');
      return;
    }

    const newAdv: SalaryAdvance = {
      id: `adv-${Date.now()}`,
      voucherNumber: advVoucherNo.trim() || SequenceFormatter.formatNumber('SALARY_ADVANCE', new Date().getFullYear(), salaryAdvances.length + 1),
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      divisionId: (targetEmp.divisionId || 'SHARED') as DivisionId | 'SHARED',
      date: advDate,
      amount: new PreciseMoney(cleanAmount).toDbString(2),
      reason: advReason.trim() || 'سلفة على راتب الشهر الحالي',
      paymentMethod: advPaymentMethod,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    setSalaryAdvances((prev) => [newAdv, ...prev]);
    setIsAdvanceModalOpen(false);
    setAdvAmount('');
    setAdvReason('');
    setAdvError(null);
    setAdvVoucherNo(SequenceFormatter.formatNumber('SALARY_ADVANCE', new Date().getFullYear(), salaryAdvances.length + 2));
    setHrFeedback(
      `تم صرف سلفة بقيمة ${new PreciseMoney(newAdv.amount).formatIQD()} للموظف "${targetEmp.fullName}" بموجب السند ${newAdv.voucherNumber}.`
    );
    setTimeout(() => setHrFeedback(null), 4000);
  };

  const handleDisburseAndArchivePayroll = () => {
    if (employees.length === 0) return;

    // Snapshot of all employees and their calculations
    const records: ArchivedPayrollEmployeeRecord[] = employees.map((emp) => {
      const b = getEmployeePayrollBreakdown(emp);
      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        divisionId: (emp.divisionId || 'SHARED') as DivisionId | 'SHARED',
        baseSalary: b.baseSalary.toDbString(2),
        additions: b.totalOvertimeAdditions.toDbString(2),
        deductions: b.totalLateDeductions.toDbString(2),
        advances: b.totalAdvances.toDbString(2),
        netSalary: b.netSalary.toDbString(2),
        attendanceDaysCount: b.totalDaysAttended,
        totalLateMinutes: b.totalLateMinutes,
        totalOvertimeMinutes: b.totalOvertimeMinutes,
      };
    });

    const totalBase = records.reduce((acc, r) => acc.add(new PreciseMoney(r.baseSalary)), PreciseMoney.zero());
    const totalAdditions = records.reduce((acc, r) => acc.add(new PreciseMoney(r.additions)), PreciseMoney.zero());
    const totalDeductions = records.reduce((acc, r) => acc.add(new PreciseMoney(r.deductions)), PreciseMoney.zero());
    const totalAdvances = records.reduce((acc, r) => acc.add(new PreciseMoney(r.advances)), PreciseMoney.zero());
    const totalNet = records.reduce((acc, r) => acc.add(new PreciseMoney(r.netSalary)), PreciseMoney.zero());

    const newCycle: ArchivedPayrollCycle = {
      id: `cycle-${Date.now()}`,
      cycleNumber: `PR-CYCLE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      monthNameAr: payrollMonthName,
      closedDate: new Date().toISOString(),
      totalBaseSalaries: totalBase.toDbString(2),
      totalAdditions: totalAdditions.toDbString(2),
      totalDeductions: totalDeductions.toDbString(2),
      totalAdvances: totalAdvances.toDbString(2),
      totalNetPaid: totalNet.toDbString(2),
      employeeCount: records.length,
      records,
    };

    // 1. Add cycle to archive
    setArchivedPayrolls((prev) => [newCycle, ...prev]);

    // 2. Mark active advances as ARCHIVED
    setSalaryAdvances((prev) =>
      prev.map((adv) => (adv.status === 'ACTIVE' ? { ...adv, status: 'ARCHIVED' as const } : adv))
    );

    // 3. Clear active attendances for the current cycle so the new month starts fresh
    setAttendances([]);

    // 4. Also record as general expense entry for traceability
    const payrollExpense: GeneralExpense = {
      id: `exp-pay-${Date.now()}`,
      voucherNumber: SequenceFormatter.formatNumber('EXPENSE', new Date().getFullYear(), expenses.length + 1),
      date: new Date().toISOString().split('T')[0],
      category: 'SALARIES',
      categoryLabelAr: 'رواتب وأجور الكوادر والموظفين',
      divisionId: 'SHARED',
      amount: totalNet.toDbString(2),
      paymentMethod: 'BANK',
      beneficiary: `رواتب موظفي المعمل - دورة ${payrollMonthName}`,
      referenceInvoiceNo: newCycle.cycleNumber,
      notes: `إغلاق دورة رواتب ${payrollMonthName}، تصفير سجل الدوام، وحسم السلف المصروفة بالكامل.`,
      approvedBy: 'المدير العام',
      paidBy: 'أمين الصندوق والمصرف',
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [payrollExpense, ...prev]);

    setIsClosePayrollModalOpen(false);
    setHrFeedback(
      `تم بنجاح صرف رواتب دورة "${payrollMonthName}" بقيمة صافية ${totalNet.formatIQD()}، وأرشفة سجلات الدوام وتصفيرها للبدء بشهر جديد!`
    );
    setTimeout(() => setHrFeedback(null), 5000);
  };

  // Filtered Quotations
  const filteredQuotations = quotations.filter((q) => {
    const matchesDiv = quotationDivisionFilter === 'ALL' || q.divisionId === quotationDivisionFilter;
    const matchesStatus = quotationStatusFilter === 'ALL' || q.status === quotationStatusFilter;
    const term = quotationSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      q.quotationNumber.toLowerCase().includes(term) ||
      (q.customerName && q.customerName.toLowerCase().includes(term)) ||
      (q.subject && q.subject.toLowerCase().includes(term)) ||
      (q.customerPhone && q.customerPhone.includes(term));

    return matchesDiv && matchesStatus && matchesSearch;
  });

  // Filtered Projects (Supports dedicated project division filter, top-bar division, and live search)
  const filteredProjects = projects.filter((p) => {
    const effectiveDiv = projectDivisionFilter !== 'ALL' ? projectDivisionFilter : activeDivision;
    const matchesDiv = effectiveDiv === 'ALL' || p.divisionId === effectiveDiv;

    const term = (projectSearchQuery || searchQuery).trim().toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.projectNumber.toLowerCase().includes(term) ||
      (p.customerName && p.customerName.toLowerCase().includes(term));

    return matchesDiv && matchesSearch;
  });

  // Calculate Divisional Metrics (Strict Isolation)
  const woodProjects = projects.filter((p) => p.divisionId === 'WOOD');
  const alumProjects = projects.filter((p) => p.divisionId === 'ALUMINUM');

  const woodRevenue = woodProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.invoicedAmount)), PreciseMoney.zero());
  const woodMaterialCost = woodProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.actualMaterialCost)), PreciseMoney.zero());
  const woodGrossProfit = woodRevenue.sub(woodMaterialCost);

  const alumRevenue = alumProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.invoicedAmount)), PreciseMoney.zero());
  const alumMaterialCost = alumProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.actualMaterialCost)), PreciseMoney.zero());
  const alumGrossProfit = alumRevenue.sub(alumMaterialCost);

  // Project KPI Card Metrics with strict division separation
  const woodCompletedCount = woodProjects.filter((p) => p.status === 'COMPLETED' || p.currentStage.includes('تسليم')).length;
  const woodInProgressCount = woodProjects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'OPEN').length;

  const alumCompletedCount = alumProjects.filter((p) => p.status === 'COMPLETED' || p.currentStage.includes('تسليم')).length;
  const alumInProgressCount = alumProjects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'OPEN').length;

  const activeCardProjects = projects.filter((p) => {
    if (projectDivisionFilter === 'ALL') return true;
    return p.divisionId === projectDivisionFilter;
  });

  const cardTotalCount = activeCardProjects.length;
  const cardInProgressCount = activeCardProjects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'OPEN').length;
  const cardCompletedCount = activeCardProjects.filter((p) => p.status === 'COMPLETED' || p.currentStage.includes('تسليم')).length;
  const cardTotalContractValue = activeCardProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.contractAmount)), PreciseMoney.zero());
  const cardTotalMaterialCost = activeCardProjects.reduce((acc, p) => acc.add(new PreciseMoney(p.actualMaterialCost)), PreciseMoney.zero());

  // Material Issue Handler
  const handleIssueMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueError(null);
    setIssueSuccess(null);

    const selectedBatch = batches.find((b) => b.id === issueBatchId);
    if (!selectedBatch) {
      setIssueError('يرجى تحديد الدفعة المخزنية المطلوب الصرف منها.');
      return;
    }

    // Branch 1: Showroom Finished Goods Warehouse (مستودع المعرض للمواد الجاهزة - حركة مخزنية بحتة)
    if (issueDestinationType === 'SHOWROOM') {
      // Branch 1.A: Add Materials to an Existing Showroom Piece (تجميع تكلفة مواد على قطعة قائمة قيد التصنيع)
      if (issueShowroomMode === 'EXISTING') {
        if (!issueSelectedShowroomItemId) {
          setIssueError('يرجى تحديد القطعة الجاهزة في مستودع المعرض المطلوب إضافة المواد إليها.');
          return;
        }
        const existingItem = showroomItems.find(
          (s) => s.id === issueSelectedShowroomItemId && s.status === 'IN_SHOWROOM'
        );
        if (!existingItem) {
          setIssueError('القطعة المحددة غير موجودة أو تم بيعها مسبقاً.');
          return;
        }

        try {
          // Validate stock and issue using batch's division
          const result = InventoryBatchEngine.validateAndIssueStock(
            selectedBatch,
            issueQty,
            selectedBatch.divisionId
          );

          // 1. Update Batch Remaining Qty
          const updatedBatches = batches.map((b) =>
            b.id === selectedBatch.id ? { ...b, remainingQuantity: result.remainingQuantity } : b
          );
          setBatches(updatedBatches);

          // 2. Add Material Issue Record (Internal Warehouse Transfer to Showroom Finished Goods)
          const newIssue: MaterialIssue = {
            id: crypto.randomUUID(),
            issueNumber: SequenceFormatter.formatNumber('MATERIAL_ISSUE', 2026, issues.length + 1),
            projectId: 'SHOWROOM',
            projectName: `مستودع المعرض: ${existingItem.nameAr}`,
            divisionId: selectedBatch.divisionId,
            batchId: selectedBatch.id,
            materialId: selectedBatch.materialId,
            materialNameAr: selectedBatch.materialNameAr,
            quantity: issueQty,
            unitCost: result.unitCost,
            totalCost: result.totalCost,
            date: new Date().toISOString().split('T')[0],
            status: 'POSTED',
            issuedBy: 'أمين المستودع (Warehouse Keeper)',
            createdAt: new Date().toISOString(),
            notes: `تحويل مخزني داخلي: صرف مواد لتصنيع القطعة [${existingItem.itemCode}] بمستودع المعرض — حركة مخزنية بحتة دون تأثير على الصندوق`,
          };
          const updatedIssues = [newIssue, ...issues];
          setIssues(updatedIssues);

          // 3. Accumulate material cost onto the existing Showroom Finished Goods item
          const updatedCostPM = new PreciseMoney(existingItem.productionCost).add(
            new PreciseMoney(result.totalCost)
          );
          setShowroomItems((prev) =>
            prev.map((item) =>
              item.id === existingItem.id
                ? {
                    ...item,
                    productionCost: updatedCostPM.toDbString(2),
                    notes: item.notes
                      ? `${item.notes} | مادة مضافة: ${selectedBatch.materialNameAr} (${new PreciseMoney(result.totalCost).formatIQD()})`
                      : `مادة مضافة: ${selectedBatch.materialNameAr} (${new PreciseMoney(result.totalCost).formatIQD()})`,
                  }
                : item
            )
          );

          setIsIssueModalOpen(false);
          const successMsg = `تم بنجاح صرف المواد بقيمة [${new PreciseMoney(result.totalCost).formatIQD()}] وإضافتها لتكلفة القطعة [${existingItem.nameAr}] في مستودع المواد الجاهزة بالمعرض — حركة مخزنية بحتة بدون تأثير على الصندوق.`;
          setIssueSuccess(successMsg);
          setAssetFeedback(successMsg);
          setInventoryFeedback(successMsg);
          setTimeout(() => setAssetFeedback(null), 7000);
        } catch (err: any) {
          setIssueError(err.message);
        }
        return;
      }

      // Branch 1.B: Manufacture & Supply a New Showroom Finished Goods Piece (تصنيع وتوريد قطعة جديدة)
      if (!issueShowroomPieceName.trim()) {
        setIssueError('يرجى كتابة اسم وتوصيف قطعة المعرض الجديدة المطلوب تصنيعها.');
        return;
      }

      try {
        // Validate stock and issue using batch's division
        const result = InventoryBatchEngine.validateAndIssueStock(
          selectedBatch,
          issueQty,
          selectedBatch.divisionId
        );

        // 1. Update Batch Remaining Qty
        const updatedBatches = batches.map((b) =>
          b.id === selectedBatch.id ? { ...b, remainingQuantity: result.remainingQuantity } : b
        );
        setBatches(updatedBatches);

        // 2. Add Material Issue Record (Internal Showroom Finished Goods Production)
        const newIssue: MaterialIssue = {
          id: crypto.randomUUID(),
          issueNumber: SequenceFormatter.formatNumber('MATERIAL_ISSUE', 2026, issues.length + 1),
          projectId: 'SHOWROOM',
          projectName: `مستودع المعرض: ${issueShowroomPieceName.trim()}`,
          divisionId: selectedBatch.divisionId,
          batchId: selectedBatch.id,
          materialId: selectedBatch.materialId,
          materialNameAr: selectedBatch.materialNameAr,
          quantity: issueQty,
          unitCost: result.unitCost,
          totalCost: result.totalCost,
          date: new Date().toISOString().split('T')[0],
          status: 'POSTED',
          issuedBy: 'أمين المستودع (Warehouse Keeper)',
          createdAt: new Date().toISOString(),
          notes: `تحويل مخزني داخلي: تصنيع قطعة جاهزة لصالح مستودع المعرض (${selectedBatch.divisionId === 'WOOD' ? 'قسم النجارة' : 'قسم الألمنيوم'}) — حركة مخزنية بحتة دون تأثير على الصندوق`,
        };
        const updatedIssues = [newIssue, ...issues];
        setIssues(updatedIssues);

        // 3. Automatically add to Showroom Items as an active finished goods inventory item
        const divPrefix = selectedBatch.divisionId === 'WOOD' ? 'WOD' : 'ALM';
        const divItemsCount = showroomItems.filter((i) => i.divisionId === selectedBatch.divisionId).length + 1;
        const itemCode = `SHW-${divPrefix}-${String(divItemsCount).padStart(3, '0')}`;

        const proposedPrice = issueShowroomProposedPrice.trim()
          ? issueShowroomProposedPrice.trim()
          : new PreciseMoney(result.totalCost).mul('1.5').toDbString(2);

        const newShowroomItem: ShowroomItem = {
          id: `shw-auto-${Date.now()}`,
          itemCode,
          nameAr: issueShowroomPieceName.trim(),
          divisionId: selectedBatch.divisionId,
          category: issueShowroomCategory.trim() || (selectedBatch.divisionId === 'WOOD' ? 'أبواب ونماذج ديكورية' : 'واجهات ومقاطع معمارية'),
          productionCost: result.totalCost,
          proposedSalePrice: proposedPrice,
          status: 'IN_SHOWROOM',
          displayDate: new Date().toISOString().split('T')[0],
          dimensions: issueShowroomDimensions.trim() || 'نموذج عرض بمقاسات معتمدة',
          notes: `تصنيع وتوريد مخزني مباشر بموجب مستند صرف [${newIssue.issueNumber}] ومادة [${selectedBatch.materialNameAr}]`,
        };

        setShowroomItems([newShowroomItem, ...showroomItems]);

        // Reset inputs
        setIssueShowroomPieceName('');
        setIssueShowroomDimensions('');
        setIssueShowroomProposedPrice('');
        setIsIssueModalOpen(false);

        const successMsg = `تم بنجاح صرف المواد من المستودع بقيمة [${new PreciseMoney(result.totalCost).formatIQD()}]، وقيد القطعة [${newShowroomItem.nameAr}] كبضاعة جاهزة في مستودع المعرض — حركة مخزنية بحتة دون أي تأثير مالي على الصندوق!`;
        setIssueSuccess(successMsg);
        setAssetFeedback(successMsg);
        setInventoryFeedback(successMsg);
        setTimeout(() => setAssetFeedback(null), 7000);
      } catch (err: any) {
        setIssueError(err.message);
      }
      return;
    }

    // Branch 2: Commercial Customer Project Issuance
    const targetProject = projects.find((p) => p.id === issueProjectId);
    if (!targetProject) {
      setIssueError('يرجى تحديد المشروع التجاري المستلم.');
      return;
    }

    try {
      // Execute Domain Validation & Issuance
      const result = InventoryBatchEngine.validateAndIssueStock(
        selectedBatch,
        issueQty,
        targetProject.divisionId
      );

      // 1. Update Batch Remaining Qty
      const updatedBatches = batches.map((b) =>
        b.id === selectedBatch.id ? { ...b, remainingQuantity: result.remainingQuantity } : b
      );
      setBatches(updatedBatches);

      // 2. Add Material Issue Record
      const newIssue: MaterialIssue = {
        id: crypto.randomUUID(),
        issueNumber: SequenceFormatter.formatNumber('MATERIAL_ISSUE', 2026, issues.length + 1),
        projectId: targetProject.id,
        projectName: targetProject.name,
        divisionId: targetProject.divisionId,
        batchId: selectedBatch.id,
        materialId: selectedBatch.materialId,
        materialNameAr: selectedBatch.materialNameAr,
        quantity: issueQty,
        unitCost: result.unitCost,
        totalCost: result.totalCost,
        date: new Date().toISOString().split('T')[0],
        status: 'POSTED',
        issuedBy: 'أمين المستودع (Warehouse Keeper)',
        createdAt: new Date().toISOString(),
      };
      const updatedIssues = [newIssue, ...issues];
      setIssues(updatedIssues);

      // 3. Update Project Actual Material Cost
      const projectIssues = updatedIssues.filter((i) => i.projectId === targetProject.id);
      const newActualMaterialCost = ProjectCostingEngine.calculateMaterialCost(projectIssues);

      const updatedProjects = projects.map((p) =>
        p.id === targetProject.id ? { ...p, actualMaterialCost: newActualMaterialCost.toDbString(2) } : p
      );
      setProjects(updatedProjects);

      setIssueSuccess(`تم صرف المواد بنجاح بالمستند رقم [${newIssue.issueNumber}] وتحديث كلفة المواد المباشرة للمشروع.`);
      setIsIssueModalOpen(false);
    } catch (err: any) {
      setIssueError(err.message);
    }
  };

  // ---------------------------------------------------------------------------
  // Partners & Profit Settlement Engine (عزل تام، حساب الأرباح، والسلف)
  // ---------------------------------------------------------------------------
  const getDivisionFinancialSummary = (div: DivisionId) => {
    const fromDate = partnerDateFrom;
    const toDate = partnerDateTo;

    // 1. Realized Revenue (المبالغ الواصلة فعلياً من المشاريع خلال الفترة المحددة)
    let realizedRevenue = PreciseMoney.zero();
    const collectedPaymentsList: {
      id: string;
      voucherNumber: string;
      customerName: string;
      projectName: string;
      date: string;
      amount: string;
      paymentMethod: string;
    }[] = [];

    contacts.forEach((contact) => {
      if (contact.type === 'CUSTOMER' && contact.paymentHistory) {
        contact.paymentHistory.forEach((pm) => {
          const inDate = (!fromDate || pm.date >= fromDate) && (!toDate || pm.date <= toDate);
          if (!inDate) return;

          const matchingProject = projects.find((p) => p.customerId === contact.id && p.divisionId === div);
          const matchesDiv =
            contact.divisionId === div ||
            (pm.projectName && (
              (div === 'WOOD' && (pm.projectName.includes('خشب') || pm.projectName.includes('ديكور') || pm.projectName.includes('الفردوس') || pm.projectName.includes('الحديثي'))) ||
              (div === 'ALUMINUM' && (pm.projectName.includes('ألمنيوم') || pm.projectName.includes('الواجهات') || pm.projectName.includes('النور') || pm.projectName.includes('البروج')))
            ));

          if (matchesDiv || (matchingProject && contact.divisionId !== (div === 'WOOD' ? 'ALUMINUM' : 'WOOD'))) {
            realizedRevenue = realizedRevenue.add(new PreciseMoney(pm.amount));
            collectedPaymentsList.push({
              id: pm.id,
              voucherNumber: pm.voucherNumber,
              customerName: contact.name,
              projectName: pm.projectName || matchingProject?.name || 'دفعة عقد واصلة',
              date: pm.date,
              amount: pm.amount,
              paymentMethod: pm.paymentMethod,
            });
          }
        });
      }
    });

    if (realizedRevenue.isZero()) {
      const divProjects = projects.filter((p) => p.divisionId === div);
      divProjects.forEach((p) => {
        const inDate = (!fromDate || p.startDate >= fromDate) && (!toDate || p.startDate <= toDate);
        if (inDate && Number(p.collectedAmount) > 0) {
          realizedRevenue = realizedRevenue.add(new PreciseMoney(p.collectedAmount));
          collectedPaymentsList.push({
            id: `col-${p.id}`,
            voucherNumber: `COL-${p.projectNumber}`,
            customerName: p.customerName || 'عميل نقدي',
            projectName: p.name,
            date: p.startDate,
            amount: p.collectedAmount,
            paymentMethod: 'CASH',
          });
        }
      });
    }

    // Add Realized Revenue from Sold Showroom Items for this division
    showroomItems.forEach((item) => {
      if (item.divisionId === div && item.status === 'SOLD' && item.actualSalePrice) {
        const inDate = (!fromDate || (item.soldDate && item.soldDate >= fromDate)) && (!toDate || (item.soldDate && item.soldDate <= toDate));
        if (inDate) {
          realizedRevenue = realizedRevenue.add(new PreciseMoney(item.actualSalePrice));
          collectedPaymentsList.push({
            id: `shw-pay-${item.id}`,
            voucherNumber: item.voucherNumber || `SHW-${item.itemCode}`,
            customerName: item.buyerName || 'عميل مبيعات المعرض',
            projectName: `مبيعات المعرض: ${item.nameAr}`,
            date: item.soldDate || item.displayDate,
            amount: item.actualSalePrice,
            paymentMethod: item.paymentMethod || 'CASH',
          });
        }
      }
    });

    // 2. Direct Material Costs (تكاليف المواد والورش المنصرفة للمشاريع في الفترة)
    let materialCosts = PreciseMoney.zero();
    const materialIssuesList: {
      id: string;
      materialName: string;
      date: string;
      amount: string;
      projectName: string;
    }[] = [];

    // Add Production Cost of Sold Showroom Items for this division
    showroomItems.forEach((item) => {
      if (item.divisionId === div && item.status === 'SOLD' && item.productionCost) {
        const inDate = (!fromDate || (item.soldDate && item.soldDate >= fromDate)) && (!toDate || (item.soldDate && item.soldDate <= toDate));
        if (inDate) {
          materialCosts = materialCosts.add(new PreciseMoney(item.productionCost));
          materialIssuesList.push({
            id: `iss-shw-${item.id}`,
            materialName: `تكلفة إنتاج قطعة المعرض المباعة: ${item.nameAr}`,
            date: item.soldDate || item.displayDate,
            amount: item.productionCost,
            projectName: `معروضات المعرض (${item.itemCode})`,
          });
        }
      }
    });

    issues.forEach((iss) => {
      if (iss.divisionId === div) {
        const inDate = (!fromDate || iss.date >= fromDate) && (!toDate || iss.date <= toDate);
        if (inDate) {
          materialCosts = materialCosts.add(new PreciseMoney(iss.totalCost));
          materialIssuesList.push({
            id: iss.id,
            materialName: iss.materialNameAr || 'مادة ورشة',
            date: iss.date,
            amount: iss.totalCost,
            projectName: iss.projectName || 'مشروع عام',
          });
        }
      }
    });

    if (materialCosts.isZero()) {
      const divProjects = projects.filter((p) => p.divisionId === div);
      divProjects.forEach((p) => {
        const inDate = (!fromDate || p.startDate >= fromDate) && (!toDate || p.startDate <= toDate);
        if (inDate && Number(p.actualMaterialCost) > 0) {
          materialCosts = materialCosts.add(new PreciseMoney(p.actualMaterialCost));
          materialIssuesList.push({
            id: `iss-proj-${p.id}`,
            materialName: 'كلفة المواد الأولية والتشغيلية المعتمدة للمشروع',
            date: p.startDate,
            amount: p.actualMaterialCost,
            projectName: p.name,
          });
        }
      });
    }

    // 3. Divisional Direct General Expenses (كهرباء، إنترنت، صيانة، إيجار، إلخ)
    let directExpenses = PreciseMoney.zero();
    const directExpensesList: GeneralExpense[] = [];
    expenses.forEach((exp) => {
      if (exp.divisionId === div && exp.category !== 'SALARIES') {
        const inDate = (!fromDate || exp.date >= fromDate) && (!toDate || exp.date <= toDate);
        if (inDate) {
          directExpenses = directExpenses.add(new PreciseMoney(exp.amount));
          directExpensesList.push(exp);
        }
      }
    });

    // 4. Shared Expenses Allocation (50% share of shared operating expenses)
    let sharedExpensesShare = PreciseMoney.zero();
    const sharedExpensesList: GeneralExpense[] = [];
    expenses.forEach((exp) => {
      if (exp.divisionId === 'SHARED' && exp.category !== 'SALARIES') {
        const inDate = (!fromDate || exp.date >= fromDate) && (!toDate || exp.date <= toDate);
        if (inDate) {
          const halfAmount = new PreciseMoney(exp.amount).div(2);
          sharedExpensesShare = sharedExpensesShare.add(halfAmount);
          sharedExpensesList.push(exp);
        }
      }
    });

    // 5. Salaries & Wages for the Division in this Period
    let salariesCost = PreciseMoney.zero();
    const salaryExpensesInPeriod = expenses.filter(
      (exp) => exp.category === 'SALARIES' && (!fromDate || exp.date >= fromDate) && (!toDate || exp.date <= toDate)
    );
    if (salaryExpensesInPeriod.length > 0) {
      salaryExpensesInPeriod.forEach((exp) => {
        if (exp.divisionId === div) {
          salariesCost = salariesCost.add(new PreciseMoney(exp.amount));
        } else if (exp.divisionId === 'SHARED') {
          salariesCost = salariesCost.add(new PreciseMoney(exp.amount).div(2));
        }
      });
    } else {
      const divEmployees = employees.filter((e) => e.divisionId === div && e.isActive);
      const sharedEmployees = employees.filter((e) => (e.isShared || e.divisionId === null) && e.isActive);

      divEmployees.forEach((e) => {
        salariesCost = salariesCost.add(new PreciseMoney(e.monthlySalary));
      });
      sharedEmployees.forEach((e) => {
        salariesCost = salariesCost.add(new PreciseMoney(e.monthlySalary).div(2));
      });
    }

    // Total Realized Expenses (كتلة المصروفات الكاملة)
    const totalExpenses = materialCosts
      .add(directExpenses)
      .add(sharedExpensesShare)
      .add(salariesCost);

    // Net Profit (صافي الربح)
    const netProfit = realizedRevenue.sub(totalExpenses);

    // Reserve deduction
    const reservePctNum = Number(partnerReservePct) || 0;
    const reserveAmount = netProfit.isPositive() && reservePctNum > 0
      ? netProfit.mul(reservePctNum).div(100)
      : PreciseMoney.zero();

    // Distributable Profit (صافي الربح القابل للتوزيع)
    const distributableProfit = netProfit.isPositive()
      ? netProfit.sub(reserveAmount)
      : PreciseMoney.zero();

    // Partners for this division
    const divPartners = partners.filter((p) => p.divisionId === div && p.isActive);

    // Compute each partner's share and advances
    let distributedSum = PreciseMoney.zero();
    const partnerShares = divPartners.map((p, index) => {
      const pct = new PreciseMoney(p.profitPercentage);
      let grossShare: PreciseMoney;

      if (index === divPartners.length - 1) {
        grossShare = distributableProfit.sub(distributedSum);
        if (grossShare.isNegative()) grossShare = PreciseMoney.zero();
      } else {
        grossShare = distributableProfit.mul(pct).div(100);
        distributedSum = distributedSum.add(grossShare);
      }

      const pAdvances = partnerAdvances.filter(
        (adv) =>
          adv.partnerId === p.id &&
          adv.status === 'ACTIVE' &&
          (!fromDate || adv.date >= fromDate) &&
          (!toDate || adv.date <= toDate)
      );

      const totalAdvances = pAdvances.reduce(
        (acc, adv) => acc.add(new PreciseMoney(adv.amount)),
        PreciseMoney.zero()
      );

      const netPayable = grossShare.sub(totalAdvances);

      return {
        partner: p,
        profitPercentage: p.profitPercentage,
        grossShare,
        advancesList: pAdvances,
        totalAdvances,
        netPayable,
      };
    });

    return {
      divisionId: div,
      realizedRevenue,
      collectedPaymentsList,
      materialCosts,
      materialIssuesList,
      directExpenses,
      directExpensesList,
      sharedExpensesShare,
      sharedExpensesList,
      salariesCost,
      totalExpenses,
      netProfit,
      reserveAmount,
      distributableProfit,
      partnerShares,
    };
  };

  const woodSummary = getDivisionFinancialSummary('WOOD');
  const alumSummary = getDivisionFinancialSummary('ALUMINUM');

  // Partner Advance Handler
  const handleDisbursePartnerAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPartner = partners.find((p) => p.id === selectedPartnerForAdvance);
    if (!targetPartner) {
      setPadvError('يرجى اختيار الشريك المستفيد من السلفة.');
      return;
    }
    const cleanAmount = padvAmount.replace(/,/g, '').trim();
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      setPadvError('يرجى تحديد مبلغ سلفة صحيح أكبر من صفر.');
      return;
    }

    const newAdvance: PartnerAdvance = {
      id: `padv-${Date.now()}`,
      voucherNumber: padvVoucherNo.trim() || SequenceFormatter.formatNumber('PARTNER_ADVANCE', new Date().getFullYear(), partnerAdvances.length + 1),
      partnerId: targetPartner.id,
      partnerName: targetPartner.name,
      divisionId: targetPartner.divisionId,
      date: padvDate,
      amount: new PreciseMoney(cleanAmount).toDbString(2),
      paymentMethod: padvPaymentMethod,
      reason: padvReason.trim() || 'سلفة نقدية على حصة الأرباح الدورية',
      status: 'ACTIVE',
      paidBy: 'أمين الصندوق المركزي',
      createdAt: new Date().toISOString(),
    };

    setPartnerAdvances((prev) => [newAdvance, ...prev]);
    setIsPartnerAdvanceModalOpen(false);
    setPadvAmount('');
    setPadvReason('');
    setPadvError(null);
    setPadvVoucherNo(SequenceFormatter.formatNumber('PARTNER_ADVANCE', new Date().getFullYear(), partnerAdvances.length + 2));
    setPartnerFeedback(
      `تم بنجاح صرف سلفة بقيمة ${new PreciseMoney(newAdvance.amount).formatIQD()} للشريك "${targetPartner.name}" بموجب السند [${newAdvance.voucherNumber}] وحسمها من حصته القادمة.`
    );
    setTimeout(() => setPartnerFeedback(null), 4000);
  };

  // Partner Cycle Settlement Confirmation Handler
  const handleConfirmSettlementCycle = (divisionId: DivisionId) => {
    const summary = divisionId === 'WOOD' ? woodSummary : alumSummary;
    if (summary.partnerShares.length === 0) return;

    const records: PartnerSettlementRecord[] = summary.partnerShares.map((s) => ({
      partnerId: s.partner.id,
      partnerName: s.partner.name,
      divisionId: s.partner.divisionId,
      profitPercentage: s.profitPercentage,
      grossProfitShare: s.grossShare.toDbString(2),
      advancesDeducted: s.totalAdvances.toDbString(2),
      netPayableShare: s.netPayable.toDbString(2),
    }));

    const newCycle: PartnerSettlementCycle = {
      id: `settle-${Date.now()}`,
      settlementNumber: `SET-${new Date().getFullYear()}-${divisionId}-${Date.now().toString().slice(-4)}`,
      divisionId,
      periodName: settlementPeriodTitle || `تصفية دورة ${divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'} (${partnerDateFrom} إلى ${partnerDateTo})`,
      startDate: partnerDateFrom || '2026-01-01',
      endDate: partnerDateTo || new Date().toISOString().split('T')[0],
      totalRevenue: summary.realizedRevenue.toDbString(2),
      totalExpenses: summary.totalExpenses.toDbString(2),
      netProfit: summary.netProfit.toDbString(2),
      reserveDeduction: summary.reserveAmount.toDbString(2),
      distributableProfit: summary.distributableProfit.toDbString(2),
      records,
      status: 'SETTLED',
      settledDate: new Date().toISOString(),
      notes: `تم اعتماد التصفية وتوزيع الأرباح وحسم السلف المعتمدة.`,
    };

    setSettlementCycles((prev) => [newCycle, ...prev]);

    // Mark partner advances in this division as SETTLED
    setPartnerAdvances((prev) =>
      prev.map((adv) =>
        adv.divisionId === divisionId && adv.status === 'ACTIVE'
          ? { ...adv, status: 'SETTLED' as const }
          : adv
      )
    );

    setIsConfirmSettlementModalOpen(false);
    setPartnerFeedback(
      `تم بنجاح اعتماد تصفية أرباح ${divisionId === 'WOOD' ? 'قسم النجارة' : 'قسم الألمنيوم'} وتوثيق السند [${newCycle.settlementNumber}] وترحيل السلف إلى الأرشيف!`
    );
    setTimeout(() => setPartnerFeedback(null), 5000);
  };

  // Shared Labor Calculation
  const laborAllocation = SharedLaborAllocator.allocateSharedLabor(
    sharedLaborAmount,
    woodLaborPct,
    alumLaborPct
  );

  // ---------------------------------------------------------------------------
  // Assets & Showroom Calculations & Handlers (إدارة الأصول ومعروضات المعرض)
  // ---------------------------------------------------------------------------
  const handleOpenSellShowroomItem = (item: ShowroomItem) => {
    setSelectedShowroomItemForSale(item);
    setSalePrice(item.proposedSalePrice);
    setSaleBuyerName('');
    setSaleBuyerPhone('');
    setSalePaymentMethod('CASH');
    setSaleDate(new Date().toISOString().split('T')[0]);
    setSaleNotes('');
    setSaleError(null);
    setIsSellShowroomModalOpen(true);
  };

  const handleConfirmSaleShowroomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShowroomItemForSale) return;
    const pricePM = new PreciseMoney(salePrice || '0');
    if (!pricePM.isPositive()) {
      setSaleError('يرجى إدخال سعر بيع صحيح وأكبر من الصفر');
      return;
    }
    const costPM = new PreciseMoney(selectedShowroomItemForSale.productionCost);
    const profitPM = pricePM.sub(costPM);
    const targetDivision = selectedShowroomItemForSale.divisionId;

    const voucherNo = SequenceFormatter.formatNumber('SHOWROOM_SALE', new Date().getFullYear(), showroomItems.filter((s) => s.status === 'SOLD').length + 1);

    setShowroomItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedShowroomItemForSale.id) {
          return {
            ...item,
            status: 'SOLD' as const,
            soldDate: saleDate,
            actualSalePrice: pricePM.toDbString(2),
            buyerName: saleBuyerName.trim() || 'عميل معرض نقدي',
            buyerPhone: saleBuyerPhone.trim(),
            paymentMethod: salePaymentMethod,
            netProfit: profitPM.toDbString(2),
            voucherNumber: voucherNo,
            notes: saleNotes.trim() ? `${item.notes || ''} | بيع: ${saleNotes.trim()}` : item.notes,
          };
        }
        return item;
      })
    );

    setIsSellShowroomModalOpen(false);
    setAssetFeedback(
      `تم بنجاح تسجيل بيع القطعة [${selectedShowroomItemForSale.nameAr}] بمبلغ [${pricePM.formatIQD()}]. دخل كامل المبلغ نقداً للصندوق، واستُردت كلفة المواد [${costPM.formatIQD()}] كسيولة نقدية، وأُثبت صافي ربح قدره [${profitPM.formatIQD()}] لصالح قسم ${targetDivision === 'WOOD' ? 'النجارة' : 'الألمنيوم'}.`
    );
    setTimeout(() => setAssetFeedback(null), 6000);
  };

  const handleOpenReplenishModal = (targetDiv?: DivisionId) => {
    setNewShowroomItemName('');
    setNewShowroomDivision(targetDiv || (assetDivisionFilter !== 'ALL' ? assetDivisionFilter : 'WOOD'));
    setNewShowroomCategory('أبواب ونماذج ديكورية فاخرة');
    setNewShowroomCost('');
    setNewShowroomProposedPrice('');
    setNewShowroomDimensions('');
    setNewShowroomNotes('');
    setNewShowroomError(null);
    setIsReplenishModalOpen(true);
  };

  const handleConfirmReplenishShowroomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowroomItemName.trim()) {
      setNewShowroomError('يرجى كتابة اسم وتوصيف القطعة الجاهزة');
      return;
    }
    const costPM = new PreciseMoney(newShowroomCost || '0');
    if (!costPM.isPositive()) {
      setNewShowroomError('يرجى إدخال تكلفة مواد وتصنيع صحيحة وأكبر من الصفر');
      return;
    }
    const proposedPM = new PreciseMoney(newShowroomProposedPrice || '0');

    const nextSeq = showroomItems.filter((s) => s.divisionId === newShowroomDivision).length + 1;
    const itemCode = `SHW-${newShowroomDivision === 'WOOD' ? 'WOD' : 'ALM'}-${String(nextSeq).padStart(3, '0')}`;

    const newItem: ShowroomItem = {
      id: `shw-${Date.now()}`,
      itemCode,
      nameAr: newShowroomItemName.trim(),
      divisionId: newShowroomDivision,
      category: newShowroomCategory.trim() || 'نماذج ومواد جاهزة',
      productionCost: costPM.toDbString(2),
      proposedSalePrice: proposedPM.isPositive() ? proposedPM.toDbString(2) : costPM.mul(1.5).toDbString(2),
      status: 'IN_SHOWROOM',
      displayDate: new Date().toISOString().split('T')[0],
      dimensions: newShowroomDimensions.trim(),
      notes: newShowroomNotes.trim() ? `${newShowroomNotes.trim()} (توريد مخزني مباشر)` : 'توريد مخزني مباشر لمستودع المواد الجاهزة',
    };

    setShowroomItems((prev) => [newItem, ...prev]);
    setIsReplenishModalOpen(false);
    setAssetFeedback(
      `تم بنجاح قيد القطعة [${newItem.nameAr}] في مستودع المعرض للمواد الجاهزة بكلفة مواد وتصنيع [${costPM.formatIQD()}] — حركة مخزنية للمواد لا تمس السيولة أو رصيد الصندوق النقدي.`
    );
    setTimeout(() => setAssetFeedback(null), 6000);
  };

  const handleOpenEditLumpSumsModal = () => {
    setEditWoodLumpSum(formatThousands(divisionLumpSums.WOOD.lumpSumAmount));
    setEditAlumLumpSum(formatThousands(divisionLumpSums.ALUMINUM.lumpSumAmount));
    setEditSharedLumpSum(formatThousands(divisionLumpSums.SHARED.lumpSumAmount));
    setIsEditLumpSumsModalOpen(true);
  };

  const handleSaveLumpSums = (e: React.FormEvent) => {
    e.preventDefault();
    const woodPM = new PreciseMoney(editWoodLumpSum || '0');
    const alumPM = new PreciseMoney(editAlumLumpSum || '0');
    const sharedPM = new PreciseMoney(editSharedLumpSum || '0');

    setDivisionLumpSums({
      WOOD: {
        divisionId: 'WOOD',
        lumpSumAmount: woodPM.toDbString(2),
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: 'تم تثبيت المبلغ من قبل الإدارة',
      },
      ALUMINUM: {
        divisionId: 'ALUMINUM',
        lumpSumAmount: alumPM.toDbString(2),
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: 'تم تثبيت المبلغ من قبل الإدارة',
      },
      SHARED: {
        divisionId: 'SHARED',
        lumpSumAmount: sharedPM.toDbString(2),
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: 'تم تثبيت المبلغ من قبل الإدارة',
      },
    });

    setIsEditLumpSumsModalOpen(false);
    setAssetFeedback('تم بنجاح تثبيت وتحديث مبالغ الأصول الثابتة لكافة الأقسام.');
    setTimeout(() => setAssetFeedback(null), 5000);
  };

  const handleCreateFixedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) {
      setNewAssetError('يرجى إدخال اسم الأصل / الماكينة');
      return;
    }
    const costPM = new PreciseMoney(newAssetCost || '0');
    if (!costPM.isPositive()) {
      setNewAssetError('يرجى تحديد تكلفة شراء أصل صحيحة أكبر من الصفر');
      return;
    }

    const nextSeq = fixedAssets.length + 1;
    const divPrefix = newAssetDivision === 'WOOD' ? 'WOD' : newAssetDivision === 'ALUMINUM' ? 'ALM' : 'SHR';
    const assetCode = `AST-${divPrefix}-${String(nextSeq).padStart(3, '0')}`;

    let categoryLabelAr = 'آلات وماكينات الورش والـ CNC';
    if (newAssetCategory === 'VEHICLES') categoryLabelAr = 'سيارات وشاحنات النقل';
    else if (newAssetCategory === 'TOOLS_EQUIPMENT') categoryLabelAr = 'عدد وأدوات كهربائية وهيدروليكية';
    else if (newAssetCategory === 'BUILDINGS_PREMISES') categoryLabelAr = 'مباني المعرض والورش والتجهيزات الثابتة';
    else if (newAssetCategory === 'IT_OFFICE') categoryLabelAr = 'أجهزة حاسوب وسيرفرات وتصميم هندسي';
    else if (newAssetCategory === 'OTHER') categoryLabelAr = 'أصول أخرى';

    const newAsset: FixedAsset = {
      id: `ast-${Date.now()}`,
      assetCode,
      nameAr: newAssetName.trim(),
      divisionId: newAssetDivision,
      category: newAssetCategory,
      categoryLabelAr,
      purchaseDate: newAssetPurchaseDate,
      originalCost: costPM.toDbString(2),
      currentValue: costPM.toDbString(2),
      location: newAssetLocation.trim() || 'الموقع الرئيسي',
      status: 'ACTIVE',
      notes: newAssetNotes.trim(),
    };

    setFixedAssets((prev) => [newAsset, ...prev]);
    setIsAddFixedAssetModalOpen(false);
    setNewAssetName('');
    setNewAssetCost('');
    setNewAssetNotes('');
    setNewAssetError(null);
    setAssetFeedback(`تم بنجاح إضافة الأصل الجديد [${newAsset.nameAr}] بالكود [${newAsset.assetCode}].`);
    setTimeout(() => setAssetFeedback(null), 5000);
  };

  // Filtered Showroom Items
  const filteredShowroomItems = showroomItems.filter((item) => {
    const matchesDiv = assetDivisionFilter === 'ALL' || item.divisionId === assetDivisionFilter;
    const matchesStatus = assetShowroomStatusFilter === 'ALL' || item.status === assetShowroomStatusFilter;
    const term = assetSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      item.nameAr.toLowerCase().includes(term) ||
      item.itemCode.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      (item.buyerName && item.buyerName.toLowerCase().includes(term)) ||
      (item.notes && item.notes.toLowerCase().includes(term));
    return matchesDiv && matchesStatus && matchesSearch;
  });

  // Filtered Detailed Fixed Assets
  const filteredFixedAssets = fixedAssets.filter((ast) => {
    const matchesDiv = assetDivisionFilter === 'ALL' ? true : ast.divisionId === assetDivisionFilter;
    const term = assetSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      ast.nameAr.toLowerCase().includes(term) ||
      ast.assetCode.toLowerCase().includes(term) ||
      ast.location.toLowerCase().includes(term) ||
      ast.categoryLabelAr.toLowerCase().includes(term);
    return matchesDiv && matchesSearch;
  });

  // Comprehensive Asset & Showroom Financial KPI Calculations
  const woodLumpSumPM = new PreciseMoney(divisionLumpSums.WOOD.lumpSumAmount);
  const alumLumpSumPM = new PreciseMoney(divisionLumpSums.ALUMINUM.lumpSumAmount);
  const sharedLumpSumPM = new PreciseMoney(divisionLumpSums.SHARED.lumpSumAmount);

  // Active Showroom Assets (Current Physical Display Pieces at Cost)
  const activeWoodShowroomCost = showroomItems
    .filter((s) => s.divisionId === 'WOOD' && s.status === 'IN_SHOWROOM')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.productionCost)), PreciseMoney.zero());

  const activeAlumShowroomCost = showroomItems
    .filter((s) => s.divisionId === 'ALUMINUM' && s.status === 'IN_SHOWROOM')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.productionCost)), PreciseMoney.zero());

  // Sold Showroom Realized Revenue & Net Profits
  const woodShowroomSoldRevenue = showroomItems
    .filter((s) => s.divisionId === 'WOOD' && s.status === 'SOLD')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.actualSalePrice || 0)), PreciseMoney.zero());

  const woodShowroomSoldProfit = showroomItems
    .filter((s) => s.divisionId === 'WOOD' && s.status === 'SOLD')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.netProfit || 0)), PreciseMoney.zero());

  const alumShowroomSoldRevenue = showroomItems
    .filter((s) => s.divisionId === 'ALUMINUM' && s.status === 'SOLD')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.actualSalePrice || 0)), PreciseMoney.zero());

  const alumShowroomSoldProfit = showroomItems
    .filter((s) => s.divisionId === 'ALUMINUM' && s.status === 'SOLD')
    .reduce((acc, s) => acc.add(new PreciseMoney(s.netProfit || 0)), PreciseMoney.zero());

  // Total Divisional Assets (Lump-Sum Fixed Assets + Active Showroom Display Inventory)
  const totalWoodAssetsPM = woodLumpSumPM.add(activeWoodShowroomCost);
  const totalAlumAssetsPM = alumLumpSumPM.add(activeAlumShowroomCost);
  const grandTotalCompanyAssetsPM = totalWoodAssetsPM.add(totalAlumAssetsPM).add(sharedLumpSumPM);

  // ---------------------------------------------------------------------------
  // Dedicated Inventory & Purchasing Calculations & Handlers
  // ---------------------------------------------------------------------------
  const filteredBatches = batches.filter((b) => {
    const matchesDiv = inventoryDivisionFilter === 'ALL' || b.divisionId === inventoryDivisionFilter;
    const term = inventorySearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (b.materialNameAr && b.materialNameAr.toLowerCase().includes(term)) ||
      b.batchNumber.toLowerCase().includes(term) ||
      b.materialId.toLowerCase().includes(term) ||
      b.purchaseInvoiceId.toLowerCase().includes(term);
    return matchesDiv && matchesSearch;
  });

  const filteredPurchaseInvoices = purchaseInvoices.filter((inv) => {
    const matchesDiv = inventoryDivisionFilter === 'ALL' || inv.divisionId === inventoryDivisionFilter;
    const term = inventorySearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      inv.invoiceNumber.toLowerCase().includes(term) ||
      (inv.supplierInvoiceNumber && inv.supplierInvoiceNumber.toLowerCase().includes(term)) ||
      inv.supplierName.toLowerCase().includes(term) ||
      inv.lines.some((l) => l.materialNameAr.toLowerCase().includes(term) || l.materialCode.toLowerCase().includes(term));
    return matchesDiv && matchesSearch;
  });

  // Inventory KPI Metrics
  const scopedBatches = batches.filter(
    (b) => inventoryDivisionFilter === 'ALL' || b.divisionId === inventoryDivisionFilter
  );

  const totalRegisteredInventoryValue = scopedBatches.reduce(
    (acc, b) => acc.add(new PreciseMoney(b.initialQuantity).mul(new PreciseMoney(b.unitCost))),
    PreciseMoney.zero()
  );

  const currentActualInventoryValue = scopedBatches.reduce(
    (acc, b) => acc.add(new PreciseMoney(b.remainingQuantity).mul(new PreciseMoney(b.unitCost))),
    PreciseMoney.zero()
  );

  const totalIssuedInventoryValue = totalRegisteredInventoryValue.sub(currentActualInventoryValue);

  const totalUnitsRemaining = scopedBatches.reduce(
    (acc, b) => acc + Number(b.remainingQuantity || 0),
    0
  );

  // New Purchase Invoice Calculations
  const currentPurchaseSubtotal = purchaseLines.reduce((acc, l) => {
    return acc.add(new PreciseMoney(l.quantity || '0').mul(new PreciseMoney(l.unitCost || '0')));
  }, PreciseMoney.zero());

  const currentPurchaseDiscount = new PreciseMoney(purchaseDiscount || '0');
  const currentPurchaseGrandTotal = currentPurchaseSubtotal.sub(currentPurchaseDiscount).isNegative()
    ? PreciseMoney.zero()
    : currentPurchaseSubtotal.sub(currentPurchaseDiscount);

  const currentPurchaseRemaining = currentPurchaseGrandTotal.sub(new PreciseMoney(purchasePaidAmount || '0'));
  const safeCurrentPurchaseRemaining = currentPurchaseRemaining.isNegative()
    ? PreciseMoney.zero()
    : currentPurchaseRemaining;

  const handleOpenNewPurchaseInvoice = () => {
    const nextSeq = purchaseInvoices.length + 1;
    const generatedNo = SequenceFormatter.formatNumber('PURCHASE', new Date().getFullYear(), nextSeq);
    setPurchaseInvoiceNumber(generatedNo);
    setPurchaseSupplierInvoiceNo('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    const initialDiv = inventoryDivisionFilter === 'ALUMINUM' ? 'ALUMINUM' : 'WOOD';
    setPurchaseDivision(initialDiv);
    setPurchaseSupplierMode('EXISTING');
    const matchingSuppliers = contacts.filter(
      (c) => c.type === 'SUPPLIER' && (c.divisionId === initialDiv || !c.divisionId)
    );
    setPurchaseSupplierId(matchingSuppliers[0]?.id || '');
    setPurchaseNewSupplierName('');
    setPurchaseNewSupplierPhone('');
    setPurchaseWarehouseId(initialDiv === 'ALUMINUM' ? 'wh-alm-1' : 'wh-wood-1');
    setPurchasePaymentMethod('CASH');
    setPurchaseDiscount('0');
    setPurchaseNotes('');
    setPurchaseError(null);

    const defaultMaterial = inventoryMaterials.find((m) => m.divisionId === initialDiv) || inventoryMaterials[0];
    const initialQty = '10';
    const initialCost = initialDiv === 'WOOD' ? '35000' : '48000';
    const initialTotal = new PreciseMoney(initialQty).mul(new PreciseMoney(initialCost)).toDbString(2);

    setPurchaseLines([
      {
        materialCode: defaultMaterial?.code || (initialDiv === 'WOOD' ? 'MAT-W01' : 'MAT-A01'),
        materialNameAr: defaultMaterial?.nameAr || (initialDiv === 'WOOD' ? 'لوح خشب MDF سماكة 18 ملم أسباني' : 'بروفيل ألمنيوم ثيرمال بريك 6 متر'),
        unit: defaultMaterial?.unit || (initialDiv === 'WOOD' ? 'لوح' : 'قطعة'),
        quantity: initialQty,
        unitCost: initialCost,
        lineTotal: initialTotal,
        notes: '',
      },
    ]);
    setPurchasePaidAmount(initialTotal);
    setIsPurchaseInvoiceModalOpen(true);
  };

  const handlePurchaseDivisionChange = (div: DivisionId) => {
    setPurchaseDivision(div);
    setPurchaseWarehouseId(div === 'WOOD' ? 'wh-wood-1' : 'wh-alm-1');
    const matchingSup = contacts.find((c) => c.type === 'SUPPLIER' && (c.divisionId === div || !c.divisionId));
    if (matchingSup && purchaseSupplierMode === 'EXISTING') {
      setPurchaseSupplierId(matchingSup.id);
    }
    const defaultMat = inventoryMaterials.find((m) => m.divisionId === div) || inventoryMaterials[0];
    const defCost = div === 'WOOD' ? '35000' : '48000';
    const defQty = '10';
    const defTotal = new PreciseMoney(defQty).mul(new PreciseMoney(defCost)).toDbString(2);
    setPurchaseLines([
      {
        materialCode: defaultMat?.code || (div === 'WOOD' ? 'MAT-W01' : 'MAT-A01'),
        materialNameAr: defaultMat?.nameAr || (div === 'WOOD' ? 'لوح خشب MDF سماكة 18 ملم أسباني' : 'بروفيل ألمنيوم ثيرمال بريك 6 متر'),
        unit: defaultMat?.unit || (div === 'WOOD' ? 'لوح' : 'قطعة'),
        quantity: defQty,
        unitCost: defCost,
        lineTotal: defTotal,
        notes: '',
      },
    ]);
    setPurchasePaidAmount(defTotal);
  };

  const handlePurchaseLineChange = (index: number, field: keyof PurchaseInvoiceLine, value: string) => {
    setPurchaseLines((prev) => {
      const copy = [...prev];
      const cur = { ...copy[index], [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        const q = field === 'quantity' ? value : cur.quantity;
        const c = field === 'unitCost' ? value : cur.unitCost;
        cur.lineTotal = new PreciseMoney(q || '0').mul(new PreciseMoney(c || '0')).toDbString(2);
      }
      copy[index] = cur;
      return copy;
    });
  };

  const handleAddPurchaseLine = () => {
    const defaultMat = inventoryMaterials.find((m) => m.divisionId === purchaseDivision) || inventoryMaterials[0];
    setPurchaseLines((prev) => [
      ...prev,
      {
        materialCode: defaultMat?.code || `MAT-${purchaseDivision === 'WOOD' ? 'W' : 'A'}0${prev.length + 1}`,
        materialNameAr: defaultMat?.nameAr || '',
        unit: defaultMat?.unit || 'قطعة',
        quantity: '1',
        unitCost: '0',
        lineTotal: '0',
        notes: '',
      },
    ]);
  };

  const handleRemovePurchaseLine = (index: number) => {
    if (purchaseLines.length <= 1) return;
    setPurchaseLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectCatalogMat = (index: number, matCode: string) => {
    const found = inventoryMaterials.find((m) => m.code === matCode);
    if (found) {
      setPurchaseLines((prev) => {
        const copy = [...prev];
        const line = copy[index];
        copy[index] = {
          ...line,
          materialCode: found.code,
          materialNameAr: found.nameAr,
          unit: found.unit,
          lineTotal: new PreciseMoney(line.quantity || '0').mul(new PreciseMoney(line.unitCost || '0')).toDbString(2),
        };
        return copy;
      });
    }
  };

  const handleSubmitPurchaseInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseError(null);

    if (!purchaseInvoiceNumber.trim()) {
      setPurchaseError('يرجى تحديد رقم الفاتورة');
      return;
    }

    let supplierId = purchaseSupplierId;
    let supplierName = '';
    let supplierPhone = '';
    let newCreatedContact: ContactRecord | null = null;

    if (purchaseSupplierMode === 'NEW') {
      if (!purchaseNewSupplierName.trim()) {
        setPurchaseError('يرجى إدخال اسم المورد الجديد');
        return;
      }
      const newSupId = `cont-sup-${Date.now()}`;
      const nextSupNum = contacts.filter((c) => c.type === 'SUPPLIER').length + 1;
      const newSupCode = `SUP-${String(nextSupNum).padStart(3, '0')}`;
      newCreatedContact = {
        id: newSupId,
        code: newSupCode,
        name: purchaseNewSupplierName.trim(),
        type: 'SUPPLIER',
        phone: purchaseNewSupplierPhone.trim() || 'بدون هاتف',
        address: 'المقر الرئيسي للمورد',
        divisionId: purchaseDivision,
        totalAmount: '0',
        paidAmount: '0',
        remainingAmount: '0',
        paymentHistory: [],
        notes: 'مورد معتمد مسجل عبر فاتورة المشتريات',
        pipelineStage: 'مورد معتمد',
        isActive: true,
        createdAt: purchaseDate,
      };
      supplierId = newSupId;
      supplierName = newCreatedContact.name;
      supplierPhone = newCreatedContact.phone;
    } else {
      const existing = contacts.find((c) => c.id === purchaseSupplierId);
      if (!existing) {
        setPurchaseError('يرجى اختيار المورد من القائمة أو تسجيل مورد جديد');
        return;
      }
      supplierId = existing.id;
      supplierName = existing.name;
      supplierPhone = existing.phone;
    }

    if (purchaseLines.length === 0) {
      setPurchaseError('يجب أن تحتوي الفاتورة على مادة واحدة على الأقل');
      return;
    }

    for (let i = 0; i < purchaseLines.length; i++) {
      const line = purchaseLines[i];
      if (!line.materialNameAr.trim()) {
        setPurchaseError(`يرجى كتابة اسم المادة للبند رقم ${i + 1}`);
        return;
      }
      if (Number(line.quantity) <= 0) {
        setPurchaseError(`الكمية للبند [${line.materialNameAr}] يجب أن تكون أكبر من صفر`);
        return;
      }
      if (Number(line.unitCost) < 0) {
        setPurchaseError(`سعر الوحدة للبند [${line.materialNameAr}] لا يمكن أن يكون سالباً`);
        return;
      }
    }

    const warehouseObj = INITIAL_WAREHOUSES.find((w) => w.id === purchaseWarehouseId);
    const warehouseName = warehouseObj?.nameAr || 'المستودع الرئيسي';

    const subtotalPM = purchaseLines.reduce(
      (acc, l) => acc.add(new PreciseMoney(l.quantity).mul(new PreciseMoney(l.unitCost))),
      PreciseMoney.zero()
    );
    const discountPM = new PreciseMoney(purchaseDiscount || '0');
    const grandTotalPM = subtotalPM.sub(discountPM);
    const safeGrandTotalPM = grandTotalPM.isNegative() ? PreciseMoney.zero() : grandTotalPM;
    const paidPM = new PreciseMoney(purchasePaidAmount || '0');
    const remainingPM = safeGrandTotalPM.sub(paidPM);
    const safeRemainingPM = remainingPM.isNegative() ? PreciseMoney.zero() : remainingPM;

    const invoiceId = `pur-${Date.now()}`;

    // 1. Create batches for each material line
    const createdBatches: InventoryBatch[] = [];
    const divCode = purchaseDivision === 'WOOD' ? 'WOD' : 'ALM';

    purchaseLines.forEach((l, idx) => {
      const batchSeq = batches.filter((b) => b.divisionId === purchaseDivision).length + idx + 1;
      const bNum = `BATCH-${divCode}-2026-${String(batchSeq).padStart(3, '0')}`;
      createdBatches.push({
        id: `batch-${Date.now()}-${idx}`,
        batchNumber: bNum,
        materialId: l.materialCode || `mat-${Date.now()}-${idx}`,
        materialNameAr: l.materialNameAr,
        warehouseId: purchaseWarehouseId,
        divisionId: purchaseDivision,
        purchaseInvoiceId: invoiceId,
        initialQuantity: String(l.quantity),
        remainingQuantity: String(l.quantity),
        unitCost: new PreciseMoney(l.unitCost).toDbString(2),
        receivedDate: purchaseDate,
      });
    });

    // 2. Create the Purchase Invoice
    const newInvoice: PurchaseInvoice = {
      id: invoiceId,
      invoiceNumber: purchaseInvoiceNumber.trim(),
      supplierInvoiceNumber: purchaseSupplierInvoiceNo.trim() || undefined,
      supplierId,
      supplierName,
      supplierPhone,
      divisionId: purchaseDivision,
      warehouseId: purchaseWarehouseId,
      warehouseName,
      date: purchaseDate,
      paymentMethod: purchasePaymentMethod,
      status: 'APPROVED',
      lines: purchaseLines.map((l, i) => ({
        ...l,
        id: l.id || `pline-${Date.now()}-${i}`,
        unitCost: new PreciseMoney(l.unitCost).toDbString(2),
        lineTotal: new PreciseMoney(l.quantity).mul(new PreciseMoney(l.unitCost)).toDbString(2),
      })),
      subtotal: subtotalPM.toDbString(2),
      discount: discountPM.toDbString(2),
      grandTotal: safeGrandTotalPM.toDbString(2),
      paidAmount: paidPM.toDbString(2),
      remainingAmount: safeRemainingPM.toDbString(2),
      notes: purchaseNotes.trim() || undefined,
      receivedBy: purchaseDivision === 'WOOD' ? 'أمين مستودع النجارة' : 'أمين مستودع الألمنيوم',
      createdAt: new Date().toISOString(),
    };

    // 3. Update batches in state
    setBatches((prev) => [...createdBatches, ...prev]);

    // 4. Update contacts / suppliers
    const paymentRecord: CustomerPayment | undefined = paidPM.isPositive()
      ? {
          id: `pay-${Date.now()}`,
          voucherNumber: SequenceFormatter.formatNumber('PAYMENT', new Date().getFullYear(), contacts.reduce((acc, curr) => acc + (curr.paymentHistory ? curr.paymentHistory.length : 0), 0) + 1),
          contactId: supplierId,
          contactName: supplierName,
          amount: paidPM.toDbString(2),
          date: purchaseDate,
          paymentMethod: purchasePaymentMethod === 'CREDIT' ? 'CASH' : purchasePaymentMethod,
          remainingAfter: safeRemainingPM.toDbString(2),
          notes: `سداد دفعة شراء بموجب فاتورة المشتريات [${purchaseInvoiceNumber}]`,
          receivedBy: 'أمين الصندوق',
          createdAt: new Date().toISOString(),
        }
      : undefined;

    setContacts((prev) => {
      if (purchaseSupplierMode === 'NEW' && newCreatedContact) {
        const fullNewSup: ContactRecord = {
          ...newCreatedContact,
          totalAmount: safeGrandTotalPM.toDbString(2),
          paidAmount: paidPM.toDbString(2),
          remainingAmount: safeRemainingPM.toDbString(2),
          paymentHistory: paymentRecord ? [paymentRecord] : [],
        };
        return [fullNewSup, ...prev];
      } else {
        return prev.map((c) => {
          if (c.id === supplierId) {
            const newTot = new PreciseMoney(c.totalAmount).add(safeGrandTotalPM).toDbString(2);
            const newPaid = new PreciseMoney(c.paidAmount).add(paidPM).toDbString(2);
            const newRem = new PreciseMoney(c.remainingAmount).add(safeRemainingPM).toDbString(2);
            return {
              ...c,
              totalAmount: newTot,
              paidAmount: newPaid,
              remainingAmount: newRem,
              paymentHistory: paymentRecord ? [paymentRecord, ...(c.paymentHistory || [])] : c.paymentHistory,
            };
          }
          return c;
        });
      }
    });

    // 5. Update purchase invoices
    setPurchaseInvoices((prev) => [newInvoice, ...prev]);

    // 6. Close modal & show feedback
    setIsPurchaseInvoiceModalOpen(false);
    setInventoryFeedback(
      `تم بنجاح حفظ واعتماد فاتورة المشتريات [${purchaseInvoiceNumber}]، وتوليد ${createdBatches.length} وجبات مخزنية جديدة في [${warehouseName}] وتحديث ذمة المورد [${supplierName}].`
    );
  };

  const handleViewPurchaseInvoice = (inv: PurchaseInvoice) => {
    setSelectedPurchaseInvoice(inv);
    setIsViewInvoiceModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // GENERAL EXPENSES LOGIC & FINANCIAL CALCULATIONS
  // ---------------------------------------------------------------------------
  const filteredExpenses = expenses.filter((exp) => {
    // Division filter:
    // When 'WOOD': show WOOD + SHARED
    // When 'ALUMINUM': show ALUMINUM + SHARED
    // When 'ALL': show all
    const matchesDiv =
      expenseDivisionFilter === 'ALL'
        ? true
        : exp.divisionId === expenseDivisionFilter || exp.divisionId === 'SHARED';

    // Category filter:
    const matchesCat = expenseCategoryFilter === 'ALL' || exp.category === expenseCategoryFilter;

    // Date range filter:
    const matchesFrom = !expenseFromDate || exp.date >= expenseFromDate;
    const matchesTo = !expenseToDate || exp.date <= expenseToDate;

    // Search query:
    const term = expenseSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      exp.voucherNumber.toLowerCase().includes(term) ||
      exp.beneficiary.toLowerCase().includes(term) ||
      exp.notes.toLowerCase().includes(term) ||
      (exp.referenceInvoiceNo && exp.referenceInvoiceNo.toLowerCase().includes(term)) ||
      exp.categoryLabelAr.toLowerCase().includes(term);

    return matchesDiv && matchesCat && matchesFrom && matchesTo && matchesSearch;
  });

  // Calculate KPIs for General Expenses
  const totalElectricityExp = filteredExpenses
    .filter((e) => e.category === 'ELECTRICITY')
    .reduce((acc, e) => acc.add(new PreciseMoney(e.amount)), PreciseMoney.zero());

  const totalInternetExp = filteredExpenses
    .filter((e) => e.category === 'INTERNET')
    .reduce((acc, e) => acc.add(new PreciseMoney(e.amount)), PreciseMoney.zero());

  const totalRentExp = filteredExpenses
    .filter((e) => e.category === 'RENT')
    .reduce((acc, e) => acc.add(new PreciseMoney(e.amount)), PreciseMoney.zero());

  const totalMaintenanceExp = filteredExpenses
    .filter((e) => e.category === 'MAINTENANCE')
    .reduce((acc, e) => acc.add(new PreciseMoney(e.amount)), PreciseMoney.zero());

  const totalSalariesExp = filteredExpenses
    .filter((e) => e.category === 'SALARIES')
    .reduce((acc, e) => acc.add(new PreciseMoney(e.amount)), PreciseMoney.zero());

  const grandTotalGeneralExpenses = filteredExpenses.reduce(
    (acc, e) => acc.add(new PreciseMoney(e.amount)),
    PreciseMoney.zero()
  );

  const getCategoryLabelAr = (cat: ExpenseCategory): string => {
    switch (cat) {
      case 'ELECTRICITY':
        return 'فواتير الكهرباء والمولدات';
      case 'INTERNET':
        return 'الإنترنت والاتصالات';
      case 'RENT':
        return 'إيجار المعمل والورش';
      case 'MAINTENANCE':
        return 'الصيانة والتشغيل وقطع الغيار';
      case 'SALARIES':
        return 'رواتب الموظفين والعمال';
      case 'HOSPITALITY':
        return 'الضيافة والنثريات المكتبية';
      case 'FUEL_TRANSPORT':
        return 'الوقود والمحروقات والنقل';
      case 'OTHER':
        return 'مصروفات عامة أخرى';
    }
  };

  const handleOpenNewExpense = () => {
    const nextSeq = expenses.length + 1;
    const generatedVoucher = SequenceFormatter.formatNumber('EXPENSE', new Date().getFullYear(), nextSeq);
    setNewExpenseVoucherNo(generatedVoucher);
    setNewExpenseDate(new Date().toISOString().split('T')[0]);
    setNewExpenseCategory('ELECTRICITY');
    setNewExpenseDivision(expenseDivisionFilter === 'ALL' ? 'WOOD' : expenseDivisionFilter);
    setNewExpenseAmount('');
    setNewExpensePaymentMethod('CASH');
    setNewExpenseBeneficiary('');
    setNewExpenseRefInvoiceNo('');
    setNewExpenseNotes('');
    setNewExpenseError(null);
    setIsNewExpenseModalOpen(true);
  };

  const handleSubmitNewExpense = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newExpenseVoucherNo.trim()) {
      setNewExpenseError('يرجى تحديد رقم سند الصرف');
      return;
    }
    const amtPM = new PreciseMoney(newExpenseAmount || '0');
    if (!amtPM.isPositive()) {
      setNewExpenseError('يرجى إدخال مبلغ صرف صحيح وأكبر من الصفر');
      return;
    }
    if (!newExpenseBeneficiary.trim()) {
      setNewExpenseError('يرجى تحديد اسم المستلم أو الجهة المصروف لها');
      return;
    }

    const createdExpense: GeneralExpense = {
      id: `exp-${Date.now()}`,
      voucherNumber: newExpenseVoucherNo.trim(),
      date: newExpenseDate,
      category: newExpenseCategory,
      categoryLabelAr: getCategoryLabelAr(newExpenseCategory),
      divisionId: newExpenseDivision,
      amount: amtPM.toDbString(2),
      paymentMethod: newExpensePaymentMethod,
      beneficiary: newExpenseBeneficiary.trim(),
      referenceInvoiceNo: newExpenseRefInvoiceNo.trim() || undefined,
      notes:
        newExpenseNotes.trim() ||
        `صرف ${getCategoryLabelAr(newExpenseCategory)} إلى ${newExpenseBeneficiary.trim()}`,
      approvedBy: 'المدير العام',
      paidBy: newExpensePaymentMethod === 'CASH' ? 'أمين الصندوق' : 'محاسب البنك',
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [createdExpense, ...prev]);
    setIsNewExpenseModalOpen(false);
    setExpenseFeedback(
      `تم بنجاح حفظ واعتماد سند الصرف رقم [${createdExpense.voucherNumber}] بمبلغ [${amtPM.formatIQD()}].`
    );
  };

  const handlePrintExpenseVoucher = (exp: GeneralExpense) => {
    setSelectedExpenseForPrint(exp);
    setIsPrintExpenseModalOpen(true);
  };

  // Filtered Contacts Logic
  const filteredContacts = contacts.filter((c) => {
    let matchesDiv = true;
    if (contactDivisionFilter === 'WOOD') {
      matchesDiv = c.divisionId === 'WOOD';
    } else if (contactDivisionFilter === 'ALUMINUM') {
      matchesDiv = c.divisionId === 'ALUMINUM';
    } else if (contactDivisionFilter === 'SHARED') {
      matchesDiv = !c.divisionId;
    } else {
      matchesDiv = activeDivision === 'ALL' || c.divisionId === activeDivision || !c.divisionId;
    }

    let matchesType = true;
    if (contactTypeFilter === 'CUSTOMER') matchesType = c.type === 'CUSTOMER';
    else if (contactTypeFilter === 'SUPPLIER') matchesType = c.type === 'SUPPLIER';
    else if (contactTypeFilter === 'OUTSTANDING') matchesType = new PreciseMoney(c.remainingAmount).isPositive();

    const q = contactSearchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.address && c.address.toLowerCase().includes(q));

    return matchesDiv && matchesType && matchesSearch;
  });

  // Calculate Contact Summary Totals & Counters by Division
  const baseContactsByDiv = contacts.filter((c) => {
    if (contactDivisionFilter === 'WOOD') return c.divisionId === 'WOOD';
    if (contactDivisionFilter === 'ALUMINUM') return c.divisionId === 'ALUMINUM';
    if (contactDivisionFilter === 'SHARED') return !c.divisionId;
    return activeDivision === 'ALL' || c.divisionId === activeDivision || !c.divisionId;
  });

  const totalWoodContactsCount = contacts.filter((c) => c.divisionId === 'WOOD').length;
  const totalAlumContactsCount = contacts.filter((c) => c.divisionId === 'ALUMINUM').length;
  const totalSharedContactsCount = contacts.filter((c) => !c.divisionId).length;

  const totalCustomersCount = baseContactsByDiv.filter((c) => c.type === 'CUSTOMER').length;
  const totalSuppliersCount = baseContactsByDiv.filter((c) => c.type === 'SUPPLIER').length;
  const outstandingContactsCount = baseContactsByDiv.filter((c) => new PreciseMoney(c.remainingAmount).isPositive()).length;

  const totalTransactions = filteredContacts.reduce((acc, c) => acc.add(new PreciseMoney(c.totalAmount)), PreciseMoney.zero());
  const totalPaid = filteredContacts.reduce((acc, c) => acc.add(new PreciseMoney(c.paidAmount)), PreciseMoney.zero());
  const totalRemaining = filteredContacts.reduce((acc, c) => acc.add(new PreciseMoney(c.remainingAmount)), PreciseMoney.zero());

  // Handle Add Contact
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert('يرجى إدخال اسم العميل/المورد ورقم الهاتف على الأقل.');
      return;
    }

    const totalMoney = new PreciseMoney(newContactTotal || 0);
    const paidMoney = new PreciseMoney(newContactPaid || 0);
    const remainingMoney = totalMoney.sub(paidMoney);

    const generatedCode = newContactCode.trim() || (newContactType === 'CUSTOMER' ? `CUST-${String(contacts.filter(c => c.type === 'CUSTOMER').length + 1).padStart(3, '0')}` : `SUP-${String(contacts.filter(c => c.type === 'SUPPLIER').length + 1).padStart(3, '0')}`);

    const newContact: ContactRecord = {
      id: crypto.randomUUID(),
      code: generatedCode,
      name: newContactName.trim(),
      type: newContactType,
      phone: newContactPhone.trim(),
      address: newContactAddress.trim(),
      divisionId: newContactDivision === 'SHARED' ? null : newContactDivision,
      totalAmount: totalMoney.toDbString(2),
      paidAmount: paidMoney.toDbString(2),
      remainingAmount: remainingMoney.toDbString(2),
      notes: newContactNotes.trim(),
      email: newContactEmail.trim(),
      pipelineStage: newContactType === 'CUSTOMER' ? 'عميل جديد معتمد' : 'مورد معتمد',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setContacts([newContact, ...contacts]);
    setContactFeedback(`تم إضافة ${newContactType === 'CUSTOMER' ? 'الزبون' : 'المورد'} [${newContact.name}] بنجاح بالكود [${newContact.code}].`);
    setIsAddContactModalOpen(false);

    // Reset Form
    setNewContactName('');
    setNewContactCode('');
    setNewContactPhone('');
    setNewContactAddress('');
    setNewContactTotal('');
    setNewContactPaid('');
    setNewContactEmail('');
    setNewContactNotes('');
  };

  // Handle Record Payment/Receipt
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    const cleanAmt = cleanNumeric(paymentAmount);
    const pAmt = new PreciseMoney(cleanAmt || 0);
    if (pAmt.isNegative() || pAmt.isZero()) {
      alert('يرجى إدخال مبلغ صحيح أكبر من الصفر.');
      return;
    }

    const oldRemaining = new PreciseMoney(selectedContact.remainingAmount);
    const oldPaid = new PreciseMoney(selectedContact.paidAmount);
    const newRemaining = oldRemaining.sub(pAmt);
    const newPaid = oldPaid.add(pAmt);
    const isOverpaid = pAmt.greaterThan(oldRemaining) && oldRemaining.greaterThan(0);
    const excessSurplus = isOverpaid ? pAmt.sub(oldRemaining) : PreciseMoney.zero();

    const totalExistingPayments = contacts.reduce(
      (acc, curr) => acc + (curr.paymentHistory ? curr.paymentHistory.length : 0),
      0
    );
    const newSeq = totalExistingPayments + 1;
    const currentYear = new Date().getFullYear();
    const voucherNumber = SequenceFormatter.formatNumber('PAYMENT', currentYear, newSeq);

    const defaultNotes = selectedContact.type === 'CUSTOMER'
      ? (isOverpaid ? `دفعة قبض مسددة (مع فائض دفعة مقدمة قدره ${excessSurplus.formatIQD()})` : 'دفعة من حساب الأعمال والتعاقد')
      : (isOverpaid ? `سداد من حساب المشتريات والتوريدات (مع زيادة قدرها ${excessSurplus.formatIQD()})` : 'سداد من حساب المشتريات والتوريدات');

    const newPayment: CustomerPayment = {
      id: `pay-${Date.now()}`,
      voucherNumber,
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      amount: pAmt.toDbString(2),
      date: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      remainingAfter: newRemaining.isNegative() ? '0.00' : newRemaining.toDbString(2),
      notes: paymentNote ? paymentNote + (isOverpaid ? ` | (فائض زائد: ${excessSurplus.formatIQD()})` : '') : defaultNotes,
      receivedBy: 'أحمد الخشاب (المدير المالي)',
      projectName: selectedContact.notes || '',
      createdAt: new Date().toISOString(),
    };

    let updatedContactRecord: ContactRecord | null = null;
    const updated = contacts.map(c => {
      if (c.id === selectedContact.id) {
        const nextHist = [newPayment, ...(c.paymentHistory || [])];
        const record = {
          ...c,
          paidAmount: newPaid.toDbString(2),
          remainingAmount: newRemaining.isNegative() ? '0.00' : newRemaining.toDbString(2),
          paymentHistory: nextHist,
        };
        updatedContactRecord = record;
        return record;
      }
      return c;
    });

    setContacts(updated);
    setContactFeedback(
      `تم تسجيل وحفظ ${selectedContact.type === 'CUSTOMER' ? 'سند قبض وتحصيل' : 'سند دفع وسداد'} [${voucherNumber}] بمبلغ ${pAmt.formatIQD()} للجهة [${selectedContact.name}] بنجاح${isOverpaid ? ` (مع قيد فائض قدره ${excessSurplus.formatIQD()} كرصيد دائن لصالح العميل)` : ''}.`
    );
    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    setPaymentNote('');

    // Automatically expand the contact row so user sees it in their history
    setExpandedContactIds(prev => (prev.includes(selectedContact.id) ? prev : [...prev, selectedContact.id]));

    // If customer, open the official receipt voucher modal with full installments table and printing
    if (selectedContact.type === 'CUSTOMER' && updatedContactRecord) {
      setActiveReceiptPayment(newPayment);
      setActiveReceiptContact(updatedContactRecord);
      setIsReceiptVoucherModalOpen(true);
    }
  };

  // Handle Export CSV
  const handleExportContactsCSV = () => {
    const headers = ['التسلسل', 'النوع', 'الكود', 'الاسم', 'رقم الهاتف', 'العنوان', 'القسم', 'المبلغ الكلي', 'المبلغ المدفوع', 'الرصيد المتبقي', 'الحالة'];
    const rows = filteredContacts.map((c, idx) => [
      idx + 1,
      c.type === 'CUSTOMER' ? 'زبون' : 'مورد',
      c.code,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      c.divisionId === 'WOOD' ? 'نجارة' : c.divisionId === 'ALUMINUM' ? 'ألمنيوم' : 'مشترك',
      c.totalAmount,
      c.paidAmount,
      c.remainingAmount,
      c.pipelineStage || 'نشط'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `كشف_العملاء_والموردين_شركة_نوك_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setContactFeedback('تم تصدير ملف الكشف بصيغة Excel CSV بنجاح.');
  };

  // Handle Export Statement CSV (كشف حساب عميل أو مورد)
  const handleExportStatementCSV = () => {
    if (!selectedContact) return;
    const headers = ['التسلسل', 'رقم السند', 'تاريخ الدفعة', 'طريقة الدفع', 'المبلغ المدفوع (د.ع)', 'الرصيد المتبقي بعد الدفعة (د.ع)', 'المستلم والمحاسب', 'المشروع المرتبط', 'البيان والملاحظات'];
    const rows = (selectedContact.paymentHistory || []).map((p, idx) => [
      idx + 1,
      p.voucherNumber,
      p.date,
      p.paymentMethod === 'CASH' ? 'نقداً (صندوق)' : p.paymentMethod === 'BANK' ? 'حوالة مصرفية' : 'شيك',
      p.amount,
      p.remainingAfter,
      p.receivedBy || 'المحاسب المعتمد',
      p.projectName || 'عام',
      p.notes || ''
    ]);
    exportToCsv(`كشف_حساب_${selectedContact.name}`, headers, rows);
  };

  // Handle Export Projects Registry CSV
  const handleExportProjectsCSV = () => {
    const headers = ['التسلسل', 'رقم المشروع', 'اسم المشروع', 'العميل', 'القسم', 'المسؤول التنفيذي', 'المرحلة الحالية', 'الحالة', 'قيمة العقد (د.ع)', 'المبلغ المحصل (د.ع)', 'كلفة المواد المباشرة (د.ع)', 'تاريخ البدء', 'تاريخ التسليم المتوقع'];
    const rows = filteredProjects.map((p, idx) => [
      idx + 1,
      p.projectNumber,
      p.name,
      p.customerName || p.customerId,
      p.divisionId === 'WOOD' ? 'نجارة وديكور' : 'ألمنيوم وواجهات',
      p.managerName || 'غير محدد',
      p.currentStage,
      p.status === 'COMPLETED' ? 'مكتمل' : p.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : p.status === 'ON_HOLD' ? 'معلق' : 'مفتوح',
      p.contractAmount,
      p.collectedAmount,
      p.actualMaterialCost,
      p.startDate,
      p.expectedEndDate || 'غير محدد'
    ]);
    exportToCsv('كشف_سجل_مشاريع_شركة_نوك', headers, rows);
    setProjectFeedback('تم تصدير سجل المشاريع كشف Excel بنجاح.');
    setTimeout(() => setProjectFeedback(null), 4000);
  };

  // Handle Export Inventory Batches CSV
  const handleExportInventoryCSV = () => {
    const headers = ['التسلسل', 'رقم الوجبة', 'اسم المادة المخزنية', 'القسم', 'المستودع', 'الكمية الأولية', 'الرصيد المتبقي', 'سعر كلفة الوحدة (د.ع)', 'القيمة الإجمالية للرصيد (د.ع)', 'تاريخ الاستلام'];
    const rows = filteredBatches.map((b, idx) => [
      idx + 1,
      b.batchNumber,
      b.materialNameAr || b.materialId,
      b.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم',
      b.warehouseId,
      b.initialQuantity,
      b.remainingQuantity,
      b.unitCost,
      (Number(b.remainingQuantity) * Number(b.unitCost)).toFixed(2),
      b.receivedDate
    ]);
    exportToCsv('كشف_وجبات_ومستودعات_المواد_شركة_نوك', headers, rows);
    setInventoryFeedback('تم تصدير كشف وجبات المستودعات بصيغة Excel بنجاح.');
    setTimeout(() => setInventoryFeedback(null), 4000);
  };

  // Handle Export Expenses CSV
  const handleExportExpensesCSV = () => {
    const headers = ['التسلسل', 'رقم السند', 'التاريخ', 'التصنيف', 'القسم', 'المبلغ (د.ع)', 'طريقة الصرف', 'المستلم والجهة المصروف لها', 'البيان'];
    const rows = filteredExpenses.map((exp, idx) => [
      idx + 1,
      exp.voucherNumber,
      exp.date,
      exp.categoryLabelAr,
      exp.divisionId === 'WOOD' ? 'نجارة' : exp.divisionId === 'ALUMINUM' ? 'ألمنيوم' : 'مشترك عام',
      exp.amount,
      exp.paymentMethod === 'CASH' ? 'نقداً' : exp.paymentMethod === 'BANK' ? 'مصرفي' : 'شيك',
      exp.beneficiary,
      exp.notes
    ]);
    exportToCsv('كشف_المصروفات_العامة_شركة_نوك', headers, rows);
    setExpenseFeedback('تم تصدير سجل المصروفات العامة كشف Excel بنجاح.');
    setTimeout(() => setExpenseFeedback(null), 4000);
  };

  // Handle Export Showroom Assets CSV
  const handleExportAssetsCSV = () => {
    const headers = ['التسلسل', 'كود القطعة', 'اسم القطعة المعروضة', 'التصنيف', 'القسم', 'الحالة', 'كلفة التصنيع (د.ع)', 'سعر العرض المقترح (د.ع)', 'تاريخ العرض'];
    const rows = filteredShowroomItems.map((item, idx) => [
      idx + 1,
      item.itemCode,
      item.nameAr,
      item.category,
      item.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم',
      item.status === 'IN_SHOWROOM' ? 'متوفرة بالمعرض' : 'مباعة',
      item.productionCost,
      item.proposedSalePrice,
      item.displayDate
    ]);
    exportToCsv('كشف_مستودع_المعرض_شركة_نوك', headers, rows);
    setAssetFeedback('تم تصدير كشف مستودع المعرض كشف Excel بنجاح.');
    setTimeout(() => setAssetFeedback(null), 4000);
  };

  // Handle Export HR Employees CSV
  const handleExportHrCSV = () => {
    const headers = ['التسلسل', 'الكود', 'الاسم الكامل', 'القسم', 'المسمى الوظيفي', 'الراتب الشهري (د.ع)', 'رقم الهاتف'];
    const rows = filteredEmployees.map((emp, idx) => [
      idx + 1,
      emp.code,
      emp.fullName,
      emp.divisionId === 'WOOD' ? 'نجارة' : emp.divisionId === 'ALUMINUM' ? 'ألمنيوم' : 'إدارة مشتركة',
      emp.jobTitle,
      emp.monthlySalary,
      emp.phone
    ]);
    exportToCsv('سجل_الموظفين_والموارد_البشرية_شركة_نوك', headers, rows);
    setHrFeedback('تم تصدير سجل الموظفين كشف Excel بنجاح.');
    setTimeout(() => setHrFeedback(null), 4000);
  };

  // Handle Export Partners CSV
  const handleExportPartnersCSV = () => {
    const headers = ['التسلسل', 'اسم الشريك', 'القسم', 'رأس المال الحالي (د.ع)', 'نسبة الأرباح (%)', 'إجمالي المسحوبات (د.ع)', 'الحالة'];
    const rows = partners.map((p, idx) => [
      idx + 1,
      p.name,
      p.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم',
      p.currentCapital,
      `${p.profitPercentage}%`,
      p.totalWithdrawals,
      p.isActive ? 'نشط' : 'متوقف'
    ]);
    exportToCsv('كشف_الشركاء_وتوزيع_الأرباح_شركة_نوك', headers, rows);
  };

  // Handle Copy Phone
  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  // Handle Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setNewProjectError(null);

    if (!newProjectName.trim()) {
      setNewProjectError('يرجى كتابة اسم المشروع أو وصف الطلبية.');
      return;
    }

    let customerId = newProjectCustomerId;
    let customerName = '';

    if (newProjectCustomerMode === 'EXISTING') {
      const found = contacts.find((c) => c.id === newProjectCustomerId);
      if (!found) {
        setNewProjectError('يرجى اختيار العميل من القائمة أو اختيار إدخال عميل جديد.');
        return;
      }
      customerName = found.name;
    } else {
      if (!newProjectCustomerName.trim()) {
        setNewProjectError('يرجى إدخال اسم العميل الجديد.');
        return;
      }
      customerName = newProjectCustomerName.trim();
      customerId = `cust-${Date.now()}`;

      // Automatically register new customer in contacts directory
      const newContact: ContactRecord = {
        id: customerId,
        code: `CUST-${String(contacts.filter((c) => c.type === 'CUSTOMER').length + 1).padStart(3, '0')}`,
        name: customerName,
        type: 'CUSTOMER',
        phone: newProjectCustomerPhone.trim() || '07700000000',
        address: '',
        divisionId: newProjectDivision,
        totalAmount: newProjectContractAmount || '0.00',
        paidAmount: newProjectCollectedAmount || '0.00',
        remainingAmount: new PreciseMoney(newProjectContractAmount || 0)
          .sub(new PreciseMoney(newProjectCollectedAmount || 0))
          .toDbString(2),
        pipelineStage: 'عميل مشروع معتمد',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setContacts((prev) => [newContact, ...prev]);
    }

    const contractAmt = parseFloat(newProjectContractAmount);
    if (isNaN(contractAmt) || contractAmt <= 0) {
      setNewProjectError('يرجى إدخال قيمة تعاقد صحيحة أكبر من الصفر.');
      return;
    }

    const collectedAmt = parseFloat(newProjectCollectedAmount) || 0;
    const nextSeq = projects.length + 1;
    const currentYear = new Date().getFullYear();
    const projectNumber = SequenceFormatter.formatNumber('PROJECT', currentYear, nextSeq);

    const createdProject: Project = {
      id: `proj-${Date.now()}`,
      projectNumber,
      name: newProjectName.trim(),
      customerId,
      customerName,
      divisionId: newProjectDivision,
      managerName: newProjectManager.trim() || (newProjectDivision === 'WOOD' ? 'م. أحمد الخشاب' : 'م. بلال الحديثي'),
      startDate: newProjectStartDate || new Date().toISOString().split('T')[0],
      expectedEndDate: newProjectExpectedEndDate || undefined,
      currentStage: newProjectCurrentStage,
      status: newProjectStatus,
      contractAmount: contractAmt.toFixed(2),
      invoicedAmount: contractAmt.toFixed(2),
      collectedAmount: collectedAmt.toFixed(2),
      actualMaterialCost: '0.00', // Actual batch cost strictly starts at 0 per Section 14
      notes: newProjectNotes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) => [createdProject, ...prev]);
    setIsAddProjectModalOpen(false);
    setProjectFeedback(`تم بنجاح إضافة المشروع [${createdProject.name}] برقم [${projectNumber}] لقسم ${createdProject.divisionId === 'WOOD' ? 'النجارة والديكور' : 'الألمنيوم والواجهات'}.`);
    setTimeout(() => setProjectFeedback(null), 6000);

    // Reset Form
    setNewProjectName('');
    setNewProjectCustomerId('');
    setNewProjectCustomerName('');
    setNewProjectCustomerPhone('');
    setNewProjectContractAmount('');
    setNewProjectCollectedAmount('0');
    setNewProjectNotes('');
    setNewProjectError(null);
  };

  // Toggle Project Status (e.g. mark completed / in-progress)
  const handleToggleProjectStatus = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isDone = p.status === 'COMPLETED';
          const newStatus = isDone ? 'IN_PROGRESS' : 'COMPLETED';
          const newStage = isDone ? 'تصنيع في الورشة' : 'تسليم نهائي وضمان';
          return { ...p, status: newStatus, currentStage: newStage };
        }
        return p;
      })
    );
  };

  // View Contract for Project (Find existing contract or synthesize official legal contract)
  const handleViewProjectContract = (p: Project) => {
    // 1. Check if contract exists in contracts state
    const existing = contracts.find(
      (c) => c.id === p.contractId || c.projectId === p.id || (p.contractId && c.contractNumber === p.contractId)
    );

    if (existing) {
      setActiveContract(existing);
      setIsContractModalOpen(true);
      return;
    }

    // 2. Synthesize official contract from project data
    const customerContact = contacts.find((c) => c.id === p.customerId || c.name === p.customerName);
    const syntheticContract: Contract = {
      id: p.contractId || `cnt-${p.id}`,
      contractNumber: p.projectNumber,
      subject: `عقد تنفيذ وتصنيع ${p.divisionId === 'WOOD' ? 'أعمال النجارة والديكور الخشبي' : 'واجهات وشبابيك الألمنيوم'} (${p.name})`,
      customerId: p.customerId,
      customerName: p.customerName || customerContact?.name || 'العميل المعتمد',
      customerPhone: customerContact?.phone || '0770XXXXXXX',
      customerAddress: customerContact?.address || 'العراق',
      divisionId: p.divisionId,
      quotationId: undefined,
      quotationNumber: p.projectNumber,
      projectId: p.id,
      projectNumber: p.projectNumber,
      date: p.startDate || p.createdAt || '2026-02-01',
      deliveryDate: p.expectedEndDate || '2026-05-30',
      totalAmount: p.contractAmount,
      advanceAmount: p.collectedAmount || '0.00',
      status: p.status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
      installments: [
        {
          installmentNumber: 1,
          description: 'الدفعة الأولى المقدمة عند توقيع العقد وبدء التنفيذ بالورشة',
          dueDate: p.startDate || '2026-02-01',
          amount: Number(p.collectedAmount) > 0 ? p.collectedAmount : (Number(p.contractAmount) * 0.5).toFixed(2),
          isPaid: Number(p.collectedAmount) > 0,
          paidDate: Number(p.collectedAmount) > 0 ? p.startDate : undefined,
        },
        {
          installmentNumber: 2,
          description: 'الدفعة الثانية أثناء مرحلة التصنيع وتوريد المواد للورشة',
          dueDate: '2026-04-10',
          amount: Math.max(0, (Number(p.contractAmount) - (Number(p.collectedAmount) || 0)) * 0.65).toFixed(2),
          isPaid: false,
        },
        {
          installmentNumber: 3,
          description: 'الدفعة الثالثة والنهائية عند الاستلام والتركيب والفحص الفني بالموقع',
          dueDate: p.expectedEndDate || '2026-05-30',
          amount: Math.max(0, (Number(p.contractAmount) - (Number(p.collectedAmount) || 0)) * 0.35).toFixed(2),
          isPaid: false,
        },
      ],
      scopeOfWork: p.notes || `تصنيع وتوريد وتركيب بنود مشروع ${p.name} طبقاً للمواصفات الفنية المعتمدة وجودة الصناعة والتنفيذ.`,
      warrantyTerms:
        p.divisionId === 'WOOD'
          ? 'تتعهد شركة نوك بضمان أعمال النجارة والديكور الداخلي لمدة 12 شهراً ميلادياً ضد عيوب التصنيع والمواد.'
          : 'تتعهد شركة نوك بضمان مقاطع الألمنيوم والعزل الحراري والمائي للواجهات لمدة 24 شهراً ميلادياً.',
      penaltyClause: 'يلتزم الطرف الأول بغرامة تأخير قدرها 50,000 د.ع عن كل يوم تأخير غير مبرر بظروف قاهرة.',
      notes: `مشروع معتمد مسجل برقم ${p.projectNumber}. المسؤول المباشر: ${p.managerName}.`,
      approvedBy: p.managerName || 'المدير العام',
      signedByCustomer: p.customerName || 'الممثل المفوض للعميل',
      signedDate: p.startDate || '2026-02-01',
      createdAt: p.createdAt || '2026-02-01',
    };

    setActiveContract(syntheticContract);
    setIsContractModalOpen(true);
  };

  // View Payment History for Project
  const handleViewProjectPayments = (p: Project) => {
    setActiveProjectForPayments(p);
    setIsProjectPaymentsModalOpen(true);
  };

  // Open editor for new quotation
  const handleOpenNewQuotation = () => {
    setEditingQuoId(null);
    const nextSeq = quotations.length + 1;
    const currentYear = new Date().getFullYear();
    setEditQuoNumber(SequenceFormatter.formatNumber('QUOTATION', currentYear, nextSeq));
    setEditQuoSubject('');
    setEditQuoCustomerMode('EXISTING');
    const firstCust = contacts.find((c) => c.type === 'CUSTOMER');
    setEditQuoCustomerId(firstCust ? firstCust.id : '');
    setEditQuoCustomerName(firstCust ? firstCust.name : '');
    setEditQuoCustomerPhone(firstCust ? firstCust.phone : '');
    setEditQuoCustomerAddress(firstCust ? firstCust.address || '' : '');
    setEditQuoDivision(activeDivision === 'ALUMINUM' ? 'ALUMINUM' : 'WOOD');
    setEditQuoDate(new Date().toISOString().split('T')[0]);
    setEditQuoValidDays('15');
    setEditQuoStatus('APPROVED');
    setEditQuoLines([
      {
        id: `line-${Date.now()}-1`,
        description: 'بند عمل رئيسي وفق المخططات والمواصفات الفنية المعتمدة',
        quantity: '1',
        unit: 'قطعة',
        unitPrice: '1500000.00',
        discount: '0.00',
        tax: '0.00',
        lineTotal: '1500000.00',
      },
    ]);
    setEditQuoImages([]);
    setEditQuoDiscount('0');
    setEditQuoPaymentTerms('50% دفعة مقدمة عند توقيع العقد، 40% عند اكتمال التصنيع بالورشة، 10% بعد التسليم النهائي والتركيب.');
    setEditQuoNotes('الأسعار شاملة التوصيل والتركيب الداخلي مع ضمان صيانة لمدة 12 شهراً ضد عيوب التصنيع.');
    setEditQuoShowItemized(true);
    setEditQuoError(null);
    setIsQuotationEditorOpen(true);
  };

  // Open editor for existing quotation
  const handleOpenEditQuotation = (q: Quotation) => {
    setEditingQuoId(q.id);
    setEditQuoNumber(q.quotationNumber);
    setEditQuoSubject(q.subject || '');
    setEditQuoCustomerMode('EXISTING');
    setEditQuoCustomerId(q.customerId);
    setEditQuoCustomerName(q.customerName || '');
    setEditQuoCustomerPhone(q.customerPhone || '');
    setEditQuoCustomerAddress(q.customerAddress || '');
    setEditQuoDivision(q.divisionId);
    setEditQuoDate(q.date);
    setEditQuoValidDays('15');
    setEditQuoStatus(q.status);
    setEditQuoLines(
      q.lines.length > 0
        ? JSON.parse(JSON.stringify(q.lines))
        : [
            {
              id: `line-${Date.now()}-1`,
              description: 'بند عمل رئيسي',
              quantity: '1',
              unit: 'قطعة',
              unitPrice: '1000000.00',
              discount: '0.00',
              tax: '0.00',
              lineTotal: '1000000.00',
            },
          ]
    );
    setEditQuoImages(q.images ? JSON.parse(JSON.stringify(q.images)) : []);
    setEditQuoDiscount(q.discountTotal || '0');
    setEditQuoPaymentTerms(q.paymentTerms || '');
    setEditQuoNotes(q.notes || '');
    setEditQuoShowItemized(q.printShowItemized);
    setEditQuoError(null);
    setIsQuotationEditorOpen(true);
  };

  // Add line to editor
  const handleAddQuotationLine = () => {
    setEditQuoLines([
      ...editQuoLines,
      {
        id: `line-${Date.now()}-${editQuoLines.length + 1}`,
        description: '',
        quantity: '1',
        unit: editQuoDivision === 'WOOD' ? 'قطعة' : 'متر مربع',
        unitPrice: '0.00',
        discount: '0.00',
        tax: '0.00',
        lineTotal: '0.00',
      },
    ]);
  };

  // Update line in editor
  const handleUpdateQuotationLine = (index: number, field: keyof QuotationLine, value: string) => {
    const updated = [...editQuoLines];
    const val = field === 'unitPrice' ? formatInputNumber(value) : value;
    updated[index] = { ...updated[index], [field]: val };

    // Auto recalculate lineTotal if quantity or unitPrice changed
    if (field === 'quantity' || field === 'unitPrice') {
      const q = parseFloat(field === 'quantity' ? value : updated[index].quantity) || 0;
      const rawPrice = field === 'unitPrice' ? cleanNumeric(val) : cleanNumeric(updated[index].unitPrice);
      const p = parseFloat(rawPrice) || 0;
      updated[index].lineTotal = (q * p).toFixed(2);
    }

    setEditQuoLines(updated);
  };

  // Remove line from editor
  const handleRemoveQuotationLine = (index: number) => {
    if (editQuoLines.length <= 1) {
      alert('يجب أن يحتوي عرض السعر على بند واحد على الأقل.');
      return;
    }
    setEditQuoLines(editQuoLines.filter((_, idx) => idx !== index));
  };

  // Upload Decor Photos & Blueprints (Base64 DataURL)
  const handleUploadQuotationImages = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'DECOR' | 'BLUEPRINT') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          const newImg: QuotationImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: base64Url,
            type: imageType,
            notes: imageType === 'DECOR' ? 'تصميم ديكور / منظور ثلاثي الأبعاد' : 'مخطط كروكي / مساقط معمارية',
            uploadedAt: new Date().toISOString().split('T')[0],
          };
          setEditQuoImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove uploaded image
  const handleRemoveQuotationImage = (imgId: string) => {
    setEditQuoImages(editQuoImages.filter((img) => img.id !== imgId));
  };

  // Save Quotation
  const handleSaveQuotation = (targetStatus: DocumentStatus | 'ACCEPTED' | 'CONVERTED_TO_CONTRACT') => {
    if (!editQuoCustomerName.trim()) {
      setEditQuoError('يرجى تحديد أو إدخال اسم العميل.');
      return;
    }
    if (editQuoLines.length === 0) {
      setEditQuoError('يرجى إضافة بند واحد على الأقل لعرض السعر.');
      return;
    }

    const subtotalDec = editQuoLines.reduce(
      (acc, line) => acc.add(new PreciseMoney(line.lineTotal || 0)),
      PreciseMoney.zero()
    );
    const discountDec = new PreciseMoney(editQuoDiscount || 0);
    const grandTotalDec = subtotalDec.sub(discountDec);

    const validDays = parseInt(editQuoValidDays) || 15;
    const dateObj = new Date(editQuoDate);
    dateObj.setDate(dateObj.getDate() + validDays);
    const validUntilStr = dateObj.toISOString().split('T')[0];

    const quotationObj: Quotation = {
      id: editingQuoId || `quo-${Date.now()}`,
      quotationNumber: editQuoNumber,
      subject: editQuoSubject.trim() || `عرض سعر أعمال ${editQuoDivision === 'WOOD' ? 'نجارة وديكور' : 'ألمنيوم وواجهات'}`,
      customerId: editQuoCustomerId || `cust-${Date.now()}`,
      customerName: editQuoCustomerName.trim(),
      customerPhone: editQuoCustomerPhone.trim(),
      customerAddress: editQuoCustomerAddress.trim(),
      divisionId: editQuoDivision,
      date: editQuoDate,
      validUntil: validUntilStr,
      status: targetStatus,
      lines: editQuoLines,
      images: editQuoImages,
      subtotal: subtotalDec.toDbString(2),
      discountTotal: discountDec.toDbString(2),
      taxTotal: '0.00',
      grandTotal: grandTotalDec.isNegative() ? '0.00' : grandTotalDec.toDbString(2),
      printShowItemized: editQuoShowItemized,
      paymentTerms: editQuoPaymentTerms.trim(),
      notes: editQuoNotes.trim(),
      approvedBy: targetStatus === 'APPROVED' ? 'إدارة شركة نوك' : undefined,
      createdAt: editingQuoId ? (quotations.find((q) => q.id === editingQuoId)?.createdAt || editQuoDate) : editQuoDate,
    };

    if (editingQuoId) {
      setQuotations(quotations.map((q) => (q.id === editingQuoId ? quotationObj : q)));
      setQuotationFeedback(`تم تحديث وحفظ عرض السعر رقم [${quotationObj.quotationNumber}] بنجاح.`);
    } else {
      setQuotations([quotationObj, ...quotations]);
      setQuotationFeedback(`تم إنشاء وحفظ عرض السعر رقم [${quotationObj.quotationNumber}] باسم [${quotationObj.customerName}] بنجاح.`);
    }

    setSelectedQuotation(quotationObj);
    setIsQuotationEditorOpen(false);
    setTimeout(() => setQuotationFeedback(null), 5000);
  };

  // Convert Quotation to Official Contract & Link Project
  const handleConvertToContract = (quo: Quotation) => {
    const nextSeq = contracts.length + 1;
    const currentYear = new Date().getFullYear();
    const contractNumber = SequenceFormatter.formatNumber('CONTRACT', currentYear, nextSeq);

    const grandTotalMoney = new PreciseMoney(quo.grandTotal);
    const advanceMoney = grandTotalMoney.mul(new PreciseMoney('0.50'));
    const stage2Money = grandTotalMoney.mul(new PreciseMoney('0.40'));
    const stage3Money = grandTotalMoney.sub(advanceMoney).sub(stage2Money);

    const projectSeq = projects.length + 1;
    const projectNumber = SequenceFormatter.formatNumber('PROJECT', currentYear, projectSeq);
    const projectId = `proj-from-quo-${Date.now()}`;

    // 1. Create Official Contract
    const newContract: Contract = {
      id: `cnt-${Date.now()}`,
      contractNumber,
      subject: `عقد اتفاق وتصنيع: ${quo.subject || quo.customerName}`,
      customerId: quo.customerId,
      customerName: quo.customerName,
      customerPhone: quo.customerPhone,
      customerAddress: quo.customerAddress,
      divisionId: quo.divisionId,
      quotationId: quo.id,
      quotationNumber: quo.quotationNumber,
      projectId,
      projectNumber,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: quo.validUntil,
      totalAmount: quo.grandTotal,
      advanceAmount: advanceMoney.toDbString(2),
      status: 'ACTIVE',
      installments: [
        {
          installmentNumber: 1,
          description: 'الدفعة الأولى المقدمة عند توقيع العقد (50%)',
          dueDate: new Date().toISOString().split('T')[0],
          amount: advanceMoney.toDbString(2),
          isPaid: true,
          paidDate: new Date().toISOString().split('T')[0],
        },
        {
          installmentNumber: 2,
          description: 'الدفعة الثانية عند اكتمال تصنيع المواد بالورشة (40%)',
          dueDate: quo.validUntil,
          amount: stage2Money.toDbString(2),
          isPaid: false,
        },
        {
          installmentNumber: 3,
          description: 'الدفعة الثالثة والنهائية بعد التركيب والتسليم والضمان (10%)',
          dueDate: quo.validUntil,
          amount: stage3Money.toDbString(2),
          isPaid: false,
        },
      ],
      scopeOfWork: quo.lines.map((l, i) => `${i + 1}. ${l.description} (الكمية: ${l.quantity} ${l.unit})`).join(' | '),
      warrantyTerms: 'تتعهد شركة نوك بضمان أعمال النجارة والألمنيوم لمدة 12 شهراً ميلادياً ضد أي عيوب تصنيعية أو تركيبية.',
      penaltyClause: 'يلتزم الطرفان بالشروط الفنية، وتفرض غرامة تأخير 50,000 د.ع عن كل يوم تأخير غير مبرر بظروف قاهرة.',
      notes: `تم توقيع العقد وتحويله رسمياً من عرض السعر المعتمد رقم ${quo.quotationNumber}. تم تسجيل الدفعة الأولى وفتح المشروع بجدول العمليات بالورشة.`,
      approvedBy: 'المدير العام',
      signedByCustomer: quo.customerName,
      signedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    // 2. Create Linked Project in `projects` state so workshop can start work immediately!
    const newProject: Project = {
      id: projectId,
      projectNumber,
      name: quo.subject || `مشروع ${quo.customerName}`,
      customerId: quo.customerId,
      customerName: quo.customerName,
      divisionId: quo.divisionId,
      contractId: newContract.id,
      managerName: quo.divisionId === 'WOOD' ? 'م. أحمد الخشاب' : 'م. بلال الحديثي',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: quo.validUntil,
      currentStage: 'تصميم ومقاسات',
      status: 'IN_PROGRESS',
      contractAmount: quo.grandTotal,
      invoicedAmount: quo.grandTotal,
      collectedAmount: advanceMoney.toDbString(2),
      actualMaterialCost: '0.00',
      notes: `مشروع معتمد بموجب العقد رقم ${contractNumber} المحول من عرض السعر ${quo.quotationNumber}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // 3. Update Quotation Status
    const updatedQuotations = quotations.map((q) =>
      q.id === quo.id
        ? {
            ...q,
            status: 'CONVERTED_TO_CONTRACT' as const,
            contractId: newContract.id,
            contractNumber: newContract.contractNumber,
            projectId: newProject.id,
          }
        : q
    );

    setContracts([newContract, ...contracts]);
    setProjects([newProject, ...projects]);
    setQuotations(updatedQuotations);
    setActiveContract(newContract);
    setIsContractModalOpen(true);
    setQuotationFeedback(`تم بنجاح تحويل عرض السعر إلى عقد رسمي رقم [${contractNumber}] وإنشاء مشروع رقم [${projectNumber}] بجدول العمليات الصناعية!`);
    setTimeout(() => setQuotationFeedback(null), 6000);
  };

  // Delete Quotation
  const handleDeleteQuotation = (quoId: string, quoNumber: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف عرض السعر رقم [${quoNumber}]؟`)) {
      setQuotations(quotations.filter((q) => q.id !== quoId));
      if (selectedQuotation?.id === quoId) {
        setSelectedQuotation(quotations.find((q) => q.id !== quoId) || null);
      }
      setQuotationFeedback(`تم حذف عرض السعر [${quoNumber}] بنجاح.`);
      setTimeout(() => setQuotationFeedback(null), 3000);
    }
  };

  // Export Quotations to CSV
  const handleExportQuotationsCSV = () => {
    const headers = [
      'التسلسل',
      'رقم العرض',
      'اسم العميل',
      'رقم الهاتف',
      'موضوع العرض والطلبية',
      'القسم',
      'المبلغ الإجمالي (د.ع)',
      'الخصم',
      'الحالة',
      'تاريخ العرض',
      'تاريخ الانتهاء',
      'عدد المرفقات والمخططات',
      'رقم العقد المرتبط'
    ];
    const rows = filteredQuotations.map((q, idx) => [
      idx + 1,
      q.quotationNumber,
      `"${(q.customerName || '').replace(/"/g, '""')}"`,
      `"${q.customerPhone || ''}"`,
      `"${(q.subject || '').replace(/"/g, '""')}"`,
      q.divisionId === 'WOOD' ? 'نجارة خشب' : 'ألمنيوم',
      q.grandTotal,
      q.discountTotal,
      q.status === 'CONVERTED_TO_CONTRACT'
        ? 'محول لعقد ساري'
        : q.status === 'ACCEPTED'
        ? 'موافق عليه من العميل'
        : q.status === 'APPROVED'
        ? 'معتمد من الإدارة'
        : 'مسودة',
      q.date,
      q.validUntil,
      (q.images || []).length,
      q.contractNumber || 'غير مرتبط'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `عروض_الأسعار_شركة_نوك_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setQuotationFeedback('تم تصدير سجل عروض الأسعار بصيغة Excel CSV بنجاح.');
    setTimeout(() => setQuotationFeedback(null), 4000);
  };

  // If user is not logged in, show the professional online login portal
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} users={systemUsers} />;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="no-print w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-l border-slate-800 shadow-xl select-none">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-center">
            <img
              src={noakLogo}
              alt="NOAK Interior Decoration"
              className="w-full h-auto object-contain rounded-2xl bg-white/95 p-2 shadow-md border border-slate-700/80 transition-all hover:scale-[1.01]"
            />
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Layers className="w-4 h-4" />
              <span>لوحة التحكم والقيادة</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'customers' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>العملاء والموردون</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab === 'customers' ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {contacts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'projects' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>المشاريع والعمليات</span>
            </button>

            <button
              onClick={() => setActiveTab('quotations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'quotations' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <FileText className="w-4 h-4" />
              <span>عروض الأسعار</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Boxes className="w-4 h-4" />
              <span>المستودعات والدفعات</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'expenses' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4" />
                <span>المصروفات العامة</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab === 'expenses' ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {expenses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'assets' || (activeTab as any) === 'accounting' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                <span>الأصول ومستودع المعرض</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab === 'assets' || (activeTab as any) === 'accounting' ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`} title="عدد المواد الجاهزة المتوفرة بمستودع المعرض">
                {showroomItems.filter(i => i.status === 'IN_SHOWROOM').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'partners' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Users2 className="w-4 h-4" />
              <span>الشركاء وتوزيع الأرباح</span>
            </button>

            <button
              onClick={() => setActiveTab('payroll')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'payroll' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>الموارد البشرية</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab === 'payroll' ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {employees.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Settings className="w-4 h-4" />
              <span>النسخ الاحتياطي والإعدادات</span>
            </button>
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-full ${activeUser.avatarColor || 'bg-emerald-600'} border border-emerald-500/50 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs`}>
                {activeUser.initials || 'ع.س'}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="text-xs font-bold text-white truncate" title={activeUser.fullName}>{activeUser.fullName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-400 font-semibold truncate block">{activeUser.roleArabic}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/40 transition shrink-0"
              title="تسجيل الخروج من المنظومة"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className={`no-print h-16 border-b px-6 flex items-center justify-between shadow-xs z-30 transition-colors gap-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {/* Right Side (in RTL): Company Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors shrink-0 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className={`text-base font-black tracking-tight font-cairo whitespace-nowrap ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  شركة نوك للديكورات الداخلية والألمنيوم
                </h1>
                <span className="text-[10px] bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                  NOAK ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                نظام الإدارة المتكامل والعمليات المركزية
              </p>
            </div>
          </div>

          {/* Left Side (in RTL): Live Date & Time, Current User, Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Date Card */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="whitespace-nowrap font-medium">
                {currentTime.toLocaleDateString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Live Clock Card */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold whitespace-nowrap transition-colors shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-700'
            }`}>
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
              <span dir="ltr" className="tracking-wider whitespace-nowrap">
                {currentTime.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>

            <div className={`h-6 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} shrink-0`}></div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setCurrentLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition shadow-xs active:scale-95 shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="تبديل لغة الواجهة"
            >
              <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="whitespace-nowrap">{currentLanguage === 'ar' ? 'عربي (AR)' : 'English (EN)'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`p-2 px-3 rounded-xl border whitespace-nowrap transition shadow-xs active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0 ${
                isDarkMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-400 whitespace-nowrap">نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="whitespace-nowrap">ليلي</span>
                </>
              )}
            </button>

            {/* Notifications Dropdown Area */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen(prev => !prev)}
                className={`relative p-2 rounded-xl border transition shrink-0 active:scale-95 flex items-center justify-center ${
                  notificationOpen
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600 shadow-2xs'
                }`}
                title="مركز الإشعارات والتنبيهات الذكية"
              >
                <Bell className={`w-4 h-4 ${activeNotifications.length > 0 ? 'text-amber-500 dark:text-amber-400' : ''}`} />
                {activeNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-mono font-bold text-white shadow-xs animate-pulse">
                    {activeNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Menu */}
              {notificationOpen && (
                <div
                  className={`absolute left-0 mt-2 top-full w-84 sm:w-[440px] max-h-[550px] flex flex-col rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-black/80'
                      : 'bg-white border-slate-200 text-slate-800 shadow-slate-400/50'
                  }`}
                >
                  {/* Dropdown Header */}
                  <div className={`p-3.5 border-b flex items-center justify-between ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold leading-tight">مركز الإشعارات والتنبيهات الذكية</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {activeNotifications.length > 0
                            ? `يوجد ${activeNotifications.length} تنبيه نشط يتطلب المتابعة`
                            : 'لا توجد تنبيهات معلقة'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeNotifications.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDismissAllForSession}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                          title="إخفاء جميع الإشعارات لهذه الجلسة الحالية فقط"
                        >
                          إخفاء الكل مؤقتاً
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setNotificationOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                        title="إغلاق"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="flex-1 overflow-y-auto max-h-[380px] p-3 space-y-2.5">
                    {activeNotifications.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
                          كافة العمليات مستقرة ومحدثة!
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          لا توجد دفعات متأخرة أو مشاريع متأخرة أو نقص في المواد يتطلب تدخلاً حالياً.
                        </p>
                        {dismissedNotificationIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 mb-1.5">
                              (تم إخفاء {dismissedNotificationIds.length} تنبيه مؤقتاً لهذه الجلسة)
                            </p>
                            <button
                              type="button"
                              onClick={handleRestoreDismissed}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              إعادة إظهار التنبيهات المخفية
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      activeNotifications.map(item => {
                        let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                        let iconEl = <AlertCircle className="w-4 h-4 text-slate-500" />;
                        let borderClass = 'border-slate-200 dark:border-slate-700/80';

                        if (item.category === 'PAYMENT') {
                          badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900';
                          iconEl = <Receipt className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
                          borderClass = 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400';
                        } else if (item.category === 'PROJECT') {
                          badgeColor = 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-900';
                          iconEl = <FolderKanban className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
                          borderClass = 'border-sky-200 dark:border-sky-900/50 hover:border-sky-400';
                        } else if (item.category === 'INVENTORY') {
                          badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
                          iconEl = <Boxes className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
                          borderClass = 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400';
                        } else if (item.category === 'QUOTATION') {
                          badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
                          iconEl = <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />;
                          borderClass = 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400';
                        }

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 group relative ${
                              isDarkMode ? 'bg-slate-800/60 hover:bg-slate-800' : 'bg-slate-50/80 hover:bg-white hover:shadow-xs'
                            } ${borderClass}`}
                          >
                            {/* Checkbox: عند وضع تشيك عليه يختفي ويعود في الجلسة القادمة إذا لم يتم اتخاذ إجراء */}
                            <button
                              type="button"
                              onClick={(e) => handleDismissNotification(item.id, e)}
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5 rounded transition"
                              title="ضع علامة صح (✓) لإخفاء الإشعار مؤقتاً لهذه الجلسة - سيعود في الجلسة القادمة إذا لم يتم اتخاذ إجراء"
                            >
                              <Square className="w-4 h-4 transition-transform group-hover:scale-110" />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {iconEl}
                                  <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                                    {item.title}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
                                  {item.detailBadge}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2 text-right">
                                {item.description}
                              </p>

                              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {item.createdAtText}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleNotificationAction(item.targetTab)}
                                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 active:scale-95 transition"
                                >
                                  <span>معالجة في القسم</span>
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer Note */}
                  <div className={`p-2.5 px-3 border-t text-[10px] leading-tight ${
                    isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-400' : 'bg-slate-100/90 border-slate-200 text-slate-500'
                  }`}>
                    <p className="flex items-center gap-1.5 font-medium">
                      <span>💡</span>
                      <span>
                        المربع الصغير (✓) يخفي التنبيه في هذه الجلسة، وسيعاود الظهور تلقائياً عند فتح البرنامج القادم إذا لم يتم اتخاذ إجراء.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <main className={`flex-1 overflow-y-auto p-6 transition-colors ${
          isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/70 text-slate-800'
        }`}>
          {/* TAB 1: SPLIT DASHBOARD (WOOD & ALUMINUM SEPARATED) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Two Divisional Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Wood Division Panel */}
                <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-amber-800 to-amber-700 text-white p-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold">قسم النجارة</h2>
                    </div>
                    <span className="bg-amber-900/60 text-amber-100 text-xs px-2.5 py-1 rounded-lg border border-amber-500/40 font-mono">
                      مستودع: {INITIAL_WAREHOUSES[0].nameAr}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-100">
                        <span className="text-xs text-amber-800 font-semibold block">الإيرادات:</span>
                        <span className="text-lg font-bold text-amber-900 mt-1 block">
                          {woodRevenue.formatIQD()}
                        </span>
                      </div>

                      <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-100">
                        <span className="text-xs text-amber-800 font-semibold block">كلفة المواد المنصرفة:</span>
                        <span className="text-lg font-bold text-slate-800 mt-1 block">
                          {woodMaterialCost.formatIQD()}
                        </span>
                      </div>
                    </div>

                    {/* Gross Profit Indicator */}
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block">مجمل الربح:</span>
                        <span className="text-xl font-black text-emerald-700 mt-0.5 block">
                          {woodGrossProfit.formatIQD()}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                        هامش: {woodRevenue.isPositive() ? woodGrossProfit.mul(100).div(woodRevenue).toDbString(1) : '0'}%
                      </span>
                    </div>

                    {/* Active Projects Table for Wood */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">المشاريع الجارية:</h3>
                      <div className="space-y-2">
                        {woodProjects.map((proj) => (
                          <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{proj.name}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5">العميل: {proj.customerName} | المرحلة: {proj.currentStage}</p>
                            </div>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {proj.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : proj.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Aluminum Division Panel */}
                <div className="bg-white rounded-xl border border-sky-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-sky-800 to-sky-700 text-white p-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold">قسم الألمنيوم</h2>
                    </div>
                    <span className="bg-sky-900/60 text-sky-100 text-xs px-2.5 py-1 rounded-lg border border-sky-500/40 font-mono">
                      مستودع: {INITIAL_WAREHOUSES[1].nameAr}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-sky-50/70 p-3.5 rounded-lg border border-sky-100">
                        <span className="text-xs text-sky-800 font-semibold block">الإيرادات:</span>
                        <span className="text-lg font-bold text-sky-900 mt-1 block">
                          {alumRevenue.formatIQD()}
                        </span>
                      </div>

                      <div className="bg-sky-50/70 p-3.5 rounded-lg border border-sky-100">
                        <span className="text-xs text-sky-800 font-semibold block">كلفة المواد المنصرفة:</span>
                        <span className="text-lg font-bold text-slate-800 mt-1 block">
                          {alumMaterialCost.formatIQD()}
                        </span>
                      </div>
                    </div>

                    {/* Gross Profit Indicator */}
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block">مجمل الربح:</span>
                        <span className="text-xl font-black text-emerald-700 mt-0.5 block">
                          {alumGrossProfit.formatIQD()}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                        هامش: {alumRevenue.isPositive() ? alumGrossProfit.mul(100).div(alumRevenue).toDbString(1) : '0'}%
                      </span>
                    </div>

                    {/* Active Projects Table for Aluminum */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">المشاريع الجارية:</h3>
                      <div className="space-y-2">
                        {alumProjects.map((proj) => (
                          <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{proj.name}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5">العميل: {proj.customerName} | المرحلة: {proj.currentStage}</p>
                            </div>
                            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                              {proj.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : proj.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS & SUPPLIERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Top Banner / Feedback Message */}
              {contactFeedback && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{contactFeedback}</span>
                  </div>
                  <button onClick={() => setContactFeedback(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm">
                    ✕
                  </button>
                </div>
              )}

              {/* 1. TOP CARD: SEARCH, NEW CONTACT, FILTERING & ACTION BUTTONS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                {/* Header Title & Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                        <Users className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800">دليل العملاء والموردين</h2>
                    </div>
                  </div>

                  {/* Operation Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        setNewContactDivision(contactDivisionFilter === 'WOOD' ? 'WOOD' : contactDivisionFilter === 'ALUMINUM' ? 'ALUMINUM' : 'SHARED');
                        setIsAddContactModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>إضافة عميل</span>
                    </button>

                    <UnifiedExportButton
                      onExportExcel={handleExportContactsCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير كشف العملاء والموردين Excel"
                      pdfLabel="طباعة كشف العملاء والموردين PDF"
                    />

                    <button
                      onClick={() => {
                        setContactSearchQuery('');
                        setContactTypeFilter('ALL');
                        setContactDivisionFilter('ALL');
                        setContactFeedback('تم تحديث قائمة الحسابات وإعادة ضبط كافة الفلاتر والتقسيمات.');
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Division Filter Segmented Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">تصفية القسم:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* All Divisions Button */}
                    <button
                      type="button"
                      onClick={() => setContactDivisionFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        contactDivisionFilter === 'ALL'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>الكل</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        contactDivisionFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {contacts.length}
                      </span>
                    </button>

                    {/* Wood Button */}
                    <button
                      type="button"
                      onClick={() => setContactDivisionFilter(contactDivisionFilter === 'WOOD' ? 'ALL' : 'WOOD')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                        contactDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>قسم النجارة</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        contactDivisionFilter === 'WOOD' ? 'bg-amber-800 text-white' : 'bg-amber-200/90 text-amber-900'
                      }`}>
                        {totalWoodContactsCount}
                      </span>
                    </button>

                    {/* Aluminum Button */}
                    <button
                      type="button"
                      onClick={() => setContactDivisionFilter(contactDivisionFilter === 'ALUMINUM' ? 'ALL' : 'ALUMINUM')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                        contactDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                          : 'bg-sky-50/90 text-sky-900 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                      <span>قسم الألمنيوم</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        contactDivisionFilter === 'ALUMINUM' ? 'bg-sky-800 text-white' : 'bg-sky-200/90 text-sky-900'
                      }`}>
                        {totalAlumContactsCount}
                      </span>
                    </button>

                    {/* Shared Contacts Button */}
                    <button
                      type="button"
                      onClick={() => setContactDivisionFilter(contactDivisionFilter === 'SHARED' ? 'ALL' : 'SHARED')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        contactDivisionFilter === 'SHARED'
                          ? 'bg-slate-700 text-white border-slate-700 shadow-sm ring-2 ring-slate-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span>مشترك</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        contactDivisionFilter === 'SHARED' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {totalSharedContactsCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Search Bar & Quick Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Search Input (Takes 6 cols) */}
                  <div className="lg:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="بحث بالاسم، الكود، الهاتف، أو العنوان..."
                      value={contactSearchQuery}
                      onChange={(e) => setContactSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    />
                    {contactSearchQuery && (
                      <button
                        onClick={() => setContactSearchQuery('')}
                        className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Chips (Takes 6 cols) */}
                  <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5 justify-end">
                    <button
                      onClick={() => setContactTypeFilter('ALL')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        contactTypeFilter === 'ALL'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>كافة الجهات</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
                        {baseContactsByDiv.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setContactTypeFilter('CUSTOMER')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        contactTypeFilter === 'CUSTOMER'
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <span>الزبائن (العملاء)</span>
                      <span className="text-[10px] bg-emerald-900/30 px-1.5 py-0.5 rounded-full font-mono">
                        {totalCustomersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setContactTypeFilter('SUPPLIER')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        contactTypeFilter === 'SUPPLIER'
                          ? 'bg-indigo-700 text-white shadow-sm'
                          : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      <span>الموردون</span>
                      <span className="text-[10px] bg-indigo-900/30 px-1.5 py-0.5 rounded-full font-mono">
                        {totalSuppliersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setContactTypeFilter('OUTSTANDING')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        contactTypeFilter === 'OUTSTANDING'
                          ? 'bg-rose-700 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <span>ذمم متبقية غير مسددة</span>
                      <span className="text-[10px] bg-rose-900/30 px-1.5 py-0.5 rounded-full font-mono">
                        {outstandingContactsCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Financial Summary KPI Cards inside Top Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block">إجمالي التعاملات المعروضة:</span>
                      <span className="text-base font-black text-slate-800 font-mono mt-0.5 block">
                        {totalTransactions.formatIQD()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                      ∑
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 block">إجمالي المبالغ المسددة / المقبوضة:</span>
                      <span className="text-base font-black text-emerald-800 font-mono mt-0.5 block">
                        {totalPaid.formatIQD()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-rose-700 block">صافي الأرصدة المتبقية (ذمم معلقة):</span>
                      <span className="text-base font-black text-rose-800 font-mono mt-0.5 block">
                        {totalRemaining.formatIQD()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. BOTTOM CARD: PROFESSIONAL ACCOUNTS & BALANCES TABLE */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-sm font-bold text-slate-800">
                      جدول تفاصيل الحسابات والأرصدة المالية {contactDivisionFilter === 'WOOD' ? '— قسم النجارة والديكور الخشبي' : contactDivisionFilter === 'ALUMINUM' ? '— قسم الألمنيوم والواجهات المعمارية' : contactDivisionFilter === 'SHARED' ? '— المعاملات العامة المشتركة' : ''} ({filteredContacts.length} جهة مطابقة)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    العملة الرسمية: <strong className="text-slate-700 font-mono">الدينار العراقي (IQD)</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-3.5 text-center w-12">#</th>
                        <th className="p-3.5 w-24 text-center">النوع</th>
                        <th className="p-3.5">الكود والاسم التجاري</th>
                        <th className="p-3.5 text-center">القسم</th>
                        <th className="p-3.5 text-left font-mono">المبلغ الكلي</th>
                        <th className="p-3.5 text-left font-mono">المدفوع / المسدد</th>
                        <th className="p-3.5 text-left font-mono">المتبقي (الذمة)</th>
                        <th className="p-3.5 text-center">الحالة / المرحلة</th>
                        <th className="p-3.5 text-center w-20 no-print">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredContacts.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-12 text-slate-400">
                            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="font-semibold text-sm">لا توجد جهات مطابقة لمعايير البحث والفلترة المحددة</p>
                            <p className="text-xs text-slate-400 mt-1">جرب تغيير كلمات البحث أو إعادة تعيين تصفية القسم والفلاتر أعلاه.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setContactDivisionFilter('ALL');
                                setContactTypeFilter('ALL');
                                setContactSearchQuery('');
                              }}
                              className="mt-3 text-emerald-600 hover:text-emerald-700 font-bold underline inline-block"
                            >
                              إعادة ضبط التصفية والبحث
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredContacts.map((c, index) => {
                          const remainingVal = new PreciseMoney(c.remainingAmount);
                          const isFullyPaid = remainingVal.isZero() || remainingVal.isNegative();

                          return (
                            <React.Fragment key={c.id}>
                              <tr className="hover:bg-slate-50/80 transition group relative hover:z-30">
                                {/* Index */}
                                <td className="p-3.5 text-center font-mono text-slate-400 font-semibold">
                                  {index + 1}
                                </td>

                                {/* Contact Type Badge */}
                                <td className="p-3.5 text-center">
                                  {c.type === 'CUSTOMER' ? (
                                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                      زبون
                                    </span>
                                  ) : (
                                    <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                      مورد
                                    </span>
                                  )}
                                </td>

                                {/* Code & Name with Expand Arrow Button */}
                                <td className="p-3.5">
                                  <div className="flex items-start gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleExpandContact(c.id)}
                                      className={`mt-0.5 p-1 rounded-lg border transition ${
                                        expandedContactIds.includes(c.id)
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                          : 'bg-slate-100 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'
                                      }`}
                                      title={
                                        expandedContactIds.includes(c.id)
                                          ? 'إخفاء سجل الدفعات وتواريخها والمتبقي'
                                          : 'عرض سجل الدفعات وتواريخها والمتبقي'
                                      }
                                    >
                                      {expandedContactIds.includes(c.id) ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                          onClick={() => toggleExpandContact(c.id)}
                                          className="font-bold text-slate-900 group-hover:text-emerald-700 cursor-pointer transition"
                                        >
                                          {c.name}
                                        </span>
                                        {c.paymentHistory && c.paymentHistory.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => toggleExpandContact(c.id)}
                                            className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded-full border border-emerald-200 hover:bg-emerald-100 transition"
                                            title="انقر لعرض وتفصيل سجل الدفعات وتواريخها"
                                          >
                                            {c.paymentHistory.length} دفعات
                                          </button>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                                        <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                          {c.code}
                                        </span>
                                        {c.email && <span className="truncate max-w-[140px]">{c.email}</span>}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Division */}
                                <td className="p-3.5 text-center">
                                  {c.divisionId === 'WOOD' && (
                                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px] border border-amber-300">
                                      نجارة
                                    </span>
                                  )}
                                  {c.divisionId === 'ALUMINUM' && (
                                    <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md font-bold text-[10px] border border-sky-300">
                                      ألمنيوم
                                    </span>
                                  )}
                                  {!c.divisionId && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[10px] border border-slate-200">
                                      مشترك
                                    </span>
                                  )}
                                </td>

                                {/* Total Amount */}
                                <td className="p-3.5 text-left font-mono font-bold text-slate-800">
                                  {new PreciseMoney(c.totalAmount).formatIQD()}
                                </td>

                                {/* Paid Amount */}
                                <td className="p-3.5 text-left font-mono font-bold text-emerald-700">
                                  {new PreciseMoney(c.paidAmount).formatIQD()}
                                </td>

                                {/* Remaining Balance */}
                                <td className="p-3.5 text-left font-mono">
                                  {isFullyPaid ? (
                                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg border border-emerald-200 text-[11px] inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      خالص الذمة (0)
                                    </span>
                                  ) : (
                                    <span className="bg-rose-50 text-rose-800 font-black px-2 py-1 rounded-lg border border-rose-200 text-xs inline-block">
                                      {remainingVal.formatIQD()}
                                    </span>
                                  )}
                                </td>

                                {/* Status / Stage */}
                                <td className="p-3.5 text-center">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                                    {c.pipelineStage || 'نشط'}
                                  </span>
                                </td>

                                {/* Action Buttons (Hover-triggered Gear Menu) */}
                                <td className="p-3.5 text-center no-print relative">
                                  <ActionGearMenu
                                    title="إجراءات الحساب"
                                    dropUp={filteredContacts.length > 2 && index >= filteredContacts.length - 2}
                                    items={[
                                      {
                                        id: 'statement',
                                        label: 'كشف حساب تفصيلي',
                                        description: 'عرض وطباعة كشف الحساب والذمم',
                                        icon: <Eye className="w-4 h-4" />,
                                        variant: 'primary',
                                        onClick: () => {
                                          setSelectedContact(c);
                                          setIsStatementModalOpen(true);
                                        },
                                      },
                                      {
                                        id: 'payment',
                                        label: c.type === 'CUSTOMER' ? 'تسجيل سند قبض وتحصيل' : 'تسجيل سند دفع وسداد',
                                        description: 'تسجيل حركة مالية وإصدار سند رسمي',
                                        icon: <Receipt className="w-4 h-4" />,
                                        variant: 'success',
                                        onClick: () => {
                                          setSelectedContact(c);
                                          setPaymentAmount(c.remainingAmount);
                                          setIsPaymentModalOpen(true);
                                        },
                                      },
                                      {
                                        id: 'toggle-history',
                                        label: expandedContactIds.includes(c.id)
                                          ? 'طي تفاصيل العميل والدفعات'
                                          : 'عرض سجل الدفعات وتواريخها',
                                        description: 'سجل المقبوضات وتواريخها وبيانات الاتصال',
                                        icon: <History className="w-4 h-4" />,
                                        badge:
                                          c.paymentHistory && c.paymentHistory.length > 0
                                            ? `${c.paymentHistory.length} دفعات`
                                            : undefined,
                                        onClick: () => toggleExpandContact(c.id),
                                      },
                                      {
                                        id: 'delete',
                                        label: 'حذف من السجل',
                                        description: 'حذف الجهة نهائياً من قاعدة البيانات',
                                        icon: <Trash2 className="w-4 h-4" />,
                                        variant: 'danger',
                                        onClick: () => {
                                          if (confirm(`هل أنت متأكد من رغبتك في حذف الجهة [${c.name}] من السجل؟`)) {
                                            setContacts(contacts.filter((item) => item.id !== c.id));
                                            setContactFeedback(`تم حذف [${c.name}] من السجل بنجاح.`);
                                          }
                                        },
                                      },
                                    ]}
                                  />
                                </td>
                              </tr>

                              {/* Collapsible Payment History & Contact Details Drawer (يظهر عند الضغط على السهم بجانب اسم العميل وتختفي عند طيه) */}
                              {expandedContactIds.includes(c.id) && (
                                <tr className="bg-slate-50/95 border-b-2 border-emerald-500/30 animate-in fade-in duration-150">
                                  <td colSpan={9} className="p-4">
                                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3.5">
                                      {/* Contact Information Bar: Phone & Address (تظهر عند فتح اسم العميل وتختفي عند طيه) */}
                                      <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        {/* Phone Number with Quick Copy */}
                                        <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-slate-400 font-semibold block">رقم الهاتف والاتصال المباشر:</span>
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-mono font-bold text-slate-800 text-xs">{c.phone || 'غير مسجل'}</span>
                                              {c.phone && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleCopyPhone(c.id, c.phone)}
                                                  className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                                                  title="نسخ رقم الهاتف"
                                                >
                                                  {copiedPhoneId === c.id ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                  ) : (
                                                    <Copy className="w-3.5 h-3.5" />
                                                  )}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Address & Project Site Location */}
                                        <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-slate-400 font-semibold block">العنوان وموقع المشروع الميداني:</span>
                                            <p className="font-semibold text-slate-800 text-xs truncate" title={c.address}>
                                              {c.address || 'لم يتم تحديد عنوان تفصيلي'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Drawer Header */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                            <History className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                                              <span>سجل الدفعات والمقبوضات المالية وتواريخها:</span>
                                              <span className="text-emerald-700 font-bold">{c.name}</span>
                                            </h4>
                                            <p className="text-[11px] text-slate-500">
                                              توثيق كامل لكافة الدفعات المستلمة وتواريخها والمتبقي بعد كل دفعة وإمكانية طباعة سند القبض الفوري
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                                            <div>
                                              <span className="text-slate-400">الإجمالي: </span>
                                              <strong className="text-slate-800">{new PreciseMoney(c.totalAmount).formatIQD()}</strong>
                                            </div>
                                            <div className="w-px h-3 bg-slate-200"></div>
                                            <div>
                                              <span className="text-emerald-600">المسدد: </span>
                                              <strong className="text-emerald-700">{new PreciseMoney(c.paidAmount).formatIQD()}</strong>
                                            </div>
                                            <div className="w-px h-3 bg-slate-200"></div>
                                            <div>
                                              <span className="text-rose-600">المتبقي: </span>
                                              <strong className="text-rose-700">{new PreciseMoney(c.remainingAmount).formatIQD()}</strong>
                                            </div>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedContact(c);
                                              setPaymentAmount(c.remainingAmount);
                                              setIsPaymentModalOpen(true);
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                                          >
                                            <Receipt className="w-3.5 h-3.5" />
                                            <span>تسجيل دفعة جديدة</span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Payments History Table */}
                                      {c.paymentHistory && c.paymentHistory.length > 0 ? (
                                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                          <table className="w-full text-right border-collapse text-xs">
                                            <thead>
                                              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                                                <th className="p-2.5 text-center w-10">#</th>
                                                <th className="p-2.5 w-24 text-center">رقم سند القبض</th>
                                                <th className="p-2.5 w-28">تاريخ الدفعة</th>
                                                <th className="p-2.5 text-left w-36 font-mono">المبلغ المستلم (د.ع)</th>
                                                <th className="p-2.5 text-left w-36 font-mono">المتبقي بذمته (د.ع)</th>
                                                <th className="p-2.5 w-28 text-center">طريقة القبض</th>
                                                <th className="p-2.5">البيان وملاحظات السند</th>
                                                <th className="p-2.5 w-32 text-center no-print">طباعة السند</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                              {c.paymentHistory.map((p, pIdx) => (
                                                <tr key={p.id || pIdx} className="hover:bg-slate-50/70">
                                                  <td className="p-2.5 text-center font-mono font-bold text-slate-400">{pIdx + 1}</td>
                                                  <td className="p-2.5 text-center font-mono font-bold">
                                                    {(() => {
                                                      const parts = p.voucherNumber.split(' - ');
                                                      if (parts.length >= 3) {
                                                        return (
                                                          <div className="leading-tight text-center">
                                                            <span className="text-slate-500 text-[10px] block whitespace-nowrap">
                                                              {parts[0]} - {parts[1]}
                                                            </span>
                                                            <span className="text-blue-700 text-xs font-black block whitespace-nowrap">
                                                              {parts[2]}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                      if (parts.length === 2) {
                                                        return (
                                                          <div className="leading-tight text-center">
                                                            <span className="text-slate-500 text-[10px] block whitespace-nowrap">
                                                              {parts[0]}
                                                            </span>
                                                            <span className="text-blue-700 text-xs font-black block whitespace-nowrap">
                                                              {parts[1]}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                      return <span className="text-blue-700 whitespace-nowrap">{p.voucherNumber}</span>;
                                                    })()}
                                                  </td>
                                                  <td className="p-2.5 font-mono text-slate-700">{p.date}</td>
                                                  <td className="p-2.5 text-left font-mono font-black text-emerald-700">
                                                    {new PreciseMoney(p.amount).formatIQD()}
                                                  </td>
                                                  <td className="p-2.5 text-left font-mono font-bold text-rose-700">
                                                    {new PreciseMoney(p.remainingAfter).formatIQD()}
                                                  </td>
                                                  <td className="p-2.5 text-center">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                                                      {p.paymentMethod === 'CASH' ? 'نقداً (صندوق)' : p.paymentMethod === 'BANK' ? 'تحويل مصرفي' : 'صك / شيك'}
                                                    </span>
                                                  </td>
                                                  <td className="p-2.5 text-slate-600">{p.notes || 'دفعة من الحساب'}</td>
                                                  <td className="p-2.5 text-center no-print">
                                                    <button
                                                      type="button"
                                                      onClick={() => handleOpenReceiptVoucher(c, p)}
                                                      className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition shadow-xs"
                                                      title="معاينة وطباعة سند القبض الرسمي"
                                                    >
                                                      <Printer className="w-3 h-3 text-emerald-600" />
                                                      <span>طباعة السند</span>
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-400 space-y-1">
                                          <Receipt className="w-6 h-6 mx-auto text-slate-300" />
                                          <p className="text-xs font-semibold text-slate-600">لا توجد دفعات مالية مسجلة بعد لهذا الحساب</p>
                                          <p className="text-[11px] text-slate-400">اضغط على زر &quot;تسجيل دفعة جديدة&quot; لتسجيل أول حركة سداد وتحصيل وإصدار سند قبض رسمي.</p>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>

                    {/* Table Summary Footer */}
                    {filteredContacts.length > 0 && (
                      <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                        <tr>
                          <td colSpan={6} className="p-3.5 text-left font-cairo">
                            إجمالي الحسابات المعروضة في الجدول:
                          </td>
                          <td className="p-3.5 text-left font-mono font-black text-slate-900">
                            {totalTransactions.formatIQD()}
                          </td>
                          <td className="p-3.5 text-left font-mono font-black text-emerald-800">
                            {totalPaid.formatIQD()}
                          </td>
                          <td className="p-3.5 text-left font-mono font-black text-rose-800">
                            {totalRemaining.formatIQD()}
                          </td>
                          <td colSpan={2} className="p-3.5 text-slate-500 font-normal text-[11px] text-center">
                            مطابق محاسبياً للدفاتر
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & ORDERS VIEW */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              {/* Feedback Banner */}
              {projectFeedback && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{projectFeedback}</span>
                  </div>
                  <button onClick={() => setProjectFeedback(null)} className="text-emerald-700 hover:text-emerald-950 font-bold px-1">
                    ✕
                  </button>
                </div>
              )}

              {/* CARD 1: TOP SEARCH, DIVISION TOGGLE & NEW PROJECT ACTION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-base font-bold text-slate-900">المشاريع والعمليات</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => setIsIssueModalOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>صرف مواد لمشروع</span>
                    </button>

                    <UnifiedExportButton
                      onExportExcel={handleExportProjectsCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير سجل المشاريع Excel"
                      pdfLabel="طباعة سجل المشاريع PDF"
                    />

                    <button
                      onClick={() => {
                        if (projectDivisionFilter === 'ALUMINUM') {
                          setNewProjectDivision('ALUMINUM');
                          setNewProjectManager('م. بلال الحديثي');
                        } else {
                          setNewProjectDivision('WOOD');
                          setNewProjectManager('م. أحمد الخشاب');
                        }
                        setIsAddProjectModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مشروع</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar & Division Selection Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center">
                  {/* Search Input */}
                  <div className="md:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="بحث باسم العميل، رقم المشروع، أو اسم الطلبية..."
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    />
                    {projectSearchQuery && (
                      <button
                        onClick={() => setProjectSearchQuery('')}
                        className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
                        title="مسح البحث"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Division Selector Buttons */}
                  <div className="md:col-span-6 flex items-center gap-2 justify-end flex-wrap">
                    <span className="text-xs font-bold text-slate-500 ml-1">تصفية القسم:</span>

                    {/* Wood Division Button */}
                    <button
                      type="button"
                      onClick={() => setProjectDivisionFilter(projectDivisionFilter === 'WOOD' ? 'ALL' : 'WOOD')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                        projectDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>قسم النجارة</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        projectDivisionFilter === 'WOOD' ? 'bg-amber-800 text-white' : 'bg-amber-200/90 text-amber-900'
                      }`}>
                        {woodProjects.length}
                      </span>
                    </button>

                    {/* Aluminum Division Button */}
                    <button
                      type="button"
                      onClick={() => setProjectDivisionFilter(projectDivisionFilter === 'ALUMINUM' ? 'ALL' : 'ALUMINUM')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                        projectDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                          : 'bg-sky-50/80 text-sky-900 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                      <span>قسم الألمنيوم</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        projectDivisionFilter === 'ALUMINUM' ? 'bg-sky-800 text-white' : 'bg-sky-200/90 text-sky-900'
                      }`}>
                        {alumProjects.length}
                      </span>
                    </button>

                    {/* Show All Button */}
                    <button
                      type="button"
                      onClick={() => setProjectDivisionFilter('ALL')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        projectDivisionFilter === 'ALL'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>الكل</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        projectDivisionFilter === 'ALL' ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {projects.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 2: PROJECT METRICS & DIVISIONAL SEPARATION STATUS CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-800">
                      إحصائيات وحالة المشاريع {projectDivisionFilter === 'WOOD' ? '— قسم النجارة والديكور' : projectDivisionFilter === 'ALUMINUM' ? '— قسم الألمنيوم والواجهات' : '— كلا القسمين (مع الفصل التشغيلي)'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>فصل تكاليف المواد وقوائم الإنتاج معتمد محاسبياً</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Total Projects */}
                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
                      <span>عدد المشاريع الكلي</span>
                      <FolderKanban className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="my-2 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-slate-900">{cardTotalCount}</span>
                      <span className="text-xs text-slate-400 font-bold">مشروع</span>
                    </div>
                    {/* Division Isolation Pills */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded font-bold">
                        الخشب: {woodProjects.length}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-900 bg-sky-100/90 px-2 py-0.5 rounded font-bold">
                        الألمنيوم: {alumProjects.length}
                      </span>
                    </div>
                  </div>

                  {/* 2. In Progress Projects */}
                  <div className="bg-amber-50/40 border border-amber-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-amber-300 transition">
                    <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
                      <span>عدد قيد الإنجاز (تصنيع وتركيب)</span>
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="my-2 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-amber-700">{cardInProgressCount}</span>
                      <span className="text-xs text-amber-600/90 font-bold">مشروع جاري</span>
                    </div>
                    {/* Division Isolation Pills */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-amber-200/70 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded font-bold">
                        الخشب: {woodInProgressCount}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-900 bg-sky-100 px-2 py-0.5 rounded font-bold">
                        الألمنيوم: {alumInProgressCount}
                      </span>
                    </div>
                  </div>

                  {/* 3. Completed & Delivered Projects */}
                  <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-300 transition">
                    <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
                      <span>عدد المنجز والمسلم</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="my-2 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black font-mono text-emerald-700">{cardCompletedCount}</span>
                      <span className="text-xs text-emerald-600/90 font-bold">مشروع منجز ومسلم</span>
                    </div>
                    {/* Division Isolation Pills */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-emerald-200/70 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">
                        الخشب: {woodCompletedCount}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-900 bg-sky-100 px-2 py-0.5 rounded font-bold">
                        الألمنيوم: {alumCompletedCount}
                      </span>
                    </div>
                  </div>

                  {/* 4. Financial Contract Value */}
                  <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                      <span>إجمالي قيمة العقود</span>
                      <Wallet className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="my-2">
                      <span className="text-lg font-black font-mono text-white block">
                        {cardTotalContractValue.formatIQD()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-300">
                      <span>كلفة المواد المنصرفة:</span>
                      <span className="font-mono text-emerald-400 font-bold">{cardTotalMaterialCost.formatIQD()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: PROJECTS TABLE */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">سجل المشاريع المعتمدة</h3>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {filteredProjects.length}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    متابعة كلفة المواد المصروفة من الدفعات وهامش ربحية كل مشروع
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold">
                        <th className="p-3.5 w-10 text-center">تفاصيل</th>
                        <th className="p-3.5">رقم المشروع</th>
                        <th className="p-3.5">اسم المشروع والعميل</th>
                        <th className="p-3.5">القسم</th>
                        <th className="p-3.5">المرحلة</th>
                        <th className="p-3.5">قيمة العقد</th>
                        <th className="p-3.5">كلفة المواد الفعلية</th>
                        <th className="p-3.5">مجمل الربح</th>
                        <th className="p-3.5">الحالة</th>
                        <th className="p-3.5 text-center w-20">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-slate-400">
                            <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            <p className="font-bold text-slate-700 text-sm">لا توجد مشاريع مطابقة للبحث أو القسم المحدد</p>
                            <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو اختر قسماً آخر أو أضف مشروعاً جديداً</p>
                            <button
                              onClick={() => {
                                setProjectSearchQuery('');
                                setProjectDivisionFilter('ALL');
                              }}
                              className="mt-3 text-emerald-600 hover:text-emerald-700 font-bold underline inline-block"
                            >
                              إعادة ضبط التصفية
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p, index) => {
                          const projectIssues = issues.filter((i) => i.projectId === p.id);
                          const costSummary = ProjectCostingEngine.computeProjectProfitability(
                            p.id,
                            p.invoicedAmount,
                            projectIssues
                          );
                          const isExpanded = expandedProjectIds.includes(p.id);
                          const isCompleted = p.status === 'COMPLETED' || p.currentStage.includes('تسليم');

                          return (
                            <React.Fragment key={p.id}>
                              <tr className={`transition relative hover:z-30 ${isExpanded ? 'bg-emerald-50/30' : 'hover:bg-slate-50/80'}`}>
                                {/* Expand / Collapse Toggle Arrow */}
                                <td className="p-3.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandProject(p.id)}
                                    className={`p-1.5 rounded-lg border transition ${
                                      isExpanded
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                                    }`}
                                    title={isExpanded ? 'طي تفاصيل المشروع والمواد' : 'إظهار تفاصيل المواد والتكلفة الحالية والربحية'}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-emerald-700" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-slate-600" />
                                    )}
                                  </button>
                                </td>

                                {/* Project Number & Issue Count Badge */}
                                <td className="p-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-slate-800">{p.projectNumber}</span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                                    <Boxes className="w-3 h-3 text-slate-400" />
                                    <span>{projectIssues.length} مواد منصرفة</span>
                                  </span>
                                </td>

                                {/* Project Name & Customer */}
                                <td className="p-3.5">
                                  <p className="font-bold text-slate-900">{p.name}</p>
                                  <p className="text-[11px] text-slate-500">{p.customerName || 'عميل نقدي'}</p>
                                </td>

                                {/* Division */}
                                <td className="p-3.5">
                                  {p.divisionId === 'WOOD' ? (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                                      النجارة
                                    </span>
                                  ) : (
                                    <span className="bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                                      الألمنيوم
                                    </span>
                                  )}
                                </td>

                                {/* Stage */}
                                <td className="p-3.5 font-medium text-slate-700">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                                    {p.currentStage}
                                  </span>
                                </td>

                                {/* Contract Amount */}
                                <td className="p-3.5 font-bold text-slate-800 font-mono">
                                  {new PreciseMoney(p.contractAmount).formatIQD()}
                                </td>

                                {/* Actual Material Cost */}
                                <td className="p-3.5 font-bold text-slate-700 font-mono">
                                  {new PreciseMoney(p.actualMaterialCost).formatIQD()}
                                </td>

                                {/* Gross Profit & Margin */}
                                <td className="p-3.5 font-black text-emerald-600 font-mono">
                                  {new PreciseMoney(costSummary.grossProfit).formatIQD()}
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    هامش: {costSummary.grossProfitMarginPercent}%
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="p-3.5">
                                  {isCompleted ? (
                                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      منجز ومسلم
                                    </span>
                                  ) : (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      قيد التنفيذ
                                    </span>
                                  )}
                                </td>

                                {/* Actions Column (Hover-triggered Gear Menu) */}
                                <td className="p-3.5 text-center relative">
                                  <ActionGearMenu
                                    title="إجراءات المشروع"
                                    dropUp={filteredProjects.length > 2 && index >= filteredProjects.length - 2}
                                    items={[
                                      {
                                        id: 'contract',
                                        label: 'رؤية العقد المعتمد (A4)',
                                        description: 'معاينة العقد القانوني والطباعة',
                                        icon: <FileSignature className="w-4 h-4" />,
                                        variant: 'primary',
                                        onClick: () => handleViewProjectContract(p),
                                      },
                                      {
                                        id: 'payments',
                                        label: 'سجل الدفعات وسندات القبض',
                                        description: 'سندات القبض وتواريخ المقبوضات',
                                        icon: <Receipt className="w-4 h-4" />,
                                        variant: 'success',
                                        onClick: () => handleViewProjectPayments(p),
                                      },
                                      {
                                        id: 'receipt-voucher-direct',
                                        label: 'سند قبض مالي (طباعة A4)',
                                        description: 'معاينة وطباعة سند القبض المالي المعتمد',
                                        icon: <Printer className="w-4 h-4" />,
                                        variant: 'success',
                                        onClick: () => {
                                          const matchedCustomer = contacts.find(
                                            (c) =>
                                              c.id === p.customerId ||
                                              c.name === p.customerName ||
                                              (p.customerName && c.name.includes(p.customerName))
                                          );
                                          const pmt = matchedCustomer?.paymentHistory?.[0] || {
                                            id: `pay-prj-${p.id}`,
                                            voucherNumber: `RCV-2026-${p.projectNumber.replace('PRJ-2026-', '')}`,
                                            contactId: matchedCustomer?.id || p.customerId,
                                            contactName: p.customerName || 'العميل المعتمد',
                                            amount: p.collectedAmount || '0',
                                            date: p.startDate || '2026-02-01',
                                            paymentMethod: 'CASH',
                                            remainingAfter: new PreciseMoney(p.contractAmount)
                                              .sub(new PreciseMoney(p.collectedAmount || '0'))
                                              .toString(),
                                            notes: `الدفعة المقبوضة لمشروع ${p.name}`,
                                            receivedBy: p.managerName || 'حيدر الصراف (أمين الصندوق)',
                                            projectName: p.name,
                                            createdAt: p.createdAt || '2026-02-01',
                                          };
                                          const rem = new PreciseMoney(p.contractAmount).sub(
                                            new PreciseMoney(p.collectedAmount || '0')
                                          );
                                          const effectiveContact = matchedCustomer || {
                                            id: p.customerId,
                                            code: `CUST-${p.projectNumber.slice(-3)}`,
                                            name: p.customerName || 'العميل المعتمد',
                                            type: 'CUSTOMER' as const,
                                            phone: '0770XXXXXXX',
                                            address: 'العراق',
                                            divisionId: p.divisionId,
                                            totalAmount: p.contractAmount,
                                            paidAmount: p.collectedAmount,
                                            remainingAmount: rem.toString(),
                                            isActive: true,
                                            createdAt: p.startDate,
                                            paymentHistory: [pmt],
                                          };
                                          setIsProjectPaymentsModalOpen(false);
                                          handleOpenReceiptVoucher(effectiveContact, pmt);
                                        },
                                      },
                                      {
                                        id: 'issue-materials',
                                        label: 'صرف مواد من المستودع',
                                        description: 'صرف وجبات خشب/ألمنيوم FIFO',
                                        icon: <ArrowUpRight className="w-4 h-4" />,
                                        variant: 'warning',
                                        onClick: () => {
                                          setIssueProjectId(p.id);
                                          setIsIssueModalOpen(true);
                                        },
                                      },
                                      {
                                        id: 'toggle-status',
                                        label: isCompleted
                                          ? 'إعادة المشروع إلى قيد التنفيذ'
                                          : 'تحديد كمنجز ومسلم بالكامل',
                                        description: isCompleted
                                          ? 'استئناف التصنيع بالورشة'
                                          : 'إغلاق المشروع وتسليمه للعميل',
                                        icon: <Check className="w-4 h-4" />,
                                        variant: isCompleted ? 'default' : 'success',
                                        onClick: () => handleToggleProjectStatus(p.id),
                                      },
                                      {
                                        id: 'toggle-details',
                                        label: isExpanded
                                          ? 'طي تفاصيل المواد والربحية'
                                          : 'إظهار تفاصيل المواد والتكلفة الحالية',
                                        description: 'عرض المواد المنصرفة ونسبة الاستهلاك',
                                        icon: isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />,
                                        badge: projectIssues.length > 0 ? `${projectIssues.length} مواد` : undefined,
                                        onClick: () => toggleExpandProject(p.id),
                                      },
                                    ]}
                                  />
                                </td>
                              </tr>

                              {/* COLLAPSIBLE ROW: DETAILED MATERIAL ISSUES, CURRENT COSTING & OPERATIONAL SPECS */}
                              {isExpanded && (
                                <tr className="bg-slate-50/70 border-b-2 border-slate-200 animate-in fade-in duration-150">
                                  <td colSpan={10} className="p-4 sm:p-5">
                                    <div className="space-y-4">
                                      {/* Header Drawer Bar */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <h4 className="text-xs font-black text-slate-900">
                                            لوحة التفاصيل التشغيلية، كلفة المواد الفعلية، ومستندات المشروع [{p.projectNumber}]
                                          </h4>
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            p.divisionId === 'WOOD' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                                          }`}>
                                            {p.divisionId === 'WOOD' ? 'قسم النجارة' : 'قسم الألمنيوم'}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                          <button
                                            type="button"
                                            onClick={() => handleViewProjectContract(p)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                                          >
                                            <FileSignature className="w-3.5 h-3.5" />
                                            <span>رؤية العقد المعتمد</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleViewProjectPayments(p)}
                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                                          >
                                            <Receipt className="w-3.5 h-3.5" />
                                            <span>سجل الدفعات وسندات القبض</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIssueProjectId(p.id);
                                              setIsIssueModalOpen(true);
                                            }}
                                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                                          >
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                            <span>+ صرف مواد إضافية</span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Main Content Grid: Material Issues Table & Costing Breakdown */}
                                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                        {/* 1. تفاصيل المواد المضافة (المصروفة من الوجبات المستودعية) */}
                                        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                            <div className="flex items-center gap-2">
                                              <Boxes className="w-4 h-4 text-emerald-600" />
                                              <h5 className="font-black text-slate-900 text-xs">
                                                تفاصيل المواد المضافة (المصروفة من الوجبات المستودعية)
                                              </h5>
                                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {projectIssues.length} مواد مسجلة
                                              </span>
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                              البند 14: التكلفة الفعلية المباشرة FIFO
                                            </span>
                                          </div>

                                          {/* Materials Issues Table */}
                                          {projectIssues.length === 0 ? (
                                            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                              <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                              <p className="font-bold text-slate-700 text-xs">لم يتم صرف مواد من المستودع لهذا المشروع بعد</p>
                                              <p className="text-[11px] text-slate-400 mt-0.5">تبدأ كلفة المواد من (0.00 د.ع) وتتراكم بمجرد اعتماد أذونات الصرف</p>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setIssueProjectId(p.id);
                                                  setIsIssueModalOpen(true);
                                                }}
                                                className="mt-3 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                                              >
                                                + صرف أول إذن مواد
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="overflow-x-auto">
                                              <table className="w-full text-right border-collapse text-xs">
                                                <thead>
                                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                                    <th className="p-2.5">رقم الإذن</th>
                                                    <th className="p-2.5">المادة المستودعية</th>
                                                    <th className="p-2.5">رقم الوجبة</th>
                                                    <th className="p-2.5 text-center">الكمية</th>
                                                    <th className="p-2.5 text-left font-mono">كلفة الوحدة</th>
                                                    <th className="p-2.5 text-left font-mono">إجمالي الكلفة</th>
                                                    <th className="p-2.5 text-center">التاريخ والمسؤول</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                  {projectIssues.map((iss) => (
                                                    <tr key={iss.id} className="hover:bg-slate-50/80">
                                                      <td className="p-2.5 font-mono font-bold text-blue-700">{iss.issueNumber}</td>
                                                      <td className="p-2.5 font-bold text-slate-800">{iss.materialNameAr}</td>
                                                      <td className="p-2.5 font-mono text-[11px] text-slate-500">{iss.batchId}</td>
                                                      <td className="p-2.5 text-center font-bold text-slate-800">{iss.quantity}</td>
                                                      <td className="p-2.5 text-left font-mono text-slate-700">
                                                        {new PreciseMoney(iss.unitCost).formatIQD()}
                                                      </td>
                                                      <td className="p-2.5 text-left font-mono font-black text-emerald-700">
                                                        {new PreciseMoney(iss.totalCost).formatIQD()}
                                                      </td>
                                                      <td className="p-2.5 text-center">
                                                        <span className="font-mono text-[11px] text-slate-600 block">{iss.date}</span>
                                                        <span className="text-[10px] text-slate-400">{iss.issuedBy || 'أمين المستودع'}</span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                                <tfoot>
                                                  <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-black text-slate-900">
                                                    <td colSpan={5} className="p-2.5 text-left">
                                                      إجمالي كلفة المواد الفعلية المسحوبة من وجبات المستودع:
                                                    </td>
                                                    <td className="p-2.5 text-left font-mono text-emerald-800 font-black text-sm">
                                                      {new PreciseMoney(p.actualMaterialCost).formatIQD()}
                                                    </td>
                                                    <td></td>
                                                  </tr>
                                                </tfoot>
                                              </table>
                                            </div>
                                          )}
                                        </div>

                                        {/* 2. التكلفة الحالية والتحليل المالي والبيانات التشغيلية */}
                                        <div className="lg:col-span-4 space-y-4">
                                          {/* Costing & Margins Card */}
                                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                              <div className="flex items-center gap-1.5">
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                <h5 className="font-black text-slate-900 text-xs">التكلفة الحالية وهامش الربحية</h5>
                                              </div>
                                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                                مباشر
                                              </span>
                                            </div>

                                            <div className="space-y-2 text-xs">
                                              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                                                <span className="text-slate-600 font-medium">قيمة العقد الإجمالية:</span>
                                                <span className="font-mono font-black text-slate-900">
                                                  {new PreciseMoney(p.contractAmount).formatIQD()}
                                                </span>
                                              </div>

                                              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                                                <span className="text-amber-900 font-medium">كلفة المواد المنصرفة:</span>
                                                <span className="font-mono font-black text-amber-900">
                                                  {new PreciseMoney(p.actualMaterialCost).formatIQD()}
                                                </span>
                                              </div>

                                              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                                                <span className="text-emerald-900 font-bold">مجمل الربح الصناعي:</span>
                                                <div className="text-left">
                                                  <span className="font-mono font-black text-emerald-800 text-sm block">
                                                    {new PreciseMoney(costSummary.grossProfit).formatIQD()}
                                                  </span>
                                                  <span className="text-[10px] text-emerald-700 font-bold block">
                                                    هامش الربح: {costSummary.grossProfitMarginPercent}%
                                                  </span>
                                                </div>
                                              </div>

                                              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                                                <div>
                                                  <span className="text-blue-900 font-medium block">المقبوض من العميل:</span>
                                                  <span className="text-[10px] text-blue-600">
                                                    المتبقي: {new PreciseMoney(p.contractAmount).sub(new PreciseMoney(p.collectedAmount || '0')).formatIQD()}
                                                  </span>
                                                </div>
                                                <span className="font-mono font-black text-blue-900">
                                                  {new PreciseMoney(p.collectedAmount || '0').formatIQD()}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Cost vs Contract Progress Bar */}
                                            <div className="pt-2 border-t border-slate-100">
                                              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                                                <span>نسبة استهلاك المواد من العقد:</span>
                                                <span className="font-mono text-slate-700">
                                                  {Number(p.contractAmount) > 0
                                                    ? Math.min(100, Math.round((Number(p.actualMaterialCost) / Number(p.contractAmount)) * 100))
                                                    : 0}%
                                                </span>
                                              </div>
                                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                                  style={{
                                                    width: `${
                                                      Number(p.contractAmount) > 0
                                                        ? Math.min(100, Math.round((Number(p.actualMaterialCost) / Number(p.contractAmount)) * 100))
                                                        : 0
                                                    }%`,
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Operational & Specifications Card */}
                                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5 text-xs">
                                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                              <Briefcase className="w-4 h-4 text-emerald-600" />
                                              <h5 className="font-black text-slate-900">البيانات التشغيلية والمواصفات</h5>
                                            </div>

                                            <div className="space-y-1.5">
                                              <div className="flex justify-between text-slate-600">
                                                <span>مدير ومسؤول المشروع:</span>
                                                <span className="font-bold text-slate-900">{p.managerName || 'م. أحمد الخشاب'}</span>
                                              </div>
                                              <div className="flex justify-between text-slate-600">
                                                <span>تاريخ بدء العمل:</span>
                                                <span className="font-mono font-semibold text-slate-800">{p.startDate || '2026-02-01'}</span>
                                              </div>
                                              <div className="flex justify-between text-slate-600">
                                                <span>تاريخ التسليم المتوقع:</span>
                                                <span className="font-mono font-semibold text-slate-800">{p.expectedEndDate || '2026-05-30'}</span>
                                              </div>
                                              {p.notes && (
                                                <div className="pt-2 border-t border-slate-100">
                                                  <span className="text-slate-400 block mb-0.5 text-[11px]">المواصفات والملاحظات:</span>
                                                  <p className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700 text-[11px] leading-relaxed font-medium">
                                                    {p.notes}
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUOTATIONS & PRINTING */}
          {activeTab === 'quotations' && (
            <div className="space-y-5">
              {/* Quotation Feedback Banner */}
              {quotationFeedback && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 shadow-sm no-print">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{quotationFeedback}</span>
                  </div>
                  <button onClick={() => setQuotationFeedback(null)} className="text-emerald-700 hover:text-emerald-950 font-bold px-1">
                    ✕
                  </button>
                </div>
              )}

              {/* Top Control & Navigation Header */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-base font-bold text-slate-900">عروض الأسعار</h2>
                    </div>
                  </div>

                  {/* Actions & Tab Switcher */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* View Switcher: Archive vs Preview */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                      <button
                        onClick={() => setActiveQuotationTab('ARCHIVE')}
                        className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                          activeQuotationTab === 'ARCHIVE'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>سجل العروض</span>
                      </button>

                      <button
                        onClick={() => setActiveQuotationTab('PREVIEW')}
                        className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                          activeQuotationTab === 'PREVIEW'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة الطباعة (A4)</span>
                      </button>
                    </div>

                    <UnifiedExportButton
                      onExportExcel={handleExportQuotationsCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير سجل عروض الأسعار Excel"
                      pdfLabel="طباعة سجل العروض PDF"
                    />

                    <button
                      onClick={handleOpenNewQuotation}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إنشاء عرض سعر</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar & Filters */}
                {activeQuotationTab === 'ARCHIVE' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center">
                    <div className="md:col-span-5 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="بحث باسم العميل، رقم العرض، أو موضوع العرض..."
                        value={quotationSearchQuery}
                        onChange={(e) => setQuotationSearchQuery(e.target.value)}
                        className="w-full pr-10 pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                      />
                      {quotationSearchQuery && (
                        <button
                          onClick={() => setQuotationSearchQuery('')}
                          className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
                          title="مسح حقل البحث"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Division Switcher */}
                    <div className="md:col-span-4 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 ml-1">القسم:</span>
                      <button
                        onClick={() => setQuotationDivisionFilter('WOOD')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          quotationDivisionFilter === 'WOOD'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        النجارة ({quotations.filter((q) => q.divisionId === 'WOOD').length})
                      </button>
                      <button
                        onClick={() => setQuotationDivisionFilter('ALUMINUM')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          quotationDivisionFilter === 'ALUMINUM'
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        الألمنيوم ({quotations.filter((q) => q.divisionId === 'ALUMINUM').length})
                      </button>
                      <button
                        onClick={() => setQuotationDivisionFilter('ALL')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                          quotationDivisionFilter === 'ALL'
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        الكل ({quotations.length})
                      </button>
                    </div>

                    {/* Status Filter */}
                    <div className="md:col-span-3 flex justify-end">
                      <select
                        value={quotationStatusFilter}
                        onChange={(e) => setQuotationStatusFilter(e.target.value as any)}
                        className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 w-full md:w-auto"
                      >
                        <option value="ALL">جميع الحالات</option>
                        <option value="APPROVED">معتمد من الشركة</option>
                        <option value="ACCEPTED">موافق عليه من العميل</option>
                        <option value="CONVERTED_TO_CONTRACT">محول لعقد ساري</option>
                        <option value="DRAFT">مسودة غير معتمدة</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* ----------------- SUB-VIEW 1: QUOTATIONS ARCHIVE TABLE ----------------- */}
              {activeQuotationTab === 'ARCHIVE' && (
                <div className="space-y-5">
                  {/* KPI Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-xs font-bold text-slate-500">إجمالي عروض الأسعار المسجلة</span>
                      <div className="my-2">
                        <span className="text-3xl font-black font-mono text-slate-900">{filteredQuotations.length}</span>
                        <span className="text-xs text-slate-400 mr-1 font-bold">عرض</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        موزعة: {quotations.filter((q) => q.divisionId === 'WOOD').length} نجارة | {quotations.filter((q) => q.divisionId === 'ALUMINUM').length} ألمنيوم
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-xs font-bold text-emerald-700">عروض معتمدة وموافق عليها</span>
                      <div className="my-2">
                        <span className="text-3xl font-black font-mono text-emerald-600">
                          {quotations.filter((q) => q.status === 'APPROVED' || q.status === 'ACCEPTED').length}
                        </span>
                        <span className="text-xs text-emerald-600/80 mr-1 font-bold">عرض معتمد</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 pt-2 border-t border-slate-100">
                        جاهزة للتحويل وتوقيع العقود المباشرة
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-xs font-bold text-blue-700">عروض تحولت لعقود سارية</span>
                      <div className="my-2">
                        <span className="text-3xl font-black font-mono text-blue-600">
                          {quotations.filter((q) => q.status === 'CONVERTED_TO_CONTRACT').length}
                        </span>
                        <span className="text-xs text-blue-600/80 mr-1 font-bold">عقد ملزم</span>
                      </div>
                      <div className="text-[11px] text-blue-700 pt-2 border-t border-slate-100">
                        مشاريع قيد التشغيل في الورشة والموقع
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-xs font-bold text-slate-300">إجمالي القيمة التقديرية للعروض</span>
                      <div className="my-2">
                        <span className="text-lg font-black font-mono text-emerald-400">
                          {filteredQuotations
                            .reduce((acc, q) => acc.add(new PreciseMoney(q.grandTotal)), PreciseMoney.zero())
                            .formatIQD()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        حجم الفرص والمبيعات المطروحة
                      </div>
                    </div>
                  </div>

                  {/* Saved Quotations Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-800">سجل عروض الأسعار المحفوظة باسم العميل</h3>
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                          {filteredQuotations.length}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        انقر على «تحويل إلى عقد» لتحويل العرض الموافق عليه إلى عقد عمل ومستند رسمي فوري
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold">
                            <th className="p-3.5 w-10 text-center">تفاصيل</th>
                            <th className="p-3.5">رقم العرض</th>
                            <th className="p-3.5">اسم العميل وجهة الطلب</th>
                            <th className="p-3.5">القسم</th>
                            <th className="p-3.5">القيمة الإجمالية</th>
                            <th className="p-3.5">تاريخ العرض والصلاحية</th>
                            <th className="p-3.5">الحالة</th>
                            <th className="p-3.5 text-center w-20">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredQuotations.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400">
                                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                <p className="font-bold text-slate-700 text-sm">لا توجد عروض أسعار مطابقة للبحث أو التصفية</p>
                                <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو أنشئ عرض سعر جديد</p>
                                <button
                                  onClick={() => {
                                    setQuotationSearchQuery('');
                                    setQuotationDivisionFilter('ALL');
                                    setQuotationStatusFilter('ALL');
                                  }}
                                  className="mt-3 text-emerald-600 hover:text-emerald-700 font-bold underline inline-block"
                                >
                                  إعادة ضبط الفلاتر
                                </button>
                              </td>
                            </tr>
                          ) : (
                            filteredQuotations.map((q, index) => {
                              const isExpanded = expandedQuotationIds.includes(q.id);
                              const imageCount = (q.images || []).length;
                              const isConverted = q.status === 'CONVERTED_TO_CONTRACT';

                              return (
                                <React.Fragment key={q.id}>
                                  <tr className={`transition relative hover:z-30 ${isExpanded ? 'bg-emerald-50/30' : 'hover:bg-slate-50/80'}`}>
                                    {/* Expand / Collapse Toggle Arrow */}
                                    <td className="p-3.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandQuotation(q.id)}
                                        className={`p-1.5 rounded-lg border transition ${
                                          isExpanded
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                                        }`}
                                        title={isExpanded ? 'طي تفاصيل العرض والمرفقات' : 'إظهار موضوع العرض والمرفقات والبنود'}
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="w-4 h-4 text-emerald-700" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-slate-600" />
                                        )}
                                      </button>
                                    </td>

                                    {/* Quotation Number & Subtle Indicators */}
                                    <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                                      <div>{q.quotationNumber}</div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          {q.lines.length} بنود
                                        </span>
                                        {imageCount > 0 && (
                                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                            <ImageIcon className="w-2.5 h-2.5" />
                                            <span>{imageCount} صور</span>
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    {/* Customer Name & Phone */}
                                    <td className="p-3.5">
                                      <p className="font-bold text-slate-900">{q.customerName}</p>
                                      <p className="text-[11px] text-slate-500 font-mono">{q.customerPhone || 'بدون هاتف'}</p>
                                    </td>

                                    {/* Division Badge */}
                                    <td className="p-3.5 whitespace-nowrap">
                                      {q.divisionId === 'WOOD' ? (
                                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                                          النجارة والديكور
                                        </span>
                                      ) : (
                                        <span className="bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                                          الألمنيوم والواجهات
                                        </span>
                                      )}
                                    </td>

                                    {/* Grand Total */}
                                    <td className="p-3.5 font-mono font-black text-slate-900 whitespace-nowrap">
                                      {new PreciseMoney(q.grandTotal).formatIQD()}
                                    </td>

                                    {/* Date & Validity */}
                                    <td className="p-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                      <p>{q.date}</p>
                                      <p className="text-slate-400 text-[10px]">ينتهي: {q.validUntil}</p>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-3.5 whitespace-nowrap">
                                      {isConverted ? (
                                        <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                          <FileSignature className="w-3 h-3" />
                                          محول لعقد: {q.contractNumber || 'ساري'}
                                        </span>
                                      ) : q.status === 'ACCEPTED' ? (
                                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                          <Check className="w-3 h-3" />
                                          موافق عليه من العميل
                                        </span>
                                      ) : q.status === 'APPROVED' ? (
                                        <span className="bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                          <ShieldCheck className="w-3 h-3" />
                                          معتمد من الإدارة
                                        </span>
                                      ) : (
                                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                                          مسودة
                                        </span>
                                      )}
                                    </td>

                                    {/* Actions (Hover-triggered Gear Menu) */}
                                    <td className="p-3.5 text-center whitespace-nowrap relative">
                                      <ActionGearMenu
                                        title="إجراءات عرض السعر"
                                        dropUp={filteredQuotations.length > 2 && index >= filteredQuotations.length - 2}
                                        items={[
                                          {
                                            id: 'preview',
                                            label: 'معاينة الوثيقة والطباعة A4',
                                            description: 'عرض النموذج المطبوع وتصدير PDF',
                                            icon: <Eye className="w-4 h-4" />,
                                            variant: 'default',
                                            onClick: () => {
                                              setSelectedQuotation(q);
                                              setActiveQuotationTab('PREVIEW');
                                            },
                                          },
                                          {
                                            id: 'edit',
                                            label: 'تعديل وتحرير بيانات العرض',
                                            description: 'تعديل بنود الأسعار والمخططات والخصم',
                                            icon: <Edit3 className="w-4 h-4" />,
                                            variant: 'primary',
                                            onClick: () => handleOpenEditQuotation(q),
                                          },
                                          !isConverted
                                            ? {
                                                id: 'convert',
                                                label: 'تحويل العرض لعقد رسمي',
                                                description: 'توليد عقد رسمي ملزم وتوقيعه للعمل',
                                                icon: <FileSignature className="w-4 h-4" />,
                                                variant: 'success',
                                                onClick: () => handleConvertToContract(q),
                                              }
                                            : {
                                                id: 'view-contract',
                                                label: 'عرض وثيقة العقد المعتمد',
                                                description: 'معاينة وتوقيع العقد الرسمي المنشأ',
                                                icon: <ExternalLink className="w-4 h-4" />,
                                                variant: 'primary',
                                                onClick: () => {
                                                  const cnt = contracts.find(
                                                    (c) => c.id === q.contractId || c.contractNumber === q.contractNumber
                                                  );
                                                  if (cnt) {
                                                    setActiveContract(cnt);
                                                    setIsContractModalOpen(true);
                                                  } else {
                                                    handleConvertToContract(q);
                                                  }
                                                },
                                              },
                                          {
                                            id: 'toggle-details',
                                            label: isExpanded
                                              ? 'طي تفاصيل العرض والمرفقات'
                                              : 'إظهار موضوع العرض والمخططات',
                                            description: 'صور الديكور والمخططات وجدول البنود',
                                            icon: isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />,
                                            badge: `${q.lines.length} بنود`,
                                            onClick: () => toggleExpandQuotation(q.id),
                                          },
                                          {
                                            id: 'delete',
                                            label: 'حذف عرض السعر',
                                            description: 'حذف العرض نهائياً من الأرشيف',
                                            icon: <Trash2 className="w-4 h-4" />,
                                            variant: 'danger',
                                            onClick: () => handleDeleteQuotation(q.id, q.quotationNumber),
                                          },
                                        ]}
                                      />
                                    </td>
                                  </tr>

                                  {/* COLLAPSIBLE ROW: SUBJECT, ATTACHMENTS GALLERY & ITEMIZED BOQ TABLE */}
                                  {isExpanded && (
                                    <tr className="bg-slate-50/70 border-b-2 border-slate-200 animate-in fade-in duration-150">
                                      <td colSpan={8} className="p-4 sm:p-5">
                                        <div className="space-y-4">
                                          {/* Drawer Top Header Bar */}
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                            <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                              <h4 className="text-xs font-black text-slate-900">
                                                لوحة التفاصيل الكاملة والمرفقات الهندسية لعرض السعر [{q.quotationNumber}] - العميل:{' '}
                                                <strong className="text-slate-900">{q.customerName}</strong>
                                              </h4>
                                              <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                  q.divisionId === 'WOOD' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                                                }`}
                                              >
                                                {q.divisionId === 'WOOD' ? 'قسم النجارة والديكور' : 'قسم الألمنيوم والواجهات'}
                                              </span>
                                              {isConverted && (
                                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                  عقد معتمد: {q.contractNumber || 'ساري'}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setSelectedQuotation(q);
                                                  setActiveQuotationTab('PREVIEW');
                                                }}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                                              >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>معاينة وثيقة A4 والطباعة</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => handleOpenEditQuotation(q)}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                                              >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>تعديل العرض والمخططات</span>
                                              </button>

                                              {!isConverted ? (
                                                <button
                                                  type="button"
                                                  onClick={() => handleConvertToContract(q)}
                                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                                                >
                                                  <FileSignature className="w-3.5 h-3.5" />
                                                  <span>تحويل العرض لعقد رسمي</span>
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const cnt = contracts.find(
                                                      (c) => c.id === q.contractId || c.contractNumber === q.contractNumber
                                                    );
                                                    if (cnt) {
                                                      setActiveContract(cnt);
                                                      setIsContractModalOpen(true);
                                                    } else {
                                                      handleConvertToContract(q);
                                                    }
                                                  }}
                                                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                                                >
                                                  <ExternalLink className="w-3.5 h-3.5" />
                                                  <span>عرض وثيقة العقد</span>
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          {/* 1. موضوع العرض ونطاق العمل والشروط التعاقدية (Moved from top table) */}
                                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                              <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-emerald-600" />
                                                <h5 className="font-black text-slate-900 text-xs">موضوع العرض ونطاق العمل المعتمد</h5>
                                              </div>
                                              <span className="text-[11px] text-slate-400">
                                                صالح لغاية: {q.validUntil} (تاريخ التحرير: {q.date})
                                              </span>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                              <p className="font-bold text-slate-900 text-sm leading-relaxed">
                                                {q.subject || 'عرض سعر أعمال وتجهيز معماري وصناعي'}
                                              </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                                              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 space-y-1">
                                                <span className="font-bold text-slate-700 block">شروط الدفع وجدول الدفعات:</span>
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                  {q.paymentTerms || '50% دفعة مقدمة، 40% عند اكتمال التصنيع، 10% عند التسليم والتركيب.'}
                                                </p>
                                              </div>

                                              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 space-y-1">
                                                <span className="font-bold text-slate-700 block">فترة الضمان والصيانة والملاحظات:</span>
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                  {q.notes || 'الأسعار تشمل التوصيل والتركيب مع ضمان صيانة لمدة 12 شهراً ضد عيوب التصنيع.'}
                                                </p>
                                              </div>
                                            </div>
                                          </div>

                                          {/* 2. معرض المرفقات والمخططات الهندسية وصور الديكورات (Moved from top table) */}
                                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                              <div className="flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-emerald-600" />
                                                <h5 className="font-black text-slate-900 text-xs">
                                                  المرفقات، صور الديكورات 3D، والمخططات المعمارية المعتمدة
                                                </h5>
                                                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                  {imageCount} مرفقات
                                                </span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => handleOpenEditQuotation(q)}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
                                              >
                                                + إضافة / تعديل المخططات
                                              </button>
                                            </div>

                                            {imageCount === 0 ? (
                                              <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                <p className="font-bold text-slate-700 text-xs">لا توجد صور أو مخططات مرفقة بهذا العرض حالياً</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                  يمكنك رفع مناظير 3D ومخططات كروكي لتظهر في ملحق الورقة الثانية A4
                                                </p>
                                                <button
                                                  type="button"
                                                  onClick={() => handleOpenEditQuotation(q)}
                                                  className="mt-2.5 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                                                >
                                                  + رفع صور ومخططات
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                {q.images!.map((img, idx) => (
                                                  <div
                                                    key={img.id || idx}
                                                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
                                                  >
                                                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                                                      <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                      />
                                                      <span className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                                        {img.type === 'DECOR' ? '🎨 ديكور 3D' : '📐 مخطط كروكي'}
                                                      </span>
                                                    </div>
                                                    <div className="p-2.5 space-y-1">
                                                      <p className="font-bold text-slate-900 text-xs truncate" title={img.name}>
                                                        {img.name}
                                                      </p>
                                                      {img.notes && (
                                                        <p className="text-[10px] text-slate-500 line-clamp-2" title={img.notes}>
                                                          {img.notes}
                                                        </p>
                                                      )}
                                                      <span className="text-[9px] text-slate-400 block font-mono">
                                                        {img.uploadedAt || q.date}
                                                      </span>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          {/* 3. جدول بنود الأعمال والمواصفات والكميات والأسعار (BOQ) */}
                                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                              <div className="flex items-center gap-2">
                                                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                                <h5 className="font-black text-slate-900 text-xs">
                                                  تفاصيل بنود الأعمال والكميات والأسعار المعتمدة (Bill of Quantities)
                                                </h5>
                                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                  {q.lines.length} بنود
                                                </span>
                                              </div>
                                              <span className="text-[11px] text-slate-400 font-mono">
                                                المجموع: {new PreciseMoney(q.grandTotal).formatIQD()}
                                              </span>
                                            </div>

                                            <div className="overflow-x-auto">
                                              <table className="w-full text-right border-collapse text-xs">
                                                <thead>
                                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                                    <th className="p-2.5 text-center w-10">#</th>
                                                    <th className="p-2.5">بيان الأعمال والمواصفات الفنية التفصيلية</th>
                                                    <th className="p-2.5 text-center w-20">الكمية</th>
                                                    <th className="p-2.5 text-center w-20">الوحدة</th>
                                                    <th className="p-2.5 text-left font-mono w-32">سعر الوحدة</th>
                                                    <th className="p-2.5 text-left font-mono w-36">إجمالي البند</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                  {q.lines.map((line, lIdx) => (
                                                    <tr key={line.id || lIdx} className="hover:bg-slate-50">
                                                      <td className="p-2.5 text-center font-mono font-bold text-slate-500">
                                                        {lIdx + 1}
                                                      </td>
                                                      <td className="p-2.5 font-semibold text-slate-800 leading-relaxed">
                                                        {line.description}
                                                      </td>
                                                      <td className="p-2.5 text-center font-bold text-slate-800 font-mono">
                                                        {line.quantity}
                                                      </td>
                                                      <td className="p-2.5 text-center text-slate-600 font-medium">
                                                        {line.unit}
                                                      </td>
                                                      <td className="p-2.5 text-left font-mono text-slate-700">
                                                        {new PreciseMoney(line.unitPrice).formatIQD()}
                                                      </td>
                                                      <td className="p-2.5 text-left font-mono font-black text-emerald-700">
                                                        {new PreciseMoney(line.lineTotal).formatIQD()}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                                <tfoot>
                                                  {Number(q.discountTotal || 0) > 0 && (
                                                    <tr className="bg-slate-50 text-slate-700 font-semibold border-t border-slate-200">
                                                      <td colSpan={5} className="p-2.5 text-left">قيمة الخصم الممنوح:</td>
                                                      <td className="p-2.5 text-left font-mono text-amber-700 font-bold">
                                                        -{new PreciseMoney(q.discountTotal).formatIQD()}
                                                      </td>
                                                    </tr>
                                                  )}
                                                  <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-black text-slate-900">
                                                    <td colSpan={5} className="p-2.5 text-left">
                                                      المبلغ الإجمالي النهائي لعرض السعر:
                                                    </td>
                                                    <td className="p-2.5 text-left font-mono text-emerald-800 font-black text-sm">
                                                      {new PreciseMoney(q.grandTotal).formatIQD()}
                                                    </td>
                                                  </tr>
                                                </tfoot>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW 2: MULTI-PAGE PRINT PREVIEW (A4) ----------------- */}
              {activeQuotationTab === 'PREVIEW' && selectedQuotation && (
                <div className="space-y-6">
                  {/* Print & Page Controls Toolbar */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveQuotationTab('ARCHIVE')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>العودة لسجل العروض</span>
                      </button>

                      <div className="h-5 w-px bg-slate-200"></div>

                      <span className="text-xs font-bold text-slate-700">
                        عرض: <span className="font-mono text-emerald-700">{selectedQuotation.quotationNumber}</span> — {selectedQuotation.customerName}
                      </span>
                    </div>

                    {/* Multi-page Page Navigation */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      <span className="text-[11px] text-slate-500 px-2">صفحات الوثيقة:</span>
                      <button
                        onClick={() => setActivePrintPage('ALL_PAGES')}
                        className={`px-3 py-1 rounded-lg transition ${
                          activePrintPage === 'ALL_PAGES'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        كافة الصفحات (للطباعة)
                      </button>

                      <button
                        onClick={() => setActivePrintPage('PAGE_1')}
                        className={`px-3 py-1 rounded-lg transition ${
                          activePrintPage === 'PAGE_1'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ورقة 1: جدول البنود والأسعار
                      </button>

                      <button
                        onClick={() => setActivePrintPage('PAGE_2')}
                        className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                          activePrintPage === 'PAGE_2'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>ورقة 2: ملحق الصور والمخططات ({(selectedQuotation.images || []).length})</span>
                      </button>
                    </div>

                    {/* Print & Action Buttons */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedQuotation.printShowItemized}
                          onChange={(e) => {
                            const updated = { ...selectedQuotation, printShowItemized: e.target.checked };
                            setSelectedQuotation(updated);
                            setQuotations(quotations.map((q) => (q.id === updated.id ? updated : q)));
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>إظهار الأسعار التفصيلية للبنود</span>
                      </label>

                      <button
                        onClick={() => handleOpenEditQuotation(selectedQuotation)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تحرير وتعديل</span>
                      </button>

                      {selectedQuotation.status !== 'CONVERTED_TO_CONTRACT' && (
                        <button
                          onClick={() => handleConvertToContract(selectedQuotation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                          <span>تحويل إلى عقد وتوقيعه</span>
                        </button>
                      )}

                      <button
                        onClick={() => window.print()}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                      >
                        <Printer className="w-4 h-4" />
                        <span>طباعة العرض (A4)</span>
                      </button>
                    </div>
                  </div>

                  {/* ----------------- PAGE 1: OFFICIAL QUOTATION PAPER ----------------- */}
                  {(activePrintPage === 'ALL_PAGES' || activePrintPage === 'PAGE_1') && (
                    <div className="bg-white border border-slate-300 rounded-2xl p-10 max-w-4xl mx-auto shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:w-full multi-page-doc">
                      {/* Document Header */}
                      <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                        {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                        <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                          <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                            شركة نوك للديكور الداخلي والألمنيوم
                          </h2>
                          <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                            NOAK WOOD & ALUMINUM INDUSTRIES
                          </p>
                          <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                            كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                          </p>
                          <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                            أرقام التواصل: 07800000000 - 07700000000
                          </p>
                        </div>

                        {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                        <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                          <img
                            src={noakLogo}
                            alt="شركة نوك للديكور الداخلي والألمنيوم"
                            className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                          />
                        </div>

                        {/* Left: Metadata */}
                        <div className="text-left font-mono flex-1 min-w-0 pl-1">
                          <span className="bg-slate-900 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                            عرض سعر رسمي (QUOTATION)
                          </span>
                          <p className="text-xs print:text-[10px] font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                            رقم: {selectedQuotation.quotationNumber}
                          </p>
                          <p className="text-[11px] print:text-[9px] text-slate-600 whitespace-nowrap">
                            التاريخ: {selectedQuotation.date}
                          </p>
                          <p className="text-[11px] print:text-[9px] text-slate-600 whitespace-nowrap">
                            صلاحية العرض حتى: {selectedQuotation.validUntil}
                          </p>
                          <span className="text-[10px] print:text-[8.5pt] font-bold mt-1 inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 whitespace-nowrap">
                            {selectedQuotation.divisionId === 'WOOD' ? 'قسم النجارة والديكور' : 'قسم الألمنيوم والواجهات'}
                          </span>
                        </div>
                      </div>

                      {/* Client Info & Scope Box (مطابق لسند القبض) */}
                      <div className="bg-slate-50 p-4 print:p-2 rounded-xl border border-slate-200 mb-6 print:mb-3 text-xs grid grid-cols-2 gap-3 print:gap-2 voucher-card">
                        <div>
                          <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">اسم العميل / الجهة الطالبة:</span>
                          <p className="font-black text-slate-900 text-sm print:text-xs">{selectedQuotation.customerName}</p>
                          <p className="text-slate-600 mt-0.5 print:text-[10px] font-mono">الهاتف: {selectedQuotation.customerPhone || 'غير مدخل'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">عنوان العميل:</span>
                          <p className="font-bold text-slate-800 text-sm print:text-xs">{selectedQuotation.customerAddress || 'كربلاء المقدسة - العراق'}</p>
                          <p className="text-slate-600 mt-0.5 print:text-[10px]">
                            <span className="text-slate-400">موضوع العرض: </span>
                            <span className="font-bold text-slate-800">{selectedQuotation.subject || 'تجهيز أعمال ديكور ومقاطع هندسية'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Items & Lines Table */}
                      <table className="w-full text-right border-collapse border border-slate-300 text-xs mb-6 print:mb-3">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                            <th className="p-3 print:p-1.5 border-l border-slate-300 w-10 text-center">#</th>
                            <th className="p-3 print:p-1.5 border-l border-slate-300">وصف البند والمواصفات الفنية التفصيلية</th>
                            <th className="p-3 print:p-1.5 border-l border-slate-300 text-center w-16">الكمية</th>
                            <th className="p-3 print:p-1.5 border-l border-slate-300 text-center w-20">الوحدة</th>
                            {selectedQuotation.printShowItemized && (
                              <>
                                <th className="p-3 print:p-1.5 border-l border-slate-300 text-left w-28">السعر الإفرادي</th>
                                <th className="p-3 print:p-1.5 text-left w-32">الإجمالي (د.ع)</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {selectedQuotation.lines.map((line, idx) => (
                            <tr key={line.id || idx}>
                              <td className="p-3 print:p-1.5 border-l border-slate-300 text-center font-mono font-bold text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="p-3 print:p-1.5 border-l border-slate-300 font-bold text-slate-800">
                                {line.description}
                              </td>
                              <td className="p-3 print:p-1.5 border-l border-slate-300 text-center font-mono font-bold">
                                {line.quantity}
                              </td>
                              <td className="p-3 print:p-1.5 border-l border-slate-300 text-center text-slate-600">
                                {line.unit}
                              </td>
                              {selectedQuotation.printShowItemized && (
                                <>
                                  <td className="p-3 print:p-1.5 border-l border-slate-300 text-left font-mono font-bold text-slate-700">
                                    {new PreciseMoney(line.unitPrice).formatIQD()}
                                  </td>
                                  <td className="p-3 print:p-1.5 text-left font-mono font-black text-slate-900">
                                    {new PreciseMoney(line.lineTotal).formatIQD()}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Grand Totals Box */}
                      <div className="bg-slate-900 text-white p-4 print:p-2.5 rounded-xl mb-6 print:mb-3 flex flex-col md:flex-row justify-between items-center gap-3 print-avoid-break">
                        <div>
                          <span className="text-xs print:text-[10px] text-slate-300 block">المبلغ الإجمالي النهائي لعرض السعر:</span>
                          <span className="text-xs print:text-[9pt] text-slate-400">
                            {parseFloat(selectedQuotation.discountTotal) > 0 &&
                              `يشمل خصماً خاصاً قدره ${new PreciseMoney(selectedQuotation.discountTotal).formatIQD()}`}
                          </span>
                        </div>
                        <span className="text-2xl print:text-lg font-black text-emerald-400 font-mono">
                          {new PreciseMoney(selectedQuotation.grandTotal).formatIQD()}
                        </span>
                      </div>

                      {/* Commercial Terms & Notes */}
                      <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200 text-xs mb-8 print:mb-3 space-y-2 print-avoid-break">
                        <p>
                          <strong>شروط الدفع والتسليم:</strong>{' '}
                          {selectedQuotation.paymentTerms || '50% دفعة مقدمة عند التوقيع، 40% عند اكتمال التصنيع، 10% عند التسليم النهائي والتركيب.'}
                        </p>
                        <p>
                          <strong>الضمان والملاحظات:</strong>{' '}
                          {selectedQuotation.notes || 'الأسعار شاملة التوصيل والتركيب، مع ضمان صيانة لمدة سنة كاملة ضد عيوب التصنيع.'}
                        </p>
                      </div>

                      {/* Official Signatures */}
                      <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-700 pt-6 print:pt-3 border-t border-slate-200 print-avoid-break">
                        <div>
                          <p className="font-bold mb-8 print:mb-4">اعتماد وموافقة العميل / الجهة الطالبة:</p>
                          <p className="text-slate-400">التوقيع والختم: ....................................</p>
                        </div>
                        <div>
                          <p className="font-bold mb-8 print:mb-4">إدارة شركة نوك للديكور الداخلي والألمنيوم:</p>
                          <p className="text-slate-400">الختم الرسمي والاعتماد الفني</p>
                        </div>
                      </div>

                      {/* Sheet 1 Footer */}
                      <div className="mt-8 print:mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                        <span>نظام NOAK ERP — وثيقة عرض سعر معتمدة</span>
                        <span>ورقة 1 من 2 (وثيقة العرض المالي والفني)</span>
                      </div>
                    </div>
                  )}

                  {/* ----------------- PAGE 2: ATTACHED DECOR PHOTOS & BLUEPRINTS ----------------- */}
                  {(activePrintPage === 'ALL_PAGES' || activePrintPage === 'PAGE_2') && (
                    <div className="bg-white border border-slate-300 rounded-2xl p-10 max-w-4xl mx-auto shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:break-before-page break-before-page page-break multi-page-doc">
                      {/* Page 2 Header */}
                      <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                        {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                        <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                          <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                            شركة نوك للديكور الداخلي والألمنيوم
                          </h2>
                          <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                            NOAK WOOD & ALUMINUM INDUSTRIES
                          </p>
                          <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                            كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                          </p>
                          <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                            أرقام التواصل: 07800000000 - 07700000000
                          </p>
                        </div>

                        {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                        <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                          <img
                            src={noakLogo}
                            alt="شركة نوك للديكور الداخلي والألمنيوم"
                            className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                          />
                        </div>

                        {/* Left: Metadata */}
                        <div className="text-left font-mono flex-1 min-w-0 pl-1">
                          <span className="bg-emerald-800 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                            ملحق المخططات والصور
                          </span>
                          <p className="text-xs print:text-[10px] font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                            تابع لعرض: {selectedQuotation.quotationNumber}
                          </p>
                          <p className="text-[11px] print:text-[9px] text-slate-600 whitespace-nowrap truncate max-w-[200px]" title={selectedQuotation.customerName}>
                            العميل: {selectedQuotation.customerName}
                          </p>
                        </div>
                      </div>

                      {/* Images Grid or Empty State */}
                      {(!selectedQuotation.images || selectedQuotation.images.length === 0) ? (
                        <div className="p-12 print:p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 print-avoid-break">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-slate-700 text-sm">لا توجد صور ديكورات أو مخططات مرفقة بهذا العرض حالياً</p>
                          <p className="text-xs text-slate-400 mt-1">
                            يمكنك النقر على زر «تحرير وتعديل» أعلاه لتحميل صور المناظير 3D والمخططات الهندسية فوراً
                          </p>
                          <button
                            onClick={() => handleOpenEditQuotation(selectedQuotation)}
                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm no-print"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>رفع صور ومخططات لهذا العرض</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4 mb-8 print:mb-4">
                          {selectedQuotation.images.map((img, idx) => (
                            <div
                              key={img.id || idx}
                              className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between shadow-sm print:shadow-none print-avoid-break"
                            >
                              <div className="relative aspect-video bg-slate-200 overflow-hidden flex items-center justify-center">
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as any).src =
                                      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                  {img.type === 'DECOR' ? '🎨 منظور ديكور 3D' : '📐 مخطط كروكي معتمد'}
                                </span>
                              </div>
                              <div className="p-3.5 bg-white border-t border-slate-200 text-xs">
                                <h4 className="font-bold text-slate-800">{img.name}</h4>
                                <p className="text-slate-500 text-[11px] mt-1">{img.notes || 'تصميم ومخطط تنفيذي معتمد للمشروع'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Technical Approval Box */}
                      <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center mb-8 print:mb-4 print-avoid-break">
                        <div>
                          <p className="font-bold text-slate-800">ملاحظة التدقيق الهندسي والمعماري:</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            المخططات والتصاميم المرفقة أعلاه ملزمة في مرحلة التصنيع بالورشة ومطابقة لجدول الكميات والمواصفات بالورقة الأولى.
                          </p>
                        </div>
                        <div className="text-center font-bold text-slate-700 pl-4 border-r border-slate-200">
                          <p>ختم الاعتماد الفني</p>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded block mt-1">مطابق للمواصفات</span>
                        </div>
                      </div>

                      {/* Sheet 2 Footer */}
                      <div className="mt-8 print:mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                        <span>نظام NOAK ERP — وثيقة عرض سعر معتمدة</span>
                        <span>ورقة 2 من 2 (ملحق المخططات والمناظير ثلاثية الأبعاد)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVENTORY & BATCHES & PURCHASING */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Feedback Alert */}
              {inventoryFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">{inventoryFeedback}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInventoryFeedback(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TOP CARD: SEARCH, FILTER, KPI METRICS & ADD PURCHASE INVOICE */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-xs">
                        <Boxes className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-800">
                          المستودعات والمخزون
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Add Invoice Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <UnifiedExportButton
                      onExportExcel={handleExportInventoryCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير كشف المستودعات Excel"
                      pdfLabel="طباعة كشف المستودعات PDF"
                    />

                    <button
                      type="button"
                      onClick={handleOpenNewPurchaseInvoice}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ إضافة فاتورة مشتريات</span>
                    </button>
                  </div>
                </div>

                {/* Search & Division Switcher Row */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inventorySearchQuery}
                      onChange={(e) => setInventorySearchQuery(e.target.value)}
                      placeholder="بحث باسم المادة، كود الصنف، رقم الوجبة، أو اسم المورد..."
                      className="w-full pr-9 pl-8 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition"
                    />
                    {inventorySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setInventorySearchQuery('')}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Division Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInventoryDivisionFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        inventoryDivisionFilter === 'ALL'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>الكل</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-mono">
                        {batches.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInventoryDivisionFilter('WOOD')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        inventoryDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                      <span>قسم النجارة</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          inventoryDivisionFilter === 'WOOD'
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {batches.filter((b) => b.divisionId === 'WOOD').length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInventoryDivisionFilter('ALUMINUM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        inventoryDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                      <span>قسم الألمنيوم</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          inventoryDivisionFilter === 'ALUMINUM'
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {batches.filter((b) => b.divisionId === 'ALUMINUM').length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 4 Financial & Inventory KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {/* KPI 1: Registered Total Inventory */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/80 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-[11px] font-bold">إجمالي المواد المسجلة</span>
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-base font-black font-mono text-slate-800">
                      {totalRegisteredInventoryValue.formatIQD()}
                    </div>
                  </div>

                  {/* KPI 2: Actual Remaining Physical Stock Value */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-emerald-800 mb-1">
                      <span className="text-[11px] font-bold">المواد الموجودة فعلياً</span>
                      <PackageCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-base font-black font-mono text-emerald-900">
                      {currentActualInventoryValue.formatIQD()}
                    </div>
                  </div>

                  {/* KPI 3: Issued Value to Projects */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-amber-800 mb-1">
                      <span className="text-[11px] font-bold">المواد المصروفة للمشاريع</span>
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-base font-black font-mono text-amber-900">
                      {totalIssuedInventoryValue.formatIQD()}
                    </div>
                    <div className="text-[10px] text-amber-700 mt-1 font-medium">
                      التكلفة الفعلية للمواد المستهلكة في المشاريع
                    </div>
                  </div>

                  {/* KPI 4: Active Batches & Total Units */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-blue-800 mb-1">
                      <span className="text-[11px] font-bold">الوجبات والوحدات المتبقية</span>
                      <Layers className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-base font-black font-mono text-blue-900">
                      {scopedBatches.length} وجبة{' '}
                      <span className="text-xs font-normal text-blue-700 font-sans">
                        ({totalUnitsRemaining.toLocaleString('ar-IQ')} وحدة)
                      </span>
                    </div>
                    <div className="text-[10px] text-blue-700 mt-1 font-medium">
                      تتبع دقيق ومستمر بنظام Batch Costing
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs View Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveInventoryTab('BATCHES')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                        activeInventoryTab === 'BATCHES'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>سجل الدفعات والمخزون الفعلي</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          activeInventoryTab === 'BATCHES'
                            ? 'bg-slate-800 text-emerald-400'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {filteredBatches.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveInventoryTab('INVOICES')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                        activeInventoryTab === 'INVOICES'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>أرشيف وسجل فواتير المشتريات</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          activeInventoryTab === 'INVOICES'
                            ? 'bg-slate-800 text-emerald-400'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {filteredPurchaseInvoices.length}
                      </span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                    {activeInventoryTab === 'BATCHES'
                      ? 'عرض تفصيلي للوجبات المخزنية المسعرة بدقة'
                      : 'أرشيف فواتير التوريد مع الربط المالي لذمم الموردين'}
                  </div>
                </div>
              </div>

              {/* VIEW 1: BATCHES & PHYSICAL STOCK TABLE */}
              {activeInventoryTab === 'BATCHES' && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h3 className="text-sm font-bold text-slate-800">
                        سجل الوجبات المخزنية الموردة والمتاحة
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">({filteredBatches.length} وجبة)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIssueDestinationType('PROJECT');
                          setIssueError(null);
                          setIssueSuccess(null);
                          setIsIssueModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                        <span>صرف مباشر لمشروع</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIssueDestinationType('SHOWROOM');
                          setIssueError(null);
                          setIssueSuccess(null);
                          setIsIssueModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                        title="صرف مواد أولية لتصنيع نموذج وأصل جديد لصالة العرض"
                      >
                        <Building2 className="w-3.5 h-3.5 text-purple-700" />
                        <span>صرف لتصنيع قطعة للمعرض</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3 text-center w-10">#</th>
                          <th className="p-3">رقم الدفعة / الوجبة</th>
                          <th className="p-3">المادة والمواصفة الهندسية</th>
                          <th className="p-3">المستودع والقسم</th>
                          <th className="p-3">تاريخ الاستلام</th>
                          <th className="p-3 text-center">الكمية الواردة</th>
                          <th className="p-3 text-center">الكمية المتبقية</th>
                          <th className="p-3 text-left font-mono">تكلفة الوحدة الفعلية</th>
                          <th className="p-3 text-left font-mono">إجمالي قيمة الرصيد</th>
                          <th className="p-3 text-center">حالة الرصيد</th>
                          <th className="p-3 text-center w-24">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBatches.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="p-8 text-center text-slate-400">
                              <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="font-bold text-slate-700 text-sm">
                                لا توجد وجبات مخزنية مطابقة لمعايير البحث والفلترة
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                يمكنك إضافة فاتورة مشتريات جديدة أو تغيير فلاتر البحث أعلاه
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredBatches.map((b, idx) => {
                            const totalVal = new PreciseMoney(b.remainingQuantity).mul(new PreciseMoney(b.unitCost));
                            const isExhausted = Number(b.remainingQuantity) <= 0;
                            const isLowStock = !isExhausted && Number(b.remainingQuantity) < Number(b.initialQuantity) * 0.25;

                            // Build Gear Action Items
                            const batchActions: ActionMenuItem[] = [
                              {
                                id: `issue-${b.id}`,
                                label: 'صرف مادة من هذه الوجبة لمشروع',
                                icon: <ArrowUpRight className="w-3.5 h-3.5" />,
                                variant: 'primary',
                                disabled: isExhausted,
                                onClick: () => {
                                  setIssueBatchId(b.id);
                                  setIsIssueModalOpen(true);
                                },
                              },
                              {
                                id: `view-inv-${b.id}`,
                                label: 'عرض فاتورة المشتريات المرتبطة',
                                icon: <FileText className="w-3.5 h-3.5" />,
                                variant: 'default',
                                onClick: () => {
                                  const linkedInv = purchaseInvoices.find(
                                    (inv) => inv.id === b.purchaseInvoiceId || inv.invoiceNumber === b.purchaseInvoiceId
                                  );
                                  if (linkedInv) {
                                    handleViewPurchaseInvoice(linkedInv);
                                  } else {
                                    setInventorySearchQuery(b.batchNumber);
                                    setActiveInventoryTab('INVOICES');
                                  }
                                },
                              },
                              {
                                id: `copy-batch-${b.id}`,
                                label: 'نسخ رقم الوجبة',
                                icon: <Copy className="w-3.5 h-3.5" />,
                                onClick: () => {
                                  navigator.clipboard?.writeText(b.batchNumber);
                                  setInventoryFeedback(`تم نسخ رقم الوجبة [${b.batchNumber}] إلى الحافظة.`);
                                },
                              },
                            ];

                            return (
                              <tr key={b.id} className="hover:bg-slate-50/80 transition group">
                                <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                                <td className="p-3 font-mono font-bold text-slate-900">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold">{b.batchNumber}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    كود: {b.materialId}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-800">{b.materialNameAr}</div>
                                  {b.purchaseInvoiceId && (
                                    <span className="text-[10px] text-emerald-700 font-mono">
                                      فاتورة: {b.purchaseInvoiceId}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  {b.divisionId === 'WOOD' ? (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      مستودع النجارة
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                      مستودع الألمنيوم
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-mono text-slate-600">{b.receivedDate}</td>
                                <td className="p-3 text-center font-mono text-slate-700 font-bold">{b.initialQuantity}</td>
                                <td className="p-3 text-center">
                                  <span
                                    className={`inline-block font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                                      isExhausted
                                        ? 'bg-rose-100 text-rose-800'
                                        : isLowStock
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-emerald-100 text-emerald-900'
                                    }`}
                                  >
                                    {b.remainingQuantity}
                                  </span>
                                </td>
                                <td className="p-3 text-left font-mono font-bold text-slate-800">
                                  {new PreciseMoney(b.unitCost).formatIQD()}
                                </td>
                                <td className="p-3 text-left font-mono font-black text-slate-900">
                                  {totalVal.formatIQD()}
                                </td>
                                <td className="p-3 text-center">
                                  {isExhausted ? (
                                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                                      منتهية (0)
                                    </span>
                                  ) : isLowStock ? (
                                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                                      رصيد منخفض
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                                      متاحة ومتوفرة
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <ActionGearMenu
                                    title={`وجبة: ${b.batchNumber}`}
                                    items={batchActions}
                                    align="left"
                                    dropUp={idx >= filteredBatches.length - 2 && filteredBatches.length > 3}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 2: PURCHASE INVOICES ARCHIVE TABLE */}
              {activeInventoryTab === 'INVOICES' && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h3 className="text-sm font-bold text-slate-800">
                        أرشيف فواتير المشتريات والتوريد المخزني
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">({filteredPurchaseInvoices.length} فاتورة)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenNewPurchaseInvoice}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>فاتورة مشتريات جديدة</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3 text-center w-10">#</th>
                          <th className="p-3">رقم الفاتورة</th>
                          <th className="p-3">تاريخ الفاتورة</th>
                          <th className="p-3">المورد / جهة التوريد</th>
                          <th className="p-3">القسم والمستودع</th>
                          <th className="p-3 text-center">البنود</th>
                          <th className="p-3 text-left font-mono">الإجمالي (د.ع)</th>
                          <th className="p-3 text-left font-mono">المسدد (د.ع)</th>
                          <th className="p-3 text-left font-mono">المتبقي / الذمة (د.ع)</th>
                          <th className="p-3 text-center">طريقة الدفع</th>
                          <th className="p-3 text-center">الحالة</th>
                          <th className="p-3 text-center w-24">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPurchaseInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="p-8 text-center text-slate-400">
                              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="font-bold text-slate-700 text-sm">
                                لا توجد فواتير مشتريات مسجلة تطابق البحث
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                اضغط على زر "إضافة فاتورة مشتريات جديدة" لإدخال أول فاتورة
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredPurchaseInvoices.map((inv, idx) => {
                            const isPaid = new PreciseMoney(inv.remainingAmount).isZero();
                            const invoiceActions: ActionMenuItem[] = [
                              {
                                id: `view-voucher-${inv.id}`,
                                label: 'عرض وطباعة فاتورة الشراء (A4)',
                                icon: <Printer className="w-3.5 h-3.5" />,
                                variant: 'primary',
                                onClick: () => handleViewPurchaseInvoice(inv),
                              },
                              {
                                id: `sup-statement-${inv.id}`,
                                label: 'كشف حساب المورد والذمم',
                                icon: <Receipt className="w-3.5 h-3.5" />,
                                variant: 'default',
                                onClick: () => {
                                  const sup = contacts.find((c) => c.id === inv.supplierId || c.name === inv.supplierName);
                                  if (sup) {
                                    setSelectedContact(sup);
                                    setIsStatementModalOpen(true);
                                  } else {
                                    setContactSearchQuery(inv.supplierName);
                                    setActiveTab('customers');
                                  }
                                },
                              },
                              {
                                id: `filter-batches-${inv.id}`,
                                label: 'عرض وجبات المستودع المرتبطة',
                                icon: <Layers className="w-3.5 h-3.5" />,
                                variant: 'default',
                                onClick: () => {
                                  setInventorySearchQuery(inv.invoiceNumber);
                                  setActiveInventoryTab('BATCHES');
                                },
                              },
                              {
                                id: `copy-no-${inv.id}`,
                                label: 'نسخ رقم الفاتورة',
                                icon: <Copy className="w-3.5 h-3.5" />,
                                onClick: () => {
                                  navigator.clipboard?.writeText(inv.invoiceNumber);
                                  setInventoryFeedback(`تم نسخ رقم الفاتورة [${inv.invoiceNumber}] إلى الحافظة.`);
                                },
                              },
                            ];

                            return (
                              <tr key={inv.id} className="hover:bg-slate-50/80 transition group">
                                <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                                <td className="p-3">
                                  <div className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</div>
                                  {inv.supplierInvoiceNumber && (
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      رقم المورد: {inv.supplierInvoiceNumber}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 font-mono text-slate-600">{inv.date}</td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-800">{inv.supplierName}</div>
                                  {inv.supplierPhone && (
                                    <div className="text-[10px] text-slate-400 font-mono">{inv.supplierPhone}</div>
                                  )}
                                </td>
                                <td className="p-3">
                                  {inv.divisionId === 'WOOD' ? (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      النجارة
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                      الألمنيوم
                                    </span>
                                  )}
                                  <div className="text-[10px] text-slate-400 mt-0.5">{inv.warehouseName}</div>
                                </td>
                                <td className="p-3 text-center font-mono font-bold text-slate-700">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                                    {inv.lines.length} بنود
                                  </span>
                                </td>
                                <td className="p-3 text-left font-mono font-black text-slate-900">
                                  {new PreciseMoney(inv.grandTotal).formatIQD()}
                                </td>
                                <td className="p-3 text-left font-mono font-bold text-emerald-700">
                                  {new PreciseMoney(inv.paidAmount).formatIQD()}
                                </td>
                                <td className="p-3 text-left font-mono font-black">
                                  {isPaid ? (
                                    <span className="text-emerald-700 font-bold">0 د.ع (مسددة)</span>
                                  ) : (
                                    <span className="text-rose-700 font-bold">
                                      {new PreciseMoney(inv.remainingAmount).formatIQD()}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                                    {inv.paymentMethod === 'CASH'
                                      ? 'نقداً'
                                      : inv.paymentMethod === 'BANK'
                                      ? 'تحويل بنكي'
                                      : inv.paymentMethod === 'CHEQUE'
                                      ? 'صك'
                                      : 'آجل / ذمة'}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    معتمدة وموردة
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <ActionGearMenu
                                    title={`فاتورة: ${inv.invoiceNumber}`}
                                    items={invoiceActions}
                                    align="left"
                                    dropUp={idx >= filteredPurchaseInvoices.length - 2 && filteredPurchaseInvoices.length > 3}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GENERAL & OPERATING EXPENSES (المصروفات العامة والتشغيلية) */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              {/* Feedback Alert */}
              {expenseFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">{expenseFeedback}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpenseFeedback(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TOP CONTROL CARD: TITLE, ACTIONS, FILTERS & DATE RANGE */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-xs">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-800">
                          المصروفات العامة والتشغيلية
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* New Expense Voucher Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <UnifiedExportButton
                      onExportExcel={handleExportExpensesCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير كشف المصروفات Excel"
                      pdfLabel="طباعة كشف المصروفات PDF"
                    />

                    <button
                      type="button"
                      onClick={handleOpenNewExpense}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ تسجيل سند صرف</span>
                    </button>
                  </div>
                </div>

                {/* Division Filter & Search Row */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Division Filter Switcher */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpenseDivisionFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        expenseDivisionFilter === 'ALL'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>الكل</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-mono">
                        {expenses.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpenseDivisionFilter('WOOD')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        expenseDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                      <span>قسم النجارة</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          expenseDivisionFilter === 'WOOD'
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {expenses.filter((e) => e.divisionId === 'WOOD' || e.divisionId === 'SHARED').length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpenseDivisionFilter('ALUMINUM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        expenseDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                      <span>قسم الألمنيوم</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          expenseDivisionFilter === 'ALUMINUM'
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {expenses.filter((e) => e.divisionId === 'ALUMINUM' || e.divisionId === 'SHARED').length}
                      </span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={expenseSearchQuery}
                      onChange={(e) => setExpenseSearchQuery(e.target.value)}
                      placeholder="بحث برقم السند، البيان، اسم المستلم، أو الوصل..."
                      className="w-full pr-9 pl-8 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition"
                    />
                    {expenseSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setExpenseSearchQuery('')}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date Range Filtering Bar (من تاريخ ... إلى تاريخ ...) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>تحديد الفترة الزمنية:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">من:</span>
                      <input
                        type="date"
                        value={expenseFromDate}
                        onChange={(e) => setExpenseFromDate(e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">إلى:</span>
                      <input
                        type="date"
                        value={expenseToDate}
                        onChange={(e) => setExpenseToDate(e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {(expenseFromDate || expenseToDate) && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpenseFromDate('');
                          setExpenseToDate('');
                        }}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                        title="إلغاء فلترة التاريخ"
                      >
                        <X className="w-3 h-3" />
                        <span>مسح التاريخ</span>
                      </button>
                    )}
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 text-[11px] flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseFromDate('');
                        setExpenseToDate('');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        !expenseFromDate && !expenseToDate
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      جميع الفترات
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseFromDate('2026-02-01');
                        setExpenseToDate('2026-02-28');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        expenseFromDate === '2026-02-01' && expenseToDate === '2026-02-28'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      شهر شباط 2026
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseFromDate('2026-01-01');
                        setExpenseToDate('2026-01-31');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        expenseFromDate === '2026-01-01' && expenseToDate === '2026-01-31'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      كانون الثاني 2026
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseFromDate('2026-01-01');
                        setExpenseToDate('2026-12-31');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        expenseFromDate === '2026-01-01' && expenseToDate === '2026-12-31'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      سنة 2026 كاملة
                    </button>
                  </div>
                </div>

                {/* 6 SUMMARY METRIC CARDS (الكروت المطلوبة بدقة) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-1">
                  {/* Card 1: فواتير الكهرباء */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-amber-800 mb-1">
                      <span className="text-[11px] font-bold">فواتير الكهرباء والمولد</span>
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-base font-black font-mono text-amber-950">
                      {totalElectricityExp.formatIQD()}
                    </div>
                    <div className="text-[10px] text-amber-700 mt-1 font-semibold">
                      {filteredExpenses.filter((e) => e.category === 'ELECTRICITY').length} سندات دفع مسجلة
                    </div>
                  </div>

                  {/* Card 2: الإنترنت والاتصالات */}
                  <div className="bg-gradient-to-br from-sky-50 to-sky-100/60 border border-sky-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-sky-800 mb-1">
                      <span className="text-[11px] font-bold">الإنترنت والاتصالات</span>
                      <Wifi className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="text-base font-black font-mono text-sky-950">
                      {totalInternetExp.formatIQD()}
                    </div>
                    <div className="text-[10px] text-sky-700 mt-1 font-semibold">
                      {filteredExpenses.filter((e) => e.category === 'INTERNET').length} اشتراكات دورية
                    </div>
                  </div>

                  {/* Card 3: إيجار المعمل والورش */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-indigo-800 mb-1">
                      <span className="text-[11px] font-bold">إيجار المعمل والورش</span>
                      <Building2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-base font-black font-mono text-indigo-950">
                      {totalRentExp.formatIQD()}
                    </div>
                    <div className="text-[10px] text-indigo-700 mt-1 font-semibold">
                      عقود الإيجار التشغيلي للمقر
                    </div>
                  </div>

                  {/* Card 4: الصيانات والتشغيل */}
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100/60 border border-rose-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-rose-800 mb-1">
                      <span className="text-[11px] font-bold">الصيانات والتشغيل</span>
                      <Wrench className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-base font-black font-mono text-rose-950">
                      {totalMaintenanceExp.formatIQD()}
                    </div>
                    <div className="text-[10px] text-rose-700 mt-1 font-semibold">
                      صيانة مكائن، شفرات وقواطع
                    </div>
                  </div>

                  {/* Card 5: رواتب الموظفين الإجمالية */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-200 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-purple-800 mb-1">
                      <span className="text-[11px] font-bold">رواتب الموظفين الإجمالية</span>
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-base font-black font-mono text-purple-950">
                      {totalSalariesExp.formatIQD()}
                    </div>
                    <div className="text-[10px] text-purple-700 mt-1 font-semibold">
                      أجور كوادر النجارة والألمنيوم
                    </div>
                  </div>

                  {/* Card 6: إجمالي المصروفات العامة */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 border-2 border-emerald-300 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-emerald-800 mb-1">
                      <span className="text-[11px] font-black">إجمالي المصروفات العامة</span>
                      <Wallet className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-base font-black font-mono text-emerald-950">
                      {grandTotalGeneralExpenses.formatIQD()}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                      {filteredExpenses.length} سندات صرف ضمن الفترة
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPENSES TRANSACTIONS TABLE */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-sm font-bold text-slate-800">
                      سجل وأرشيف سندات المصروفات العامة
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">({filteredExpenses.length} سند)</span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setExpenseCategoryFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                        expenseCategoryFilter === 'ALL'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      كافة البنود
                    </button>
                    {(
                      [
                        { id: 'ELECTRICITY', label: 'الكهرباء' },
                        { id: 'INTERNET', label: 'الإنترنت' },
                        { id: 'RENT', label: 'الإيجار' },
                        { id: 'MAINTENANCE', label: 'الصيانة' },
                        { id: 'SALARIES', label: 'الرواتب' },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setExpenseCategoryFilter(c.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          expenseCategoryFilter === c.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <th className="p-3 text-center w-10">#</th>
                        <th className="p-3">رقم السند</th>
                        <th className="p-3">تاريخ الصرف</th>
                        <th className="p-3">بند المصروف</th>
                        <th className="p-3">القسم المستفيد</th>
                        <th className="p-3">المستلم / الجهة المصروف لها</th>
                        <th className="p-3 min-w-[200px]">البيان والغرض من الصرف</th>
                        <th className="p-3 text-center">طريقة الدفع</th>
                        <th className="p-3 text-left font-mono">المبلغ (د.ع)</th>
                        <th className="p-3">رقم الوصل المرجعي</th>
                        <th className="p-3 text-center w-24">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="p-8 text-center text-slate-400">
                            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-slate-700 text-sm">
                              لا توجد سندات صرف مطابقة لمعايير التاريخ والفلترة الحالية
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              يمكنك تسجيل سند صرف جديد أو توسيع نطاق الفترة الزمنية أعلاه
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map((exp, idx) => {
                          const expenseActions: ActionMenuItem[] = [
                            {
                              id: `print-exp-${exp.id}`,
                              label: 'طباعة سند الصرف الرسمي (A4)',
                              icon: <Printer className="w-3.5 h-3.5" />,
                              variant: 'primary',
                              onClick: () => handlePrintExpenseVoucher(exp),
                            },
                            {
                              id: `copy-exp-${exp.id}`,
                              label: 'نسخ رقم السند',
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard?.writeText(exp.voucherNumber);
                                setExpenseFeedback(`تم نسخ رقم السند [${exp.voucherNumber}] إلى الحافظة.`);
                              },
                            },
                          ];

                          return (
                            <tr key={exp.id} className="hover:bg-slate-50/80 transition group">
                              <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {exp.voucherNumber}
                              </td>
                              <td className="p-3 font-mono text-slate-600">{exp.date}</td>
                              <td className="p-3">
                                {exp.category === 'ELECTRICITY' && (
                                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    <Zap className="w-3 h-3 text-amber-600" />
                                    كهرباء ومولدات
                                  </span>
                                )}
                                {exp.category === 'INTERNET' && (
                                  <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    <Wifi className="w-3 h-3 text-sky-600" />
                                    إنترنت واتصالات
                                  </span>
                                )}
                                {exp.category === 'RENT' && (
                                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    <Building2 className="w-3 h-3 text-indigo-600" />
                                    إيجار المعمل والورش
                                  </span>
                                )}
                                {exp.category === 'MAINTENANCE' && (
                                  <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    <Wrench className="w-3 h-3 text-rose-600" />
                                    صيانة وتشغيل
                                  </span>
                                )}
                                {exp.category === 'SALARIES' && (
                                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    <Users className="w-3 h-3 text-purple-600" />
                                    رواتب وأجور
                                  </span>
                                )}
                                {exp.category === 'HOSPITALITY' && (
                                  <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    ضيافة ونثريات
                                  </span>
                                )}
                                {exp.category === 'FUEL_TRANSPORT' && (
                                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    وقود ونقل
                                  </span>
                                )}
                                {exp.category === 'OTHER' && (
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                                    مصروفات أخرى
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                {exp.divisionId === 'WOOD' && (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    النجارة
                                  </span>
                                )}
                                {exp.divisionId === 'ALUMINUM' && (
                                  <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-bold text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                    الألمنيوم
                                  </span>
                                )}
                                {exp.divisionId === 'SHARED' && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    مشترك (50/50)
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-bold text-slate-800">{exp.beneficiary}</td>
                              <td className="p-3 text-slate-700">{exp.notes}</td>
                              <td className="p-3 text-center">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                                  {exp.paymentMethod === 'CASH'
                                    ? 'نقداً'
                                    : exp.paymentMethod === 'BANK'
                                    ? 'تحويل بنكي'
                                    : 'صك مصرفي'}
                                </span>
                              </td>
                              <td className="p-3 text-left font-mono font-black text-slate-900">
                                {new PreciseMoney(exp.amount).formatIQD()}
                              </td>
                              <td className="p-3 font-mono text-slate-500">
                                {exp.referenceInvoiceNo || '-'}
                              </td>
                              <td className="p-3 text-center">
                                <ActionGearMenu
                                  title={`سند: ${exp.voucherNumber}`}
                                  items={expenseActions}
                                  align="left"
                                  dropUp={idx >= filteredExpenses.length - 2 && filteredExpenses.length > 3}
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASSETS & SHOWROOM MANAGEMENT (الأصول وموجودات المعرض) */}
          {(activeTab === 'assets' || (activeTab as any) === 'accounting') && (
            <div className="space-y-6">
              {/* Feedback Flash Alert */}
              {assetFeedback && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold animate-fadeIn shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{assetFeedback}</span>
                  </div>
                  <button
                    onClick={() => setAssetFeedback(null)}
                    className="text-emerald-500 hover:text-emerald-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 1. TOP CARD: HEADER & MAIN ACTIONS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">الأصول ومستودع المعرض (المواد الجاهزة)</h2>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReplenishModal()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ قطعة جاهزة للمعرض</span>
                    </button>

                    <UnifiedExportButton
                      onExportExcel={handleExportAssetsCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير كشف الأصول والمعرض Excel"
                      pdfLabel="طباعة كشف الأصول والمعرض PDF"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setIssueDestinationType('SHOWROOM');
                        setIssueError(null);
                        setIssueSuccess(null);
                        setIsIssueModalOpen(true);
                      }}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Boxes className="w-4 h-4 text-purple-200" />
                      <span>صرف مواد لقطعة بالمعرض</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenEditLumpSumsModal}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>تثبيت مبالغ الأصول</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewAssetName('');
                        setNewAssetCost('');
                        setNewAssetNotes('');
                        setNewAssetError(null);
                        setIsAddFixedAssetModalOpen(true);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Boxes className="w-3.5 h-3.5 text-slate-600" />
                      <span>+ إضافة أصل تفصيلي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPrintAssetsModalOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>طباعة الكشف</span>
                    </button>
                  </div>
                </div>

                {/* Division Filter Bar & Sub-Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200">
                  {/* Division Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span>تصفية القسم:</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setAssetDivisionFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        assetDivisionFilter === 'ALL'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>الكل</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        assetDivisionFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {showroomItems.length + fixedAssets.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssetDivisionFilter(assetDivisionFilter === 'WOOD' ? 'ALL' : 'WOOD')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        assetDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>قسم النجارة</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        assetDivisionFilter === 'WOOD' ? 'bg-amber-800 text-white' : 'bg-amber-200/90 text-amber-900'
                      }`}>
                        {showroomItems.filter(s => s.divisionId === 'WOOD').length + fixedAssets.filter(a => a.divisionId === 'WOOD').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssetDivisionFilter(assetDivisionFilter === 'ALUMINUM' ? 'ALL' : 'ALUMINUM')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        assetDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                          : 'bg-sky-50/90 text-sky-900 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span>قسم الألمنيوم والواجهات</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        assetDivisionFilter === 'ALUMINUM' ? 'bg-sky-800 text-white' : 'bg-sky-200/90 text-sky-900'
                      }`}>
                        {showroomItems.filter(s => s.divisionId === 'ALUMINUM').length + fixedAssets.filter(a => a.divisionId === 'ALUMINUM').length}
                      </span>
                    </button>
                  </div>

                  {/* Sub-Tabs Switcher */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAssetActiveSubTab('SHOWROOM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        assetActiveSubTab === 'SHOWROOM'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>مستودع المعرض (المواد الجاهزة)</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        assetActiveSubTab === 'SHOWROOM' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {showroomItems.filter(s => s.status === 'IN_SHOWROOM').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssetActiveSubTab('LUMP_SUMS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        assetActiveSubTab === 'LUMP_SUMS'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>المبالغ الثابتة للأقسام</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssetActiveSubTab('FIXED_ASSETS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        assetActiveSubTab === 'FIXED_ASSETS'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>الماكينات والتجهيزات التفصيلية</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        assetActiveSubTab === 'FIXED_ASSETS' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {fixedAssets.length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. EXECUTIVE FINANCIAL KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2 border-t border-slate-100">
                  {/* KPI 1: Fixed Lump-Sum Assets */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">1. الأصول الثابتة (مبلغ معتمد):</span>
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono mt-1 block">
                      {assetDivisionFilter === 'WOOD'
                        ? woodLumpSumPM.formatIQD()
                        : assetDivisionFilter === 'ALUMINUM'
                        ? alumLumpSumPM.formatIQD()
                        : woodLumpSumPM.add(alumLumpSumPM).add(sharedLumpSumPM).formatIQD()}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                      {assetDivisionFilter === 'WOOD'
                        ? 'ماكينات ورشة النجارة والديكور'
                        : assetDivisionFilter === 'ALUMINUM'
                        ? 'ماكينات ورشة الألمنيوم والواجهات'
                        : 'مجموع المبالغ الثابتة لكافة الأقسام'}
                    </span>
                  </div>

                  {/* KPI 2: Active Showroom Finished Goods Inventory (at Cost) */}
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-800">2. مخزون مستودع المعرض (المواد الجاهزة):</span>
                      <Store className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-base font-black text-amber-950 font-mono mt-1 block">
                      {assetDivisionFilter === 'WOOD'
                        ? activeWoodShowroomCost.formatIQD()
                        : assetDivisionFilter === 'ALUMINUM'
                        ? activeAlumShowroomCost.formatIQD()
                        : activeWoodShowroomCost.add(activeAlumShowroomCost).formatIQD()}
                    </span>
                    <span className="text-[10px] text-amber-700 mt-0.5 block truncate">
                      {showroomItems.filter(s => (assetDivisionFilter === 'ALL' || s.divisionId === assetDivisionFilter) && s.status === 'IN_SHOWROOM').length} قطع جاهزة للبيع بالكلفة الفعلية
                    </span>
                  </div>

                  {/* KPI 3: Total Assets (Fixed + Showroom Finished Goods) */}
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 ring-1 ring-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-900">3. إجمالي أصول ومخزون القسم:</span>
                      <Landmark className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="text-base font-black text-emerald-800 font-mono mt-1 block">
                      {assetDivisionFilter === 'WOOD'
                        ? totalWoodAssetsPM.formatIQD()
                        : assetDivisionFilter === 'ALUMINUM'
                        ? totalAlumAssetsPM.formatIQD()
                        : grandTotalCompanyAssetsPM.formatIQD()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block truncate">
                      الأصول الرأسمالية + المواد الجاهزة بالمعرض
                    </span>
                  </div>

                  {/* KPI 4: Realized Showroom Sales (Cash Collected to Treasury) */}
                  <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-800">4. مبيعات المعرض (المحصلة للصندوق):</span>
                      <Wallet className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="text-base font-black text-sky-950 font-mono mt-1 block">
                      {assetDivisionFilter === 'WOOD'
                        ? woodShowroomSoldRevenue.formatIQD()
                        : assetDivisionFilter === 'ALUMINUM'
                        ? alumShowroomSoldRevenue.formatIQD()
                        : woodShowroomSoldRevenue.add(alumShowroomSoldRevenue).formatIQD()}
                    </span>
                    <span className="text-[10px] text-sky-700 mt-0.5 block truncate">
                      نقدية دخلت الصندوق (استرداد الكلفة + الربح)
                    </span>
                  </div>

                  {/* KPI 5: Realized Showroom Net Profit (For Partners) */}
                  <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-800">5. صافي أرباح بيع المواد الجاهزة:</span>
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-base font-black text-indigo-950 font-mono mt-1 block">
                      {assetDivisionFilter === 'WOOD'
                        ? woodShowroomSoldProfit.formatIQD()
                        : assetDivisionFilter === 'ALUMINUM'
                        ? alumShowroomSoldProfit.formatIQD()
                        : woodShowroomSoldProfit.add(alumShowroomSoldProfit).formatIQD()}
                    </span>
                    <span className="text-[10px] text-indigo-700 font-bold mt-0.5 block truncate">
                      فائض الربح المحول لحساب أرباح الشركاء
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. MAIN CONTENT BASED ON ACTIVE SUB-TAB */}
              {assetActiveSubTab === 'SHOWROOM' && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  {/* Showroom Finished Goods Accounting Lifecycle Banner */}
                  <div className="p-3 bg-amber-50/80 border-b border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="font-bold">مستودع المعرض للمواد الجاهزة (دورة التشغيل):</span>
                        <span className="text-amber-900 font-normal mr-1">
                          سحب المواد الخام من المستودع لتصنيع المعروضات هو حركة مخزنية بحتة (دون أي قيد أو تأثير على رصيد الصندوق). تقيّد القطع المصنعة كبضاعة جاهزة للبيع بتكلفة المواد الفعلية، وعند بيعها يدخل كامل المبلغ نقداً للصندوق، وتسترد تكلفة المواد كسيولة نقدية، ويُرحل صافي الربح لأرباح القسم لتوزيعه على الشركاء.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Search & Status Filters */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-6 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="البحث باسم القطعة، الكود (SHW-)، التصنيف، أو اسم المشتري..."
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      {assetSearchQuery && (
                        <button
                          onClick={() => setAssetSearchQuery('')}
                          className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setAssetShowroomStatusFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          assetShowroomStatusFilter === 'ALL'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>كافة الحالات</span>
                        <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.2 rounded-full">
                          {showroomItems.filter(s => assetDivisionFilter === 'ALL' || s.divisionId === assetDivisionFilter).length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAssetShowroomStatusFilter('IN_SHOWROOM')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          assetShowroomStatusFilter === 'IN_SHOWROOM'
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>معروض حالياً بالمعرض</span>
                        <span className="text-[10px] font-mono bg-amber-900/30 px-1.5 py-0.2 rounded-full">
                          {showroomItems.filter(s => (assetDivisionFilter === 'ALL' || s.divisionId === assetDivisionFilter) && s.status === 'IN_SHOWROOM').length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAssetShowroomStatusFilter('SOLD')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          assetShowroomStatusFilter === 'SOLD'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>تم البيع للزبائن (محصل)</span>
                        <span className="text-[10px] font-mono bg-emerald-900/30 px-1.5 py-0.2 rounded-full">
                          {showroomItems.filter(s => (assetDivisionFilter === 'ALL' || s.divisionId === assetDivisionFilter) && s.status === 'SOLD').length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Table of Showroom Items */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-3 text-center w-12">#</th>
                          <th className="p-3 w-28">الكود</th>
                          <th className="p-3">اسم القطعة والمنتج التام</th>
                          <th className="p-3 text-center">القسم</th>
                          <th className="p-3 text-center">التصنيف</th>
                          <th className="p-3 text-left font-mono">تكلفة المواد والتصنيع (المخزون)</th>
                          <th className="p-3 text-left font-mono">سعر البيع المعروض / المحصل</th>
                          <th className="p-3 text-left font-mono">صافي الربح</th>
                          <th className="p-3 text-center">حالة البضاعة</th>
                          <th className="p-3 text-center w-28 no-print">إجراء الصندوق</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredShowroomItems.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="text-center py-12 text-slate-400">
                              <Store className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                              <p className="font-semibold text-sm">لا توجد قطع معروضة مطابقة للبحث أو الفلتر المختار</p>
                              <button
                                type="button"
                                onClick={() => handleOpenReplenishModal()}
                                className="mt-3 text-emerald-600 hover:text-emerald-700 font-bold underline inline-block"
                              >
                                + تصنيع وتوريد قطعة لمستودع المعرض الآن
                              </button>
                            </td>
                          </tr>
                        ) : (
                          filteredShowroomItems.map((item, index) => {
                            const isSold = item.status === 'SOLD';
                            const costPM = new PreciseMoney(item.productionCost);
                            const pricePM = isSold
                              ? new PreciseMoney(item.actualSalePrice || 0)
                              : new PreciseMoney(item.proposedSalePrice);
                            const profitPM = isSold
                              ? new PreciseMoney(item.netProfit || 0)
                              : pricePM.sub(costPM);

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                                <td className="p-3 text-center font-mono text-slate-400 font-semibold">{index + 1}</td>
                                <td className="p-3 font-mono font-bold text-slate-700">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    {item.itemCode}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                    {item.nameAr}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                    {item.dimensions && <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono">{item.dimensions}</span>}
                                    {item.notes && <span className="truncate max-w-[250px]">{item.notes}</span>}
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  {item.divisionId === 'WOOD' ? (
                                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                                      نجارة وخشب
                                    </span>
                                  ) : (
                                    <span className="bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                                      ألمنيوم وواجهات
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center text-slate-600 font-semibold text-[11px]">
                                  {item.category}
                                </td>
                                <td className="p-3 text-left font-mono font-bold text-slate-800">
                                  {costPM.formatIQD()}
                                </td>
                                <td className="p-3 text-left font-mono font-bold text-slate-900">
                                  {pricePM.formatIQD()}
                                  {!isSold && (
                                    <span className="text-[10px] text-slate-400 block font-sans font-normal">(مقترح)</span>
                                  )}
                                </td>
                                <td className="p-3 text-left font-mono font-bold">
                                  {isSold ? (
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      +{profitPM.formatIQD()}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-normal">
                                      +{profitPM.formatIQD()} (متوقع)
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  {isSold ? (
                                    <div className="flex flex-col items-center">
                                      <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                        <Check className="w-3 h-3 text-sky-600" />
                                        تم البيع والتحصيل
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-sans mt-0.5">
                                        {item.buyerName || 'عميل نقدي'}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                      <Store className="w-3 h-3 text-emerald-600" />
                                      بضاعة جاهزة بالمعرض
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-center no-print">
                                  {!isSold ? (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenSellShowroomItem(item)}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 mx-auto"
                                    >
                                      <DollarSign className="w-3.5 h-3.5" />
                                      <span>بيع وتحصيل نقدي</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 text-[11px] font-mono">
                                      {item.voucherNumber || 'محصل بالصندوق'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: LUMP-SUM FIXED AMOUNTS (المبالغ الثابتة للأقسام) */}
              {assetActiveSubTab === 'LUMP_SUMS' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">مبالغ الأصول الثابتة المعتمدة لكل قسم</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        يمكن تعديل وتثبيت هذه المبالغ بضغطة زر واحدة لتنعكس فوراً في ميزانية الشركة وكشوفات الحساب.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenEditLumpSumsModal}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>تعديل المبالغ الثابتة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Wood Division Lump Sum Card */}
                    <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-md text-xs">
                          قسم النجارة والديكور الخشبي
                        </span>
                        <Building2 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">المبلغ الثابت المعتمد للأصول:</span>
                        <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                          {woodLumpSumPM.formatIQD()}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <p>{divisionLumpSums.WOOD.notes}</p>
                        <p className="text-[11px] text-slate-400 font-mono">آخر تحديث: {divisionLumpSums.WOOD.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Aluminum Division Lump Sum Card */}
                    <div className="bg-white border-2 border-sky-300 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
                      <div className="flex items-center justify-between">
                        <span className="bg-sky-100 text-sky-900 font-bold px-2.5 py-0.5 rounded-md text-xs">
                          قسم الألمنيوم والواجهات المعمارية
                        </span>
                        <Building2 className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">المبلغ الثابت المعتمد للأصول:</span>
                        <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                          {alumLumpSumPM.formatIQD()}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <p>{divisionLumpSums.ALUMINUM.notes}</p>
                        <p className="text-[11px] text-slate-400 font-mono">آخر تحديث: {divisionLumpSums.ALUMINUM.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Shared Company Lump Sum Card */}
                    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/80 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-md text-xs">
                          أصول عامة مشتركة للشركة
                        </span>
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">المبلغ الثابت المعتمد للأصول:</span>
                        <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                          {sharedLumpSumPM.formatIQD()}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <p>{divisionLumpSums.SHARED.notes}</p>
                        <p className="text-[11px] text-slate-400 font-mono">آخر تحديث: {divisionLumpSums.SHARED.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: DETAILED MACHINERY & ASSETS REGISTER */}
              {assetActiveSubTab === 'FIXED_ASSETS' && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">سجل الماكينات والعدد ومعدات الورش ({filteredFixedAssets.length} أصل مسجل)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">تفصيل الآلات الإنتاجية، ماكينات الـ CNC، والشاحنات التابعة لكل قسم</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddFixedAssetModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة أصل وماكينة جديدة</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-3 text-center w-12">#</th>
                          <th className="p-3 w-28">كود الأصل</th>
                          <th className="p-3">اسم الماكينة / المعدة</th>
                          <th className="p-3 text-center">القسم</th>
                          <th className="p-3 text-center">التصنيف</th>
                          <th className="p-3">الموقع / الورشة</th>
                          <th className="p-3 text-center font-mono">تاريخ الشراء</th>
                          <th className="p-3 text-left font-mono">القيمة التقديرية (IQD)</th>
                          <th className="p-3 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {filteredFixedAssets.map((ast, idx) => (
                          <tr key={ast.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-800">
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {ast.assetCode}
                              </span>
                            </td>
                            <td className="p-3 font-sans">
                              <div className="font-bold text-slate-900">{ast.nameAr}</div>
                              {ast.notes && <div className="text-[11px] text-slate-500 mt-0.5 font-normal">{ast.notes}</div>}
                            </td>
                            <td className="p-3 text-center font-sans">
                              {ast.divisionId === 'WOOD' ? (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold text-[10px]">
                                  نجارة وخشب
                                </span>
                              ) : ast.divisionId === 'ALUMINUM' ? (
                                <span className="bg-sky-100 text-sky-900 border border-sky-300 px-2 py-0.5 rounded font-bold text-[10px]">
                                  ألمنيوم وواجهات
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-bold text-[10px]">
                                  مشترك عام
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center font-sans text-slate-600 font-semibold text-[11px]">
                              {ast.categoryLabelAr}
                            </td>
                            <td className="p-3 font-sans text-slate-700">{ast.location}</td>
                            <td className="p-3 text-center text-slate-600">{ast.purchaseDate}</td>
                            <td className="p-3 text-left font-bold text-slate-900 font-mono">
                              {new PreciseMoney(ast.currentValue).formatIQD()}
                            </td>
                            <td className="p-3 text-center font-sans">
                              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                تعمل بكفاءة
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PARTNERS & PROFIT DISTRIBUTION (الشركاء وتصفية الأرباح) */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              {/* Feedback Flash Alert */}
              {partnerFeedback && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold animate-fadeIn shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{partnerFeedback}</span>
                  </div>
                  <button
                    onClick={() => setPartnerFeedback(null)}
                    className="text-emerald-600 hover:text-emerald-800 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Main Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-emerald-600" />
                    <span>الشركاء وتوزيع الأرباح</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-mono font-bold">
                    فترة التصفية: {partnerDateFrom || 'البداية'} إلى {partnerDateTo || 'الآن'}
                  </span>
                </div>
              </div>

              {/* Top Date Range Control & Action Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Date Range Pickers */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 font-medium">من:</span>
                      <input
                        type="date"
                        value={partnerDateFrom}
                        onChange={(e) => setPartnerDateFrom(e.target.value)}
                        className="bg-transparent font-mono text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 font-medium">إلى:</span>
                      <input
                        type="date"
                        value={partnerDateTo}
                        onChange={(e) => setPartnerDateTo(e.target.value)}
                        className="bg-transparent font-mono text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setPartnerDateFrom('2026-10-01');
                          setPartnerDateTo('2026-10-31');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition"
                      >
                        الشهر الحالي
                      </button>
                      <button
                        onClick={() => {
                          setPartnerDateFrom('2026-10-01');
                          setPartnerDateTo('2026-12-31');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition"
                      >
                        الربع الحالي
                      </button>
                      <button
                        onClick={() => {
                          setPartnerDateFrom('2026-01-01');
                          setPartnerDateTo('2026-12-31');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition"
                      >
                        السنة الحالية
                      </button>
                      <button
                        onClick={() => {
                          setPartnerDateFrom('');
                          setPartnerDateTo('');
                        }}
                        className="px-2 py-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-[11px]"
                      >
                        الكل
                      </button>
                    </div>
                  </div>

                  {/* Reserve Ratio & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                      <span className="text-slate-500 font-medium text-[11px]">الاحتياطي:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={partnerReservePct}
                        onChange={(e) => setPartnerReservePct(e.target.value)}
                        className="w-10 bg-transparent text-center font-mono font-bold text-slate-800 outline-none"
                      />
                      <span className="font-mono text-slate-400 text-xs">%</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPartnerForAdvance(partners[0]?.id || 'part-w1');
                        setIsPartnerAdvanceModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>سحب سلفة</span>
                    </button>

                    <UnifiedExportButton
                      onExportExcel={handleExportPartnersCSV}
                      onExportPdf={() => {
                        setSelectedSettlementForPrint({
                          divisionId: 'WOOD',
                          periodName: `تصفية أرباح الشركاء (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`,
                          summary: woodSummary,
                        });
                        setIsSettlementPrintModalOpen(true);
                      }}
                      label="تصدير الكشف"
                      excelLabel="تصدير كشف الشركاء والأرباح Excel"
                      pdfLabel="طباعة كشف تصفية الأرباح PDF"
                    />
                  </div>
                </div>

                {/* Sub-Tabs Nav */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs overflow-x-auto">
                  <button
                    onClick={() => setPartnerActiveSubTab('ROWS')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                      partnerActiveSubTab === 'ROWS'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>توزيع الأرباح</span>
                  </button>
                  <button
                    onClick={() => setPartnerActiveSubTab('ADVANCES')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                      partnerActiveSubTab === 'ADVANCES'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>سلف الشركاء</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full font-bold">
                      {partnerAdvances.filter((a) => a.status === 'ACTIVE').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setPartnerActiveSubTab('DETAILS')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                      partnerActiveSubTab === 'DETAILS'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>كشف الحسابات التفصيلي</span>
                  </button>
                  <button
                    onClick={() => setPartnerActiveSubTab('ARCHIVE')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                      partnerActiveSubTab === 'ARCHIVE'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>أرشيف دورات التصفية</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-bold">
                      {settlementCycles.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: ONE ROW PER DIVISION (الأسطر الموحدة لتوزيع الأرباح) */}
              {partnerActiveSubTab === 'ROWS' && (
                <div className="space-y-6">
                  {/* ============================================================== */}
                  {/* ROW 1: WOOD DIVISION (سطر قسم النجارة والخشب - 3 شركاء بالتساوي) */}
                  {/* ============================================================== */}
                  <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm space-y-4">
                    {/* Row Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
                          نجارة
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                            <span>قسم النجارة</span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full">
                              4 شركاء
                            </span>
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSettlementForPrint({
                              divisionId: 'WOOD',
                              periodName: `تصفية أرباح قسم النجارة (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`,
                              summary: woodSummary,
                            });
                            setIsSettlementPrintModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>طباعة الكشف</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPartnerForAdvance('part-w1');
                            setIsPartnerAdvanceModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>سحب سلفة</span>
                        </button>
                        <button
                          onClick={() => {
                            setTargetDivisionForSettlement('WOOD');
                            setSettlementPeriodTitle(`تصفية أرباح قسم النجارة (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`);
                            setIsConfirmSettlementModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد التصفية</span>
                        </button>
                      </div>
                    </div>

                    {/* Row Layout: Beginning Totals Block + 4 Partner Columns in One Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Beginning of Row: Division Totals Box */}
                      <div className="lg:col-span-4 bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-white border border-amber-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <span className="text-xs font-bold text-amber-950 block border-b border-amber-200/70 pb-1.5">
                            إجماليات الفترة:
                          </span>

                          {/* 1. الإيراد الواصل */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold">الإيراد الواصل:</span>
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {woodSummary.realizedRevenue.formatIQD()}
                            </span>
                          </div>

                          {/* 2. إجمالي المصروفات */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                              <span className="font-semibold">إجمالي المصروفات:</span>
                            </span>
                            <span className="font-mono font-bold text-rose-600 text-sm">
                              -{woodSummary.totalExpenses.formatIQD()}
                            </span>
                          </div>

                          {/* Detailed Expense Sub-breakdown */}
                          <div className="p-2 bg-amber-100/60 rounded-lg text-[10px] space-y-1 text-slate-600 border border-amber-200/50 font-mono">
                            <div className="flex justify-between">
                              <span className="font-sans">المواد والمشاريع:</span>
                              <span>-{woodSummary.materialCosts.formatIQD()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">المصروفات العامة:</span>
                              <span>-{woodSummary.directExpenses.add(woodSummary.sharedExpensesShare).formatIQD()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">الرواتب والأجور:</span>
                              <span>-{woodSummary.salariesCost.formatIQD()}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. صافي الربح القابل للتوزيع */}
                        <div className="pt-2 border-t-2 border-amber-200 flex justify-between items-center">
                          <div>
                            <span className="text-[11px] font-bold text-slate-600 block">صافي الربح القابل للتوزيع:</span>
                            {Number(partnerReservePct) > 0 && (
                              <span className="text-[10px] text-amber-700 font-medium">
                                (احتياطي {partnerReservePct}%: {woodSummary.reserveAmount.formatIQD()})
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-black text-emerald-700 text-base">
                            {woodSummary.distributableProfit.formatIQD()}
                          </span>
                        </div>
                      </div>

                      {/* Partners in the same row: 4 Partners for Wood */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                        {woodSummary.partnerShares.map((share, idx) => (
                          <div
                            key={share.partner.id}
                            className={`border rounded-xl p-3 flex flex-col justify-between shadow-xs transition overflow-hidden ${
                              share.partner.id === 'part-w4'
                                ? 'bg-gradient-to-br from-emerald-50/50 to-amber-50/30 border-emerald-300 hover:border-emerald-500'
                                : 'bg-white border-amber-200 hover:border-amber-400'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Partner Identity Header with Percentage Under Name */}
                              <div className="border-b border-slate-100 pb-2">
                                <div className="flex items-start gap-2">
                                  <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center font-mono shrink-0 mt-0.5 ${
                                    share.partner.id === 'part-w4'
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <h4 className="font-bold text-slate-800 text-xs leading-snug break-words" title={share.partner.name}>
                                      {share.partner.name}
                                    </h4>

                                    {/* Percentage badge directly under partner name */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${
                                        share.partner.id === 'part-w4'
                                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                                      }`}>
                                        <span className="text-[10px] font-sans opacity-75">النسبة:</span>
                                        <span>{Number(share.profitPercentage).toFixed(2)}%</span>
                                      </span>
                                      {share.partner.id === 'part-w4' && (
                                        <span className="text-[10px] text-emerald-700 font-medium">
                                          (أرباح فقط)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs font-mono">
                                <div className="flex justify-between items-center text-slate-600">
                                  <span className="font-sans text-[11px]">حصة الأرباح:</span>
                                  <span className="font-bold text-slate-800 text-[11px]">
                                    {share.grossShare.formatIQD()}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center text-purple-700">
                                  <span className="font-sans text-[11px]">السلف:</span>
                                  <span className="font-bold text-[11px]">
                                    {!share.totalAdvances.isZero() ? `-${share.totalAdvances.formatIQD()}` : '0 د.ع'}
                                  </span>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                  <span className="font-sans text-[11px] font-bold text-emerald-900">صافي المستحق:</span>
                                  <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                                    {share.netPayable.formatIQD()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 mt-2">
                              <button
                                onClick={() => {
                                  setSelectedPartnerForAdvance(share.partner.id);
                                  setIsPartnerAdvanceModalOpen(true);
                                }}
                                className="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <CreditCard className="w-3 h-3 text-amber-700" />
                                <span>سحب سلفة</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* ROW 2: ALUMINUM DIVISION (سطر قسم الألمنيوم)                   */}
                  {/* ============================================================== */}
                  <div className="bg-white border-2 border-sky-200/90 rounded-2xl p-5 shadow-sm space-y-4">
                    {/* Row Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
                          ألمنيوم
                        </div>
                        <div>
                          <h3 className="font-bold text-sky-950 text-base flex items-center gap-2">
                            <span>قسم الألمنيوم</span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 rounded-full">
                              5 شركاء
                            </span>
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSettlementForPrint({
                              divisionId: 'ALUMINUM',
                              periodName: `تصفية أرباح قسم الألمنيوم (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`,
                              summary: alumSummary,
                            });
                            setIsSettlementPrintModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>طباعة الكشف</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPartnerForAdvance('part-a1');
                            setIsPartnerAdvanceModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>سحب سلفة</span>
                        </button>
                        <button
                          onClick={() => {
                            setTargetDivisionForSettlement('ALUMINUM');
                            setSettlementPeriodTitle(`تصفية أرباح قسم الألمنيوم (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`);
                            setIsConfirmSettlementModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد التصفية</span>
                        </button>
                      </div>
                    </div>

                    {/* Row Layout: Beginning Totals Block + 5 Partner Columns in One Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Beginning of Row: Division Totals Box */}
                      <div className="lg:col-span-4 bg-gradient-to-br from-sky-50/90 via-sky-50/40 to-white border border-sky-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <span className="text-xs font-bold text-sky-950 block border-b border-sky-200/70 pb-1.5">
                            إجماليات الفترة:
                          </span>

                          {/* 1. الإيراد الواصل */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold">الإيراد الواصل:</span>
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {alumSummary.realizedRevenue.formatIQD()}
                            </span>
                          </div>

                          {/* 2. إجمالي المصروفات */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                              <span className="font-semibold">إجمالي المصروفات:</span>
                            </span>
                            <span className="font-mono font-bold text-rose-600 text-sm">
                              -{alumSummary.totalExpenses.formatIQD()}
                            </span>
                          </div>

                          {/* Detailed Expense Sub-breakdown */}
                          <div className="p-2 bg-sky-100/60 rounded-lg text-[10px] space-y-1 text-slate-600 border border-sky-200/50 font-mono">
                            <div className="flex justify-between">
                              <span className="font-sans">المواد والمشاريع:</span>
                              <span>-{alumSummary.materialCosts.formatIQD()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">المصروفات العامة:</span>
                              <span>-{alumSummary.directExpenses.add(alumSummary.sharedExpensesShare).formatIQD()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">الرواتب والأجور:</span>
                              <span>-{alumSummary.salariesCost.formatIQD()}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. صافي الربح القابل للتوزيع */}
                        <div className="pt-2 border-t-2 border-sky-200 flex justify-between items-center">
                          <div>
                            <span className="text-[11px] font-bold text-slate-600 block">صافي الربح القابل للتوزيع:</span>
                            {Number(partnerReservePct) > 0 && (
                              <span className="text-[10px] text-sky-700 font-medium">
                                (احتياطي {partnerReservePct}%: {alumSummary.reserveAmount.formatIQD()})
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-black text-emerald-700 text-base">
                            {alumSummary.distributableProfit.formatIQD()}
                          </span>
                        </div>
                      </div>

                      {/* Partners in the same row: 5 Partners for Aluminum */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
                        {alumSummary.partnerShares.map((share, idx) => (
                          <div
                            key={share.partner.id}
                            className={`border rounded-xl p-3 flex flex-col justify-between shadow-xs transition overflow-hidden ${
                              share.partner.id === 'part-a5'
                                ? 'bg-gradient-to-br from-emerald-50/50 to-sky-50/30 border-emerald-300 hover:border-emerald-500'
                                : 'bg-white border-sky-200 hover:border-sky-400'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Partner Identity Header with Percentage Under Name */}
                              <div className="border-b border-slate-100 pb-2">
                                <div className="flex items-start gap-1.5">
                                  <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center font-mono shrink-0 mt-0.5 ${
                                    share.partner.id === 'part-a5'
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : 'bg-sky-100 text-sky-900 border border-sky-200'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <h4 className="font-bold text-slate-800 text-xs leading-snug break-words" title={share.partner.name}>
                                      {share.partner.name}
                                    </h4>

                                    {/* Percentage badge directly under partner name */}
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${
                                        share.partner.id === 'part-a1'
                                          ? 'bg-sky-600 text-white shadow-2xs'
                                          : share.partner.id === 'part-a5'
                                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                          : 'bg-sky-100 text-sky-900 border border-sky-200'
                                      }`}>
                                        <span className={`text-[10px] font-sans ${share.partner.id === 'part-a1' ? 'text-sky-100' : 'opacity-75'}`}>النسبة:</span>
                                        <span>{Number(share.profitPercentage).toFixed(2)}%</span>
                                      </span>
                                      {share.partner.id === 'part-a5' && (
                                        <span className="text-[10px] text-emerald-700 font-medium">
                                          (أرباح فقط)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs font-mono">
                                <div className="flex justify-between items-center text-slate-600">
                                  <span className="font-sans text-[11px]">حصة الأرباح:</span>
                                  <span className="font-bold text-slate-800 text-[11px]">
                                    {share.grossShare.formatIQD()}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center text-purple-700">
                                  <span className="font-sans text-[11px]">السلف:</span>
                                  <span className="font-bold text-[11px]">
                                    {!share.totalAdvances.isZero() ? `-${share.totalAdvances.formatIQD()}` : '0 د.ع'}
                                  </span>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                  <span className="font-sans text-[11px] font-bold text-emerald-900">صافي المستحق:</span>
                                  <span className="font-bold text-emerald-700 text-xs">
                                    {share.netPayable.formatIQD()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 mt-2">
                              <button
                                onClick={() => {
                                  setSelectedPartnerForAdvance(share.partner.id);
                                  setIsPartnerAdvanceModalOpen(true);
                                }}
                                className="w-full py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <CreditCard className="w-3 h-3 text-sky-700" />
                                <span>سحب سلفة</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: PARTNER ADVANCES LOG (سجل سلف الشركاء) */}
              {partnerActiveSubTab === 'ADVANCES' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4">
                  <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span>سجل سلف الشركاء</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsPartnerAdvanceModalOpen(true)}
                      className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>سحب سلفة جديدة</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">رقم السند</th>
                          <th className="p-3">اسم الشريك</th>
                          <th className="p-3">القسم</th>
                          <th className="p-3">تاريخ الصرف</th>
                          <th className="p-3">مبلغ السلفة</th>
                          <th className="p-3">طريقة الدفع</th>
                          <th className="p-3">البيان</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3 text-center">طباعة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {partnerAdvances.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">
                              لا توجد سلف مسجلة للشركاء حتى الآن.
                            </td>
                          </tr>
                        ) : (
                          partnerAdvances.map((adv) => (
                            <tr key={adv.id} className="hover:bg-slate-50 transition">
                              <td className="p-3 font-mono font-bold text-slate-800">{adv.voucherNumber}</td>
                              <td className="p-3 font-bold text-slate-900">{adv.partnerName}</td>
                              <td className="p-3">
                                {adv.divisionId === 'WOOD' ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    قسم النجارة
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                    قسم الألمنيوم
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-mono text-slate-600">{adv.date}</td>
                              <td className="p-3 font-mono font-bold text-purple-700">
                                {new PreciseMoney(adv.amount).formatIQD()}
                              </td>
                              <td className="p-3">
                                <span className="text-[11px] text-slate-600">
                                  {adv.paymentMethod === 'CASH' ? 'نقداً' : 'تحويل بنكي'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 max-w-xs truncate">{adv.reason}</td>
                              <td className="p-3">
                                {adv.status === 'ACTIVE' ? (
                                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                                    نشطة
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                    محسومة
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedPadvForPrint(adv);
                                    setIsPadvPrintModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition inline-flex items-center gap-1 text-[11px] font-bold"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>طباعة</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: DETAILED FINANCIAL RECONCILIATION BREAKDOWN */}
              {partnerActiveSubTab === 'DETAILS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wood Reconciliation */}
                  <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2 border-b border-amber-100 pb-2">
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span>كشف إيرادات ومصروفات النجارة</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">
                          الدفعات الواصلة ({woodSummary.collectedPaymentsList.length}):
                        </span>
                        <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100 font-mono">
                          {woodSummary.collectedPaymentsList.map((pm, i) => (
                            <div key={i} className="p-2 flex justify-between items-center bg-slate-50/50">
                              <div>
                                <span className="font-sans font-bold text-slate-800 block text-[11px]">{pm.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-sans">{pm.projectName} ({pm.date})</span>
                              </div>
                              <span className="font-bold text-emerald-700">{new PreciseMoney(pm.amount).formatIQD()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5 font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المواد ومصروفات الورش:</span>
                          <span className="text-rose-600 font-bold">-{woodSummary.materialCosts.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المصروفات المباشرة:</span>
                          <span className="text-rose-600 font-bold">-{woodSummary.directExpenses.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المصروفات المشتركة (50%):</span>
                          <span className="text-rose-600 font-bold">-{woodSummary.sharedExpensesShare.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">الرواتب والأجور:</span>
                          <span className="text-rose-600 font-bold">-{woodSummary.salariesCost.formatIQD()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
                          <span className="font-sans">صافي الربح قبل التوزيع:</span>
                          <span>{woodSummary.netProfit.formatIQD()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aluminum Reconciliation */}
                  <div className="bg-white border border-sky-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-sky-950 text-sm flex items-center gap-2 border-b border-sky-100 pb-2">
                      <FileText className="w-4 h-4 text-sky-700" />
                      <span>كشف إيرادات ومصروفات الألمنيوم</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">
                          الدفعات الواصلة ({alumSummary.collectedPaymentsList.length}):
                        </span>
                        <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100 font-mono">
                          {alumSummary.collectedPaymentsList.map((pm, i) => (
                            <div key={i} className="p-2 flex justify-between items-center bg-slate-50/50">
                              <div>
                                <span className="font-sans font-bold text-slate-800 block text-[11px]">{pm.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-sans">{pm.projectName} ({pm.date})</span>
                              </div>
                              <span className="font-bold text-emerald-700">{new PreciseMoney(pm.amount).formatIQD()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5 font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المواد ومصروفات الورش:</span>
                          <span className="text-rose-600 font-bold">-{alumSummary.materialCosts.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المصروفات المباشرة:</span>
                          <span className="text-rose-600 font-bold">-{alumSummary.directExpenses.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">المصروفات المشتركة (50%):</span>
                          <span className="text-rose-600 font-bold">-{alumSummary.sharedExpensesShare.formatIQD()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="font-sans">الرواتب والأجور:</span>
                          <span className="text-rose-600 font-bold">-{alumSummary.salariesCost.formatIQD()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
                          <span className="font-sans">صافي الربح قبل التوزيع:</span>
                          <span>{alumSummary.netProfit.formatIQD()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: SETTLEMENT CYCLES ARCHIVE */}
              {partnerActiveSubTab === 'ARCHIVE' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Archive className="w-4 h-4 text-emerald-600" />
                        <span>أرشيف دورات التصفية</span>
                      </h3>
                    </div>
                    <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono font-bold">
                      {settlementCycles.length} دورة مؤرشفة
                    </span>
                  </div>

                  {settlementCycles.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
                      لا توجد دورات تصفية مؤرشفة حتى الآن.
                    </div>
                  ) : (
                    settlementCycles.map((cycle) => (
                      <div
                        key={cycle.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm ${
                              cycle.divisionId === 'WOOD' ? 'bg-amber-700' : 'bg-sky-700'
                            }`}>
                              {cycle.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <span>{cycle.periodName}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                                  مقفلة
                                </span>
                              </h4>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                رقم السند: {cycle.settlementNumber} | الفترة: {cycle.startDate} إلى {cycle.endDate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-left">
                              <span className="text-[10px] text-slate-400 block">صافي الأرباح الموزعة</span>
                              <span className="text-base font-black text-emerald-700 font-mono">
                                {new PreciseMoney(cycle.distributableProfit).formatIQD()}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSettlementForPrint({
                                  divisionId: cycle.divisionId,
                                  periodName: cycle.periodName,
                                  summary: {
                                    realizedRevenue: new PreciseMoney(cycle.totalRevenue),
                                    materialCosts: new PreciseMoney(0),
                                    directExpenses: new PreciseMoney(0),
                                    sharedExpensesShare: new PreciseMoney(0),
                                    salariesCost: new PreciseMoney(0),
                                    totalExpenses: new PreciseMoney(cycle.totalExpenses),
                                    netProfit: new PreciseMoney(cycle.netProfit),
                                    reserveAmount: new PreciseMoney(cycle.reserveDeduction),
                                    distributableProfit: new PreciseMoney(cycle.distributableProfit),
                                    partnerShares: cycle.records.map((r) => ({
                                      partner: { id: r.partnerId, name: r.partnerName, divisionId: r.divisionId, profitPercentage: r.profitPercentage },
                                      profitPercentage: r.profitPercentage,
                                      grossShare: new PreciseMoney(r.grossProfitShare),
                                      totalAdvances: new PreciseMoney(r.advancesDeducted),
                                      netPayable: new PreciseMoney(r.netPayableShare),
                                    })),
                                  },
                                });
                                setIsSettlementPrintModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة الكشف</span>
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Record */}
                        <details className="text-xs group">
                          <summary className="cursor-pointer font-bold text-slate-600 hover:text-slate-900 select-none py-1 flex items-center justify-between">
                            <span>تفاصيل الحصص ({cycle.records.length})</span>
                            <span className="text-xs text-slate-400 group-open:rotate-180 transition">▼</span>
                          </summary>
                          <div className="pt-3 overflow-x-auto">
                            <table className="w-full text-right text-xs">
                              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-2.5">الشريك</th>
                                  <th className="p-2.5">النسبة</th>
                                  <th className="p-2.5">الحصة</th>
                                  <th className="p-2.5 text-purple-700">السلف</th>
                                  <th className="p-2.5 text-emerald-700">صافي المستحق</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono">
                                {cycle.records.map((r, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold font-sans text-slate-800">{r.partnerName}</td>
                                    <td className="p-2.5">{Number(r.profitPercentage).toFixed(2)}%</td>
                                    <td className="p-2.5">{new PreciseMoney(r.grossProfitShare).formatIQD()}</td>
                                    <td className="p-2.5 text-purple-700">-{new PreciseMoney(r.advancesDeducted).formatIQD()}</td>
                                    <td className="p-2.5 font-bold text-emerald-700">{new PreciseMoney(r.netPayableShare).formatIQD()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: HUMAN RESOURCES & PAYROLL (الموارد البشرية والرواتب) */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              {/* Feedback Flash Alert */}
              {hrFeedback && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold animate-fadeIn shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{hrFeedback}</span>
                  </div>
                  <button
                    onClick={() => setHrFeedback(null)}
                    className="text-emerald-600 hover:text-emerald-800 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Header Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>الموارد البشرية والرواتب</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-mono font-semibold">
                    دورة: {payrollMonthName}
                  </span>
                </div>
              </div>

              {/* Top Control & Filter Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Division Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setHrDivisionFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        hrDivisionFilter === 'ALL'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>الكل</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 rounded-full">
                        {employees.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setHrDivisionFilter('WOOD')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        hrDivisionFilter === 'WOOD'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>قسم النجارة</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-900/20 rounded-full">
                        {employees.filter((e) => e.divisionId === 'WOOD').length}
                      </span>
                    </button>
                    <button
                      onClick={() => setHrDivisionFilter('ALUMINUM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        hrDivisionFilter === 'ALUMINUM'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-sky-800 hover:bg-sky-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span>قسم الألمنيوم</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-900/20 rounded-full">
                        {employees.filter((e) => e.divisionId === 'ALUMINUM').length}
                      </span>
                    </button>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setNewEmpDivision(hrDivisionFilter === 'ALL' ? 'WOOD' : hrDivisionFilter);
                        setIsNewEmployeeModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>إضافة موظف</span>
                    </button>

                    <button
                      onClick={() => {
                        if (employees.length > 0) {
                          setAttEmployeeId(employees[0].id);
                        }
                        setIsAttendanceModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>تسجيل دوام</span>
                    </button>

                    <button
                      onClick={() => setIsClosePayrollModalOpen(true)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>صرف الرواتب</span>
                    </button>

                    <UnifiedExportButton
                      onExportExcel={handleExportHrCSV}
                      onExportPdf={() => window.print()}
                      label="تصدير الكشف"
                      excelLabel="تصدير سجل الموظفين Excel"
                      pdfLabel="طباعة سجل الموظفين PDF"
                    />
                  </div>
                </div>

                {/* Second Row: Date Range & Live Search */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Search Input */}
                  <div className="md:col-span-5 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      value={hrSearchQuery}
                      onChange={(e) => setHrSearchQuery(e.target.value)}
                      placeholder="بحث باسم الموظف، الكود، المسمى الوظيفي، أو الهاتف..."
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    {hrSearchQuery && (
                      <button
                        onClick={() => setHrSearchQuery('')}
                        className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Date Range: From - To */}
                  <div className="md:col-span-5 flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 w-full">
                      <span className="text-slate-500 whitespace-nowrap font-medium">من:</span>
                      <input
                        type="date"
                        value={hrDateFrom}
                        onChange={(e) => setHrDateFrom(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 w-full">
                      <span className="text-slate-500 whitespace-nowrap font-medium">إلى:</span>
                      <input
                        type="date"
                        value={hrDateTo}
                        onChange={(e) => setHrDateTo(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Date Quick Presets */}
                  <div className="md:col-span-2 flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => {
                        setHrDateFrom('2026-10-01');
                        setHrDateTo('2026-10-31');
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition whitespace-nowrap"
                    >
                      الشهر الحالي
                    </button>
                    <button
                      onClick={() => {
                        setHrDateFrom('');
                        setHrDateTo('');
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-[11px] font-medium transition whitespace-nowrap"
                    >
                      الكل
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 Summary KPI Cards (كروت المؤشرات الإحصائية العلوية) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. عدد الموظفين */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[11px] font-bold">عدد الموظفين</span>
                    <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-800 font-mono">
                    {hrKpis.totalEmployees}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {hrDivisionFilter === 'ALL'
                      ? 'كافة الأقسام والمشترك'
                      : hrDivisionFilter === 'WOOD'
                      ? 'قسم النجارة فقط'
                      : 'قسم الألمنيوم فقط'}
                  </p>
                </div>

                {/* 2. إجمالي الرواتب الشهرية */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[11px] font-bold">إجمالي الرواتب</span>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-800 font-mono truncate">
                    {hrKpis.totalBaseSalaries.formatIQD()}
                  </div>
                  <p className="text-[10px] text-slate-400">الرواتب الأساسية العقدية</p>
                </div>

                {/* 3. الرواتب المستحقة (الصافي) */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-emerald-800">
                    <span className="text-[11px] font-bold">الرواتب المستحقة</span>
                    <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-sm font-black text-emerald-700 font-mono truncate">
                    {hrKpis.totalNetPayable.formatIQD()}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-medium">الصافي الجاهز للصرف</p>
                </div>

                {/* 4. إجمالي الخصومات (تأخير) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-rose-600">
                    <span className="text-[11px] font-bold">الخصومات (تأخير)</span>
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-rose-600 font-mono truncate">
                    {hrKpis.totalDeductions.formatIQD()}
                  </div>
                  <p className="text-[10px] text-rose-400 font-mono">
                    {hrKpis.totalLateMinutes} دقيقة تأخير
                  </p>
                </div>

                {/* 5. إجمالي الإضافات (وقت إضافي) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-amber-600">
                    <span className="text-[11px] font-bold">الإضافات (ساعات)</span>
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-amber-600 font-mono truncate">
                    {hrKpis.totalAdditions.formatIQD()}
                  </div>
                  <p className="text-[10px] text-amber-500 font-mono">
                    {hrKpis.totalOvertimeMinutes} دقيقة إضافي
                  </p>
                </div>

                {/* 6. السلف المصروفة */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-purple-600">
                    <span className="text-[11px] font-bold">السلف المصروفة</span>
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-purple-700 font-mono truncate">
                    {hrKpis.totalAdvances.formatIQD()}
                  </div>
                  <p className="text-[10px] text-purple-400">تحسم آلياً من الصافي</p>
                </div>
              </div>

              {/* Sub-Tabs Switcher (تبويبات التنقل الداخلي) */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
                <button
                  onClick={() => setHrActiveSubTab('EMPLOYEES')}
                  className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 shrink-0 ${
                    hrActiveSubTab === 'EMPLOYEES'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>جدول الموظفين والرواتب المستحقة</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    hrActiveSubTab === 'EMPLOYEES' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {filteredEmployees.length}
                  </span>
                </button>

                <button
                  onClick={() => setHrActiveSubTab('ATTENDANCE')}
                  className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 shrink-0 ${
                    hrActiveSubTab === 'ATTENDANCE'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>سجل الحضور والانصراف اليومي</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    hrActiveSubTab === 'ATTENDANCE' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {filteredAttendances.length}
                  </span>
                </button>

                <button
                  onClick={() => setHrActiveSubTab('ARCHIVE')}
                  className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 shrink-0 ${
                    hrActiveSubTab === 'ARCHIVE'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>أرشيف الرواتب والدورات السابقة</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    hrActiveSubTab === 'ARCHIVE' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {archivedPayrolls.length}
                  </span>
                </button>

                <button
                  onClick={() => setHrActiveSubTab('SHARED_ALLOCATION')}
                  className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 shrink-0 ${
                    hrActiveSubTab === 'SHARED_ALLOCATION'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>توزيع الكوادر المشتركة (المادة 16)</span>
                </button>
              </div>

              {/* SUB-VIEW 1: EMPLOYEES & NET PAYROLL TABLE */}
              {hrActiveSubTab === 'EMPLOYEES' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>كشف الرواتب والاستحقاقات وصرف السلف</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        يحتسب أجر الدقيقة بدقة وفق معادلة: الراتب الشهري ÷ (أيام العمل × ساعات العمل × 60 دقيقة)
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      {filteredEmployees.length} موظف مسجل
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 select-none">
                        <tr>
                          <th className="p-3">الموظف</th>
                          <th className="p-3">القسم والمسمى</th>
                          <th className="p-3">الراتب الأساسي</th>
                          <th className="p-3">الدوام وأجر الدقيقة</th>
                          <th className="p-3 text-rose-600">خصم التأخير</th>
                          <th className="p-3 text-amber-600">إضافة الإضافي</th>
                          <th className="p-3 text-purple-600">السلف النشطة</th>
                          <th className="p-3 text-emerald-700">صافي المستحق</th>
                          <th className="p-3 text-center w-20">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEmployees.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">
                              لا يوجد موظفون مطابقون لخيارات الفلترة الحالية.
                            </td>
                          </tr>
                        ) : (
                          filteredEmployees.map((emp) => {
                            const b = getEmployeePayrollBreakdown(emp);
                            const workingDays = emp.workingDaysPerMonth || 26;
                            const dailyHours = emp.dailyHours || 8;
                            const minuteRateIQD = b.minuteRate.toNumber().toFixed(2);

                            return (
                              <tr key={emp.id} className="hover:bg-slate-50 transition">
                                {/* Employee Info */}
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                                      {emp.fullName.slice(0, 2)}
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-800 block text-xs">
                                        {emp.fullName}
                                      </span>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                        <span>[{emp.code}]</span>
                                        <span>{emp.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Division & Title */}
                                <td className="p-3">
                                  <div className="space-y-1">
                                    {emp.divisionId === 'WOOD' ? (
                                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                        قسم النجارة
                                      </span>
                                    ) : emp.divisionId === 'ALUMINUM' ? (
                                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                        قسم الألمنيوم
                                      </span>
                                    ) : (
                                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                        كادر مشترك (عام)
                                      </span>
                                    )}
                                    <span className="text-[11px] text-slate-600 block">
                                      {emp.jobTitle}
                                    </span>
                                  </div>
                                </td>

                                {/* Base Salary */}
                                <td className="p-3 font-mono font-bold text-slate-800">
                                  {b.baseSalary.formatIQD()}
                                </td>

                                {/* Shift Schedule & Minute Rate */}
                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>{emp.shiftStartTime || '08:00'} - {emp.shiftEndTime || '16:00'}</span>
                                      <span className="text-[10px] text-slate-400 font-sans">({dailyHours} س / {workingDays} ي)</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      أجر الدقيقة: <span className="font-bold text-emerald-700">{minuteRateIQD} د.ع</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Delay Deductions */}
                                <td className="p-3 font-mono">
                                  {b.totalLateMinutes > 0 ? (
                                    <div>
                                      <span className="text-rose-600 font-bold block">
                                        -{b.totalLateDeductions.formatIQD()}
                                      </span>
                                      <span className="text-[10px] text-rose-400">
                                        ({b.totalLateMinutes} دقيقة)
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">0 د.ع</span>
                                  )}
                                </td>

                                {/* Overtime Additions */}
                                <td className="p-3 font-mono">
                                  {b.totalOvertimeMinutes > 0 ? (
                                    <div>
                                      <span className="text-amber-600 font-bold block">
                                        +{b.totalOvertimeAdditions.formatIQD()}
                                      </span>
                                      <span className="text-[10px] text-amber-500">
                                        ({b.totalOvertimeMinutes} دقيقة)
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">0 د.ع</span>
                                  )}
                                </td>

                                {/* Advances */}
                                <td className="p-3 font-mono">
                                  {!b.totalAdvances.isZero() ? (
                                    <div>
                                      <span className="text-purple-700 font-bold block">
                                        -{b.totalAdvances.formatIQD()}
                                      </span>
                                      <span className="text-[10px] text-purple-500 font-sans">
                                        ({b.advancesList.length} سلفة)
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">لا توجد سلف</span>
                                  )}
                                </td>

                                {/* Net Payable Salary */}
                                <td className="p-3 font-mono">
                                  <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200/80 inline-block">
                                    <span className="text-xs font-black text-emerald-800 block">
                                      {b.netSalary.formatIQD()}
                                    </span>
                                  </div>
                                </td>

                                {/* Actions (Gear Dropdown) */}
                                <td className="p-3 text-center">
                                  <ActionGearMenu
                                    title="إجراءات الموظف"
                                    items={[
                                      {
                                        id: 'advance',
                                        label: 'صرف سلفة على الراتب',
                                        icon: <CreditCard className="w-3.5 h-3.5 text-purple-600" />,
                                        onClick: () => {
                                          setAdvanceEmpId(emp.id);
                                          setAdvAmount('');
                                          setAdvReason('');
                                          setAdvError(null);
                                          setIsAdvanceModalOpen(true);
                                        },
                                        variant: 'warning',
                                        description: 'سند صرف سلفة نقدية أو بنكية تحسم من راتب الشهر',
                                      },
                                      {
                                        id: 'attendance',
                                        label: 'تسجيل دوام للموظف',
                                        icon: <Clock className="w-3.5 h-3.5 text-indigo-600" />,
                                        onClick: () => {
                                          setAttEmployeeId(emp.id);
                                          setAttNotes('');
                                          setAttError(null);
                                          setIsAttendanceModalOpen(true);
                                        },
                                        variant: 'primary',
                                        description: 'تسجيل وقت الدخول والخروج واحتساب التأخير والإضافي',
                                      },
                                      {
                                        id: 'slip',
                                        label: 'طباعة قسيمة الراتب (A4)',
                                        icon: <Printer className="w-3.5 h-3.5 text-emerald-600" />,
                                        onClick: () => {
                                          setSelectedEmpForSlip(emp);
                                          setIsSalarySlipModalOpen(true);
                                        },
                                        variant: 'success',
                                        description: 'كشف راتب تفصيلي رسمي مع التواقيع والتفقيط',
                                      },
                                    ]}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: DAILY ATTENDANCE LOG TABLE */}
              {hrActiveSubTab === 'ATTENDANCE' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>سجل الحضور والانصراف اليومي (ساعة الدخول والخروج)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        رصد ساعات الدخول والخروج ومطابقتها مع أوقات الدوام الرسمي لكل موظف واحتساب أجر الدقيقة
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAttendanceModalOpen(true)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تسجيل دوام جديد</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 select-none">
                        <tr>
                          <th className="p-3">التاريخ</th>
                          <th className="p-3">الموظف والقسم</th>
                          <th className="p-3">وقت الدخول الفعلي</th>
                          <th className="p-3">وقت الخروج الفعلي</th>
                          <th className="p-3 text-rose-600">التأخير (دقائق وخصم)</th>
                          <th className="p-3 text-amber-600">الإضافي (دقائق وإضافة)</th>
                          <th className="p-3">الحالة النظامية</th>
                          <th className="p-3">الملاحظات والمسؤول</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAttendances.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400">
                              لا توجد سجلات دوام مسجلة مطابقة للفلترة أو لم يتم تسجيل دوام بعد.
                            </td>
                          </tr>
                        ) : (
                          filteredAttendances.map((att) => (
                            <tr key={att.id} className="hover:bg-slate-50 transition">
                              {/* Date */}
                              <td className="p-3 font-mono font-bold text-slate-700">
                                {att.date}
                              </td>

                              {/* Employee */}
                              <td className="p-3">
                                <span className="font-bold text-slate-800 block text-xs">
                                  {att.employeeName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {att.divisionId === 'WOOD'
                                    ? 'قسم النجارة'
                                    : att.divisionId === 'ALUMINUM'
                                    ? 'قسم الألمنيوم'
                                    : 'كادر مشترك'}
                                </span>
                              </td>

                              {/* Clock In */}
                              <td className="p-3">
                                <div className="space-y-0.5">
                                  <span className="font-mono font-bold text-slate-800 block">
                                    {att.clockIn}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    الرسمي: {att.scheduledIn}
                                  </span>
                                </div>
                              </td>

                              {/* Clock Out */}
                              <td className="p-3">
                                <div className="space-y-0.5">
                                  <span className="font-mono font-bold text-slate-800 block">
                                    {att.clockOut}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    الرسمي: {att.scheduledOut}
                                  </span>
                                </div>
                              </td>

                              {/* Late Deduction */}
                              <td className="p-3 font-mono">
                                {att.lateMinutes > 0 ? (
                                  <div>
                                    <span className="text-rose-600 font-bold block">
                                      -{new PreciseMoney(att.lateDeduction).formatIQD()}
                                    </span>
                                    <span className="text-[10px] text-rose-500">
                                      {att.lateMinutes} دقيقة تأخير
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">بدون تأخير ✓</span>
                                )}
                              </td>

                              {/* Overtime Addition */}
                              <td className="p-3 font-mono">
                                {att.overtimeMinutes > 0 ? (
                                  <div>
                                    <span className="text-amber-600 font-bold block">
                                      +{new PreciseMoney(att.overtimeAddition).formatIQD()}
                                    </span>
                                    <span className="text-[10px] text-amber-500">
                                      {att.overtimeMinutes} دقيقة إضافي
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">-</span>
                                )}
                              </td>

                              {/* Status Badge */}
                              <td className="p-3">
                                {att.status === 'LATE_AND_OVERTIME' ? (
                                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold">
                                    تأخير + وقت إضافي
                                  </span>
                                ) : att.status === 'LATE' ? (
                                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                                    تأخير بالدخول
                                  </span>
                                ) : att.status === 'OVERTIME' ? (
                                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                                    وقت إضافي معتمد
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                                    حاضر ومنتظم ✓
                                  </span>
                                )}
                              </td>

                              {/* Notes */}
                              <td className="p-3 text-slate-500 text-[11px]">
                                <div>{att.notes || '-'}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                  {att.recordedBy}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: ARCHIVED PAYROLL CYCLES */}
              {hrActiveSubTab === 'ARCHIVE' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Archive className="w-4 h-4 text-emerald-600" />
                        <span>سجل دورات الرواتب السابقة والأرشيف الشهري</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        أرشيف الدورات المغلقة حيث تم صرف الرواتب وتصفير سجلات الدوام للبدء بشهر جديد
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono font-bold">
                      {archivedPayrolls.length} دورة مؤرشفة
                    </span>
                  </div>

                  {archivedPayrolls.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
                      لا توجد دورات رواتب سابقة مؤرشفة حتى الآن.
                    </div>
                  ) : (
                    archivedPayrolls.map((cycle) => (
                      <div
                        key={cycle.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold font-mono">
                              {cycle.cycleNumber.slice(-4)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <span>دورة رواتب: {cycle.monthNameAr}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                                  مغلقة ومصروفة
                                </span>
                              </h4>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                رقم الدورة: {cycle.cycleNumber} | تاريخ الأرشفة: {new Date(cycle.closedDate).toLocaleDateString('ar-IQ')}
                              </p>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className="text-[10px] text-slate-400 block">إجمالي الصافي المصروف</span>
                            <span className="text-base font-black text-emerald-700 font-mono">
                              {new PreciseMoney(cycle.totalNetPaid).formatIQD()}
                            </span>
                          </div>
                        </div>

                        {/* Metrics Bar for the Cycle */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">عدد الموظفين</span>
                            <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                              {cycle.employeeCount} موظف
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">إجمالي الرواتب الأساسية</span>
                            <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                              {new PreciseMoney(cycle.totalBaseSalaries).formatIQD()}
                            </span>
                          </div>
                          <div>
                            <span className="text-rose-500 block text-[10px]">إجمالي الخصومات (تأخير)</span>
                            <span className="font-bold text-rose-600 font-mono mt-0.5 block">
                              -{new PreciseMoney(cycle.totalDeductions).formatIQD()}
                            </span>
                          </div>
                          <div>
                            <span className="text-amber-500 block text-[10px]">إجمالي الإضافات</span>
                            <span className="font-bold text-amber-600 font-mono mt-0.5 block">
                              +{new PreciseMoney(cycle.totalAdditions).formatIQD()}
                            </span>
                          </div>
                          <div>
                            <span className="text-purple-500 block text-[10px]">السلف المحسومة</span>
                            <span className="font-bold text-purple-700 font-mono mt-0.5 block">
                              -{new PreciseMoney(cycle.totalAdvances).formatIQD()}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible / Expandable Employee Breakdown */}
                        <details className="text-xs group">
                          <summary className="cursor-pointer font-bold text-slate-600 hover:text-slate-900 select-none py-1 flex items-center justify-between">
                            <span>عرض تفاصيل استحقاق كل موظف في هذه الدورة ({cycle.records.length} موظف)</span>
                            <span className="text-xs text-slate-400 group-open:rotate-180 transition">▼</span>
                          </summary>
                          <div className="pt-3 overflow-x-auto">
                            <table className="w-full text-right text-xs">
                              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-2.5">الموظف</th>
                                  <th className="p-2.5">القسم</th>
                                  <th className="p-2.5">الأساسي</th>
                                  <th className="p-2.5 text-amber-600">الإضافي</th>
                                  <th className="p-2.5 text-rose-600">الخصم</th>
                                  <th className="p-2.5 text-purple-600">السلفة</th>
                                  <th className="p-2.5 text-emerald-700">الصافي المصروف</th>
                                  <th className="p-2.5">أيام الدوام</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {cycle.records.map((r, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-800">{r.employeeName}</td>
                                    <td className="p-2.5">
                                      {r.divisionId === 'WOOD' ? 'نجارة' : r.divisionId === 'ALUMINUM' ? 'ألمنيوم' : 'مشترك'}
                                    </td>
                                    <td className="p-2.5 font-mono">{new PreciseMoney(r.baseSalary).formatIQD()}</td>
                                    <td className="p-2.5 font-mono text-amber-600">+{new PreciseMoney(r.additions).formatIQD()}</td>
                                    <td className="p-2.5 font-mono text-rose-600">-{new PreciseMoney(r.deductions).formatIQD()}</td>
                                    <td className="p-2.5 font-mono text-purple-600">-{new PreciseMoney(r.advances).formatIQD()}</td>
                                    <td className="p-2.5 font-mono font-bold text-emerald-700">{new PreciseMoney(r.netSalary).formatIQD()}</td>
                                    <td className="p-2.5 font-mono text-slate-500">{r.attendanceDaysCount} يوم</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SUB-VIEW 4: SHARED LABOR ALLOCATION (المادة 16) */}
              {hrActiveSubTab === 'SHARED_ALLOCATION' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>محرك توزيع مصاريف الكوادر العامة المشتركة (المادة 16)</span>
                    </h3>
                    <span className="text-xs text-slate-400">توزيع دوري معتمد</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    وفقاً للمادة 16 من عقد التأسيس، يتم توزيع تكلفة الكوادر المشتركة (المصممون، المحاسبون، الخدمات) بنسب مئوية عادلة بين قسم النجارة وقسم الألمنيوم لمنع أي ازدواجية في الحسابات.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">
                        إجمالي رواتب الكوادر المشتركة (د.ع):
                      </label>
                      <input
                        type="text"
                        value={sharedLaborAmount}
                        onChange={(e) => setSharedLaborAmount(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">
                        نسبة قسم النجارة (%):
                      </label>
                      <input
                        type="text"
                        value={woodLaborPct}
                        onChange={(e) => setWoodLaborPct(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">
                        نسبة قسم الألمنيوم (%):
                      </label>
                      <input
                        type="text"
                        value={alumLaborPct}
                        onChange={(e) => setAlumLaborPct(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">نصيب قسم النجارة من المصروف:</span>
                      <span className="text-sm font-bold text-amber-900 mt-1 block">
                        {new PreciseMoney(laborAllocation.woodAllocatedAmount).formatIQD()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">نصيب قسم الألمنيوم من المصروف:</span>
                      <span className="text-sm font-bold text-sky-900 mt-1 block">
                        {new PreciseMoney(laborAllocation.aluminumAllocatedAmount).formatIQD()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">حالة المطابقة المحاسبية:</span>
                      <span className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        مطابق 100% (بدون أي فروقات)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SETTINGS & BACKUPS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">النسخ الاحتياطي وإعدادات النظام</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backups Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>النسخ الاحتياطي</span>
                    </h3>
                    <button
                      onClick={() => alert('تم إنشاء نسخة احتياطية جديدة بنجاح في مجلد /backups مع البصمة الرقمية SHA-256.')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      إنشاء نسخة فورية
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-mono font-bold text-slate-800">noak_erp_backup_2026-10-17.json</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[11px]">مكتمل وسليم</span>
                    </div>
                  </div>
                </div>

                {/* Company Settings Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">بيانات وشعار الشركة</h3>
                    <img
                      src={noakLogo}
                      alt="NOAK Logo"
                      className="h-10 w-auto object-contain rounded-xl bg-white p-1 border border-slate-200 shadow-xs"
                    />
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">اسم الشركة:</span>
                      <p className="font-bold text-slate-800">شركة نوك للديكور الداخلي والألمنيوم</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">العملة الأساسية:</span>
                      <p className="font-bold text-slate-800">الدينار العراقي (IQD)</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">قاعدة البيانات:</span>
                      <p className="font-bold text-slate-800">PostgreSQL (جاهز للشبكة المحلية LAN)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users & Online Domain Permissions Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-sm">
                          إدارة المستخدمين وصلاحيات الدخول السحابي (Cloud Access Control)
                        </h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {systemUsers.length} مستخدمين
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        قائمة الحسابات المصرح لها بالوصول للنظام السحابي عبر الدومين، مع إمكانية إضافة مستخدمين وتغيير كلمات المرور
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {isSystemProgrammer ? (
                      <>
                        <button
                          type="button"
                          onClick={handleOpenAddUserModal}
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>إضافة مستخدم جديد</span>
                        </button>
                        <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>صلاحية مبرمج النظام مفعلة (م. ميثم ابراهيم)</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>إدارة المستخدمين مقصورة على مبرمج النظام (م. ميثم ابراهيم)</span>
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 font-bold">
                          SSL 256-Bit
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Restricted Programmer Notice if not logged in as Programmer */}
                {!isSystemProgrammer && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 font-bold animate-in fade-in">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      تنبيه أمني: إضافة وتعديل المستخدمين وتغيير كلمات المرور مقصورة حصرياً على مبرمج ومطور النظام (م. ميثم ابراهيم). يمكنك استعراض الحسابات المسجلة فقط.
                    </span>
                  </div>
                )}

                {/* Feedback Banner */}
                {userMgmtFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-bold animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{userMgmtFeedback}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUserMgmtFeedback(null)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">اسم المستخدم</th>
                        <th className="p-3">اسم الدخول</th>
                        <th className="p-3">الدور والمنصب</th>
                        <th className="p-3 text-center">مستوى الصلاحيات</th>
                        <th className="p-3 text-center">القسم</th>
                        <th className="p-3 text-center">الحالة</th>
                        <th className="p-3 text-center">الإجراءات وكلمة المرور</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {systemUsers.map((usr, i) => {
                        const isPrimarySuperAdmin = usr.username === 'abbas';
                        const isCurrentActiveUser = usr.id === activeUser.id || usr.username === activeUser.username;

                        return (
                          <tr key={usr.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3 font-mono text-slate-400">{i + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full ${usr.avatarColor || 'bg-slate-700'} text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs`}>
                                  {usr.initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900">{usr.fullName}</span>
                                    {isCurrentActiveUser && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                                        (حسابك الحالي)
                                      </span>
                                    )}
                                  </div>
                                  {(usr.email || usr.phone) && (
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                      {usr.email || usr.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-700">@{usr.username}</td>
                            <td className="p-3 text-slate-700 font-medium">{usr.title || usr.roleArabic}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                usr.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                  : usr.role === 'ADMIN'
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {usr.role === 'SUPER_ADMIN' ? 'صلاحيات كاملة وغير مقيدة' : usr.roleArabic}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-[11px] text-slate-600 font-bold">
                                {usr.divisionId === 'ALL' ? 'كافة الأقسام' : usr.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {usr.isActive ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>نشط ومفعل</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  <span>معطل</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-1.5">
                                {isSystemProgrammer ? (
                                  <>
                                    {/* Change Password Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenChangePasswordModal(usr)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition shadow-xs"
                                      title="تغيير كلمة المرور"
                                    >
                                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                                      <span>تغيير المرور</span>
                                    </button>

                                    {/* Toggle Active/Disabled */}
                                    {!isPrimarySuperAdmin && (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleUserStatus(usr)}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition ${
                                          usr.isActive
                                            ? 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border-slate-200 hover:border-rose-300'
                                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                                        }`}
                                        title={usr.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                      >
                                        {usr.isActive ? 'تعطيل' : 'تفعيل'}
                                      </button>
                                    )}

                                    {/* Delete User */}
                                    {!isPrimarySuperAdmin && !isCurrentActiveUser && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteUser(usr)}
                                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                        title="حذف المستخدم نهائياً"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span>مقصورة على م. ميثم</span>
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Information / Security Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تشفير كامل لكلمات المرور وحفظ تلقائي سحابي ومحلي متزامن مع شاشة الدخول.</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    الحسابات النشطة: {systemUsers.filter((u) => u.isActive).length} من {systemUsers.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. MATERIAL ISSUE MODAL (صرف مواد لمشروع تجاري أو لتصنيع نموذج للمعرض) */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {issueDestinationType === 'SHOWROOM' ? (
                  <>
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>صرف مواد لنموذج المعرض</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    <span>صرف مواد لمشروع</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Destination Toggle Pill */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setIssueDestinationType('PROJECT')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
                  issueDestinationType === 'PROJECT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-emerald-600" />
                <span>مشروع لعميل</span>
              </button>
              <button
                type="button"
                onClick={() => setIssueDestinationType('SHOWROOM')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
                  issueDestinationType === 'SHOWROOM'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-300" />
                <span>مستودع المعرض (المواد الجاهزة)</span>
              </button>
            </div>

            {issueError && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{issueError}</span>
              </div>
            )}

            <form onSubmit={handleIssueMaterial} className="space-y-4 text-xs">
              {/* Destination 1: Commercial Customer Project */}
              {issueDestinationType === 'PROJECT' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المشروع المستلم:</label>
                  <select
                    value={issueProjectId}
                    onChange={(e) => setIssueProjectId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم'}] {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Destination 2: Internal Showroom Finished Goods Warehouse */}
              {issueDestinationType === 'SHOWROOM' && (
                <div className="space-y-3 p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
                  {/* Accounting Policy Banner */}
                  <div className="p-2.5 bg-purple-100/70 border border-purple-300 text-purple-950 rounded-lg text-[11px] leading-relaxed">
                    <strong>تحويل مخزني داخلي:</strong> سحب المواد لتصنيع معروضات مستودع المعرض يخصم كميات المواد الخام من المستودع ويجمع تكلفتها على المنتج الجاهز <strong>دون أي تأثير مالي على الصندوق</strong>.
                  </div>

                  {/* Mode Selector: New Piece vs Existing Piece */}
                  <div>
                    <label className="font-bold text-purple-950 block mb-1.5">نوع العملية في مستودع المعرض:</label>
                    <div className="grid grid-cols-2 gap-2 bg-purple-100/50 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setIssueShowroomMode('NEW')}
                        className={`py-2 px-3 rounded-md font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                          issueShowroomMode === 'NEW'
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'text-purple-900 hover:bg-purple-200/50'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>تصنيع قطعة جاهزة جديدة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIssueShowroomMode('EXISTING');
                          const curBatch = batches.find((b) => b.id === issueBatchId);
                          const avail = showroomItems.filter(
                            (s) => s.status === 'IN_SHOWROOM' && (!curBatch || s.divisionId === curBatch.divisionId)
                          );
                          if (avail.length > 0 && !issueSelectedShowroomItemId) {
                            setIssueSelectedShowroomItemId(avail[0].id);
                          }
                        }}
                        className={`py-2 px-3 rounded-md font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                          issueShowroomMode === 'EXISTING'
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'text-purple-900 hover:bg-purple-200/50'
                        }`}
                      >
                        <Boxes className="w-3.5 h-3.5" />
                        <span>إضافة مواد لقطعة قائمة بالمعرض</span>
                      </button>
                    </div>
                  </div>

                  {/* Option A: Existing Showroom Piece Selector */}
                  {issueShowroomMode === 'EXISTING' && (
                    <div>
                      <label className="font-bold text-purple-950 block mb-1">
                        القطعة الجاهزة في مستودع المعرض <span className="text-rose-500">*</span>:
                      </label>
                      {(() => {
                        const curBatch = batches.find((b) => b.id === issueBatchId);
                        const avail = showroomItems.filter(
                          (s) => s.status === 'IN_SHOWROOM' && (!curBatch || s.divisionId === curBatch.divisionId)
                        );
                        if (avail.length === 0) {
                          return (
                            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs">
                              لا توجد قطع جاهزة قيد العرض حالياً لهذا القسم ({curBatch?.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}). يمكنك اختيار &quot;تصنيع قطعة جاهزة جديدة&quot;.
                            </div>
                          );
                        }
                        return (
                          <select
                            value={issueSelectedShowroomItemId || (avail[0]?.id || '')}
                            onChange={(e) => setIssueSelectedShowroomItemId(e.target.value)}
                            className="w-full p-2.5 bg-white border border-purple-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {avail.map((item) => (
                              <option key={item.id} value={item.id}>
                                [{item.itemCode}] {item.nameAr} — الكلفة الحالية: {new PreciseMoney(item.productionCost).formatIQD()}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>
                  )}

                  {/* Option B: New Showroom Piece Fields */}
                  {issueShowroomMode === 'NEW' && (
                    <>
                      <div>
                        <label className="font-bold text-purple-950 block mb-1">
                          اسم وتوصيف قطعة المعرض الجديدة <span className="text-rose-500">*</span>:
                        </label>
                        <input
                          type="text"
                          value={issueShowroomPieceName}
                          onChange={(e) => setIssueShowroomPieceName(e.target.value)}
                          placeholder="مثال: طقم كونسول ملكي خشب صاج / باب سحاب ثيرمال بريك فولدينغ"
                          className="w-full p-2.5 bg-white border border-purple-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                          required={issueShowroomMode === 'NEW'}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-purple-950 block mb-1">فئة النموذج:</label>
                          <input
                            type="text"
                            value={issueShowroomCategory}
                            onChange={(e) => setIssueShowroomCategory(e.target.value)}
                            placeholder="أبواب وديكورات, واجهات..."
                            className="w-full p-2 bg-white border border-purple-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-purple-950 block mb-1">المقاسات والأبعاد:</label>
                          <input
                            type="text"
                            value={issueShowroomDimensions}
                            onChange={(e) => setIssueShowroomDimensions(e.target.value)}
                            placeholder="عرض 120 × ارتفاع 240 سم"
                            className="w-full p-2 bg-white border border-purple-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-purple-950 block mb-1">سعر البيع المقترح للزبائن (د.ع):</label>
                          <input
                            type="text"
                            value={issueShowroomProposedPrice}
                            onChange={(e) => setIssueShowroomProposedPrice(e.target.value)}
                            placeholder="سعر البيع المعروض"
                            className="w-full p-2 bg-white border border-purple-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-purple-950 block mb-1">موقع العرض:</label>
                          <input
                            type="text"
                            value={issueShowroomLocation}
                            onChange={(e) => setIssueShowroomLocation(e.target.value)}
                            placeholder="صالة العرض الرئيسية"
                            className="w-full p-2 bg-white border border-purple-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Common: Batch Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">الدفعة المخزنية المطلوب الصرف منها:</label>
                <select
                  value={issueBatchId}
                  onChange={(e) => {
                    const newBId = e.target.value;
                    setIssueBatchId(newBId);
                    const b = batches.find((x) => x.id === newBId);
                    if (b) {
                      const avail = showroomItems.filter(
                        (s) => s.status === 'IN_SHOWROOM' && s.divisionId === b.divisionId
                      );
                      if (avail.length > 0) {
                        setIssueSelectedShowroomItemId(avail[0].id);
                      }
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.divisionId === 'WOOD' ? 'مستودع نجارة' : 'مستودع ألمنيوم'}] {b.materialNameAr} (المتاح: {b.remainingQuantity} | كلفة الوحدة: {b.unitCost} د.ع)
                    </option>
                  ))}
                </select>
              </div>

              {/* Common: Quantity Input */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">الكمية المطلوبة للصرف من الوجبة:</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={issueQty}
                  onChange={(e) => setIssueQty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              {/* Live Cost Calculation Preview */}
              {(() => {
                const b = batches.find((x) => x.id === issueBatchId);
                if (b && issueQty && Number(issueQty) > 0) {
                  const estCost = new PreciseMoney(b.unitCost).mul(issueQty);
                  return (
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
                        issueDestinationType === 'SHOWROOM'
                          ? 'bg-purple-100/70 border-purple-300 text-purple-950 font-bold'
                          : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="font-sans font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-700" />
                        {issueDestinationType === 'SHOWROOM'
                          ? 'تكلفة المواد المضافة للمنتج بمستودع المعرض (دون أثر على الصندوق):'
                          : 'إجمالي كلفة المواد المباشرة للمشروع:'}
                      </span>
                      <span className="font-bold text-sm text-purple-900">{estCost.formatIQD()}</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                <strong>تنبيه فحص النظام:</strong> يتم التحقق آلياً من عدم نزول الرصيد بالسالب، ومطابقة قسم الدفعة المخزنية مع وجهة الصرف منعاً لأي خلط بين الأقسام.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-lg font-bold shadow transition flex items-center gap-1.5 ${
                    issueDestinationType === 'SHOWROOM'
                      ? 'bg-purple-700 hover:bg-purple-800'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {issueDestinationType === 'SHOWROOM'
                      ? 'صرف المواد وإدراج القطعة كأصل للمعرض'
                      : 'اعتماد وترحيل الصرف للمشروع'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD CONTACT (CUSTOMER / SUPPLIER) MODAL */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>إضافة عميل / مورد جديد</span>
              </h3>
              <button
                onClick={() => setIsAddContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              {/* Type Switcher (Customer vs Supplier) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">نوع الجهة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewContactType('CUSTOMER')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      newContactType === 'CUSTOMER'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${newContactType === 'CUSTOMER' ? 'bg-white' : 'bg-emerald-600'}`}></span>
                    <span>زبون</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewContactType('SUPPLIER')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      newContactType === 'SUPPLIER'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${newContactType === 'SUPPLIER' ? 'bg-white' : 'bg-indigo-600'}`}></span>
                    <span>مورد</span>
                  </button>
                </div>
              </div>

              {/* Name & Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    الاسم التجاري <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شركة الأفق للتجارة، أحمد العراقي..."
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">كود الحساب (اختياري):</label>
                  <input
                    type="text"
                    placeholder={newContactType === 'CUSTOMER' ? 'CUST-00X' : 'SUP-00X'}
                    value={newContactCode}
                    onChange={(e) => setNewContactCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    رقم الهاتف والاتصال <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 07701234567"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني (إن وجد):</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Address & Division */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">العنوان والموقع الجغرافي:</label>
                  <input
                    type="text"
                    placeholder="المدينة، الحي أو الشارع الرئيسي"
                    value={newContactAddress}
                    onChange={(e) => setNewContactAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">القسم:</label>
                  <select
                    value={newContactDivision}
                    onChange={(e) => setNewContactDivision(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="SHARED">مشترك</option>
                    <option value="WOOD">قسم النجارة</option>
                    <option value="ALUMINUM">قسم الألمنيوم</option>
                  </select>
                </div>
              </div>

              {/* Financial Balances / Opening Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {newContactType === 'CUSTOMER' ? 'إجمالي المبيعات (د.ع):' : 'إجمالي المشتريات (د.ع):'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={newContactTotal}
                    onChange={(e) => setNewContactTotal(formatInputNumber(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                  {newContactTotal && Number(cleanNumeric(newContactTotal)) > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      المبلغ المنسق: {new PreciseMoney(newContactTotal).formatIQD()}
                    </span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {newContactType === 'CUSTOMER' ? 'المقبوض سابقاً (د.ع):' : 'المدفوع سابقاً (د.ع):'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={newContactPaid}
                    onChange={(e) => setNewContactPaid(formatInputNumber(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                  />
                  {newContactPaid && Number(cleanNumeric(newContactPaid)) > 0 && (
                    <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">
                      المبلغ المنسق: {new PreciseMoney(newContactPaid).formatIQD()}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات:</label>
                <textarea
                  rows={2}
                  placeholder="أية ملاحظات إضافية أو شروط دفع..."
                  value={newContactNotes}
                  onChange={(e) => setNewContactNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-95"
                >
                  حفظ العميل / المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. STATEMENT MODAL (كشف حساب العميل / المورد) */}
      {isStatementModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 printable-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full multi-page-doc">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>كشف حساب تفصيلي: {selectedContact.name}</span>
              </h3>
              <div className="flex items-center gap-2">
                <UnifiedExportButton
                  onExportExcel={handleExportStatementCSV}
                  onExportPdf={() => window.print()}
                  label="تصدير الكشف"
                  excelLabel="تصدير كشف الحساب Excel"
                  pdfLabel="طباعة كشف الحساب PDF"
                />
                <button
                  onClick={() => setIsStatementModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Statement Document */}
            <div className="space-y-5 print:space-y-3 print:p-0">
              {/* Statement Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="bg-slate-900 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                    كشف حساب تجاري
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    التاريخ: {new Date().toISOString().split('T')[0]}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    كود العميل: {selectedContact.code}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    نوع الحساب: {selectedContact.type === 'CUSTOMER' ? 'زبون معتمد' : 'مورد معتمد'}
                  </p>
                </div>
              </div>

              {/* Client Info Grid (مطابق لسند القبض) */}
              <div className="bg-slate-50 p-4 print:p-2 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 print:gap-2 voucher-card">
                <div>
                  <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">اسم العميل / الجهة الدافعة:</span>
                  <p className="font-black text-slate-900 text-sm print:text-xs">{selectedContact.name}</p>
                  <p className="text-slate-600 mt-0.5 print:text-[10px] font-mono">الهاتف: {selectedContact.phone || 'غير مسجل'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">عنوان العميل:</span>
                  <p className="font-bold text-slate-800 text-sm print:text-xs">{selectedContact.address || 'العراق'}</p>
                  <p className="text-slate-600 mt-0.5 print:text-[10px]">
                    <span className="text-slate-400">كود العميل: </span>
                    <span className="font-mono font-bold text-slate-800">{selectedContact.code}</span>
                  </p>
                </div>
              </div>

              {/* Balance Summary Cards */}
              <div className="grid grid-cols-3 gap-3 print:gap-2 text-xs text-center">
                <div className="p-3 print:p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1 print:text-[9pt]">المبلغ الإجمالي الكلي:</span>
                  <span className="font-mono font-black text-slate-900 text-sm print:text-xs block">
                    {new PreciseMoney(selectedContact.totalAmount).formatIQD()}
                  </span>
                </div>

                <div className="p-3 print:p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 block mb-1 print:text-[9pt]">إجمالي المبالغ المسددة:</span>
                  <span className="font-mono font-black text-emerald-800 text-sm print:text-xs block">
                    {new PreciseMoney(selectedContact.paidAmount).formatIQD()}
                  </span>
                </div>

                <div className="p-3 print:p-2 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-rose-700 block mb-1 print:text-[9pt]">صافي الرصيد المتبقي:</span>
                  <span className="font-mono font-black text-rose-800 text-sm print:text-xs block">
                    {new PreciseMoney(selectedContact.remainingAmount).formatIQD()}
                  </span>
                </div>
              </div>

              {/* Detailed Payments History Table in Account Statement */}
              <div className="space-y-2 print:space-y-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="font-bold text-slate-900 text-xs print:text-[11px] flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>سجل حركات السداد والدفعات التاريخية وتواريخها والمتبقي:</span>
                  </h4>
                  <span className="text-[11px] print:text-[9pt] text-slate-500 font-mono">
                    إجمالي الحركات: {selectedContact.paymentHistory ? selectedContact.paymentHistory.length : 0}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-right border-collapse text-xs print:text-[9.5pt]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-2.5 print:p-1 text-center w-8">#</th>
                        <th className="p-2.5 print:p-1 w-28">رقم السند</th>
                        <th className="p-2.5 print:p-1 w-24">تاريخ السداد</th>
                        <th className="p-2.5 print:p-1 text-left w-32 font-mono">المبلغ المسدد (د.ع)</th>
                        <th className="p-2.5 print:p-1 text-left w-32 font-mono">المتبقي بعد الدفعة (د.ع)</th>
                        <th className="p-2.5 print:p-1 w-20 text-center">طريقة الدفع</th>
                        <th className="p-2.5 print:p-1">البيان والشرح</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedContact.paymentHistory && selectedContact.paymentHistory.length > 0 ? (
                        selectedContact.paymentHistory.map((p, pIdx) => (
                          <tr key={p.id || pIdx} className="hover:bg-slate-50/70">
                            <td className="p-2.5 print:p-1 text-center font-mono font-bold text-slate-400">{pIdx + 1}</td>
                            <td className="p-2.5 print:p-1 font-mono font-bold text-blue-700">{p.voucherNumber}</td>
                            <td className="p-2.5 print:p-1 font-mono text-slate-700">{p.date}</td>
                            <td className="p-2.5 print:p-1 text-left font-mono font-black text-emerald-700">
                              {new PreciseMoney(p.amount).formatIQD()}
                            </td>
                            <td className="p-2.5 print:p-1 text-left font-mono font-bold text-rose-700">
                              {new PreciseMoney(p.remainingAfter).formatIQD()}
                            </td>
                            <td className="p-2.5 print:p-1 text-center text-[10px]">
                              {p.paymentMethod === 'CASH' ? 'نقداً (صندوق)' : p.paymentMethod === 'BANK' ? 'تحويل مصرفي' : 'صك / شيك'}
                            </td>
                            <td className="p-2.5 print:p-1 text-slate-600">{p.notes || 'دفعة مسددة من الحساب'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-3 text-center text-slate-400">
                            لا توجد حركات سداد مالية مسجلة حتى تاريخ إصدار هذا الكشف.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statement Note */}
              <div className="bg-slate-50 p-3 print:p-2 rounded-lg border border-slate-200 text-xs print:text-[9.5pt] text-slate-600">
                <strong>ملاحظة الاعتماد:</strong> هذا الكشف صادر آلياً من نظام NOAK ERP ويعتبر مطابقاً لقيود اليومية العامة حتى تاريخ إصداره.
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-center text-xs print:text-[9.5pt] text-slate-700 pt-6 print:pt-3 border-t border-slate-200 print-avoid-break">
                <div>
                  <p className="font-bold mb-8 print:mb-2">المحاسب المسؤول:</p>
                  <p className="text-slate-400">التوقيع: ............................</p>
                </div>
                <div>
                  <p className="font-bold mb-8 print:mb-2">إدارة الحسابات والتدقيق:</p>
                  <p className="text-slate-400">الختم الرسمي لشركة نوك للديكور الداخلي والألمنيوم</p>
                </div>
              </div>
            </div>

            {/* Modal Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setIsStatementModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PAYMENT / RECEIPT VOUCHER MODAL */}
      {isPaymentModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>
                  {selectedContact.type === 'CUSTOMER' ? 'تسجيل سند قبض' : 'تسجيل سند دفع'}
                </span>
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {(() => {
              const currentRemaining = new PreciseMoney(selectedContact.remainingAmount);
              const cleanAmt = cleanNumeric(paymentAmount);
              const enteredPM = cleanAmt && !isNaN(Number(cleanAmt)) && Number(cleanAmt) > 0 ? new PreciseMoney(cleanAmt) : null;
              const isOverpaid = enteredPM && enteredPM.greaterThan(currentRemaining) && currentRemaining.greaterThan(0);
              const excessDiff = isOverpaid && enteredPM ? enteredPM.sub(currentRemaining) : PreciseMoney.zero();
              const isZeroBalance = currentRemaining.isZero() || currentRemaining.isNegative();

              return (
                <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">اسم الحساب / الجهة:</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {selectedContact.type === 'CUSTOMER' ? 'حساب عميل' : 'حساب مورد'}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{selectedContact.name}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-xs">
                      <span className="text-slate-500">الرصيد المتبقي بذمة الحساب:</span>
                      <strong className={`font-black ${currentRemaining.isPositive() ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {currentRemaining.formatIQD()}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700">
                        المبلغ (د.ع) <span className="text-rose-500">*</span>:
                      </label>
                      {currentRemaining.isPositive() && (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setPaymentAmount(formatThousands(currentRemaining.toDbString(0)))}
                            className="text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded font-bold transition border border-emerald-200"
                          >
                            كامل المتبقي
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentAmount(formatThousands(currentRemaining.div(2).toDbString(0)))}
                            className="text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded font-semibold transition border border-blue-200"
                          >
                            نصف المتبقي
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        placeholder="أدخل أي قيمة تريدها، مثال: 1,500,000"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(formatInputNumber(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                        د.ع
                      </div>
                    </div>

                    {/* Live Formatted Number & Arabic Tafqeet Badge */}
                    {enteredPM && enteredPM.isPositive() && (
                      <div className="mt-2 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-emerald-800 font-bold">المبلغ المنسق بفواصل الآلاف:</span>
                          <span className="font-mono font-black text-emerald-950 text-sm">
                            {enteredPM.formatIQD()}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-900 font-medium pt-1 border-t border-emerald-200/60 flex items-start gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>فقط {tafqeetIQD(enteredPM.toDbString(0))} لا غير.</span>
                        </div>
                      </div>
                    )}

                    {/* Overpayment Warning Alert */}
                    {isOverpaid && (
                      <div className="mt-2.5 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          <span>تنبيه: قيمة الدفعة أعلى من الرصيد المتبقي!</span>
                        </div>
                        <p className="text-amber-800 leading-relaxed font-medium">
                          المبلغ المدخل (<strong className="font-mono font-bold text-amber-950">{enteredPM?.formatIQD()}</strong>) يتجاوز الرصيد المتبقي بذمة العميل (<strong className="font-mono font-bold text-amber-950">{currentRemaining.formatIQD()}</strong>) بزيادة قدرها (<strong className="font-mono font-bold text-amber-950">+{excessDiff.formatIQD()}</strong>).
                        </p>
                        <p className="text-[11px] text-amber-700 font-medium bg-amber-100/70 p-1.5 rounded-lg">
                          ✓ يمكنك إدخال واعتماد أي قيمة تريدها بحرية؛ سيتم قبول السند وقيد الفائض كدفعة مقدمة ورصيد دائن لصالح العميل.
                        </p>
                      </div>
                    )}

                    {/* Zero Balance Notice */}
                    {isZeroBalance && enteredPM && enteredPM.isPositive() && (
                      <div className="mt-2.5 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-start gap-2 animate-in fade-in">
                        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">ملاحظة: الرصيد السابق خالص (0 د.ع)</strong>
                          <p className="text-sky-700 mt-0.5 text-[11px]">
                            سيتم تسجيل هذا السند بصورة نظامية كدفعة مقدمة / رصيد دائن لصالح العميل.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">طريقة الدفع:</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="CASH">نقداً</option>
                        <option value="BANK">تحويل مصرفي</option>
                        <option value="CHEQUE">شيك</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">تاريخ الدفعة:</label>
                      <input
                        type="date"
                        required
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">البيان:</label>
                    <input
                      type="text"
                      placeholder="دفعة تحت الحساب أو سداد قسط..."
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>
                        {selectedContact.type === 'CUSTOMER' ? 'تأكيد سند القبض' : 'تأكيد سند الدفع'}
                      </span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* 7. ADD NEW PROJECT MODAL (إضافة مشروع جديد بكامل تفاصيله) */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">إضافة مشروع جديد</h3>
                </div>
              </div>
              <button
                onClick={() => setIsAddProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
              >
                ✕
              </button>
            </div>

            {/* Error Banner */}
            {newProjectError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{newProjectError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              {/* Top Row: Auto Sequence & Division Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    رقم المشروع:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={SequenceFormatter.formatNumber('PROJECT', new Date().getFullYear(), projects.length + 1)}
                      className="w-full p-2.5 bg-slate-200/80 border border-slate-300 rounded-xl font-mono font-black text-slate-800 text-sm select-all cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-1.5 rounded-lg whitespace-nowrap font-semibold">
                      تلقائي
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    القسم <span className="text-rose-500">*</span>:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewProjectDivision('WOOD');
                        if (newProjectManager === 'م. بلال الحديثي') {
                          setNewProjectManager('م. أحمد الخشاب');
                        }
                      }}
                      className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                        newProjectDivision === 'WOOD'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>قسم النجارة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewProjectDivision('ALUMINUM');
                        if (newProjectManager === 'م. أحمد الخشاب') {
                          setNewProjectManager('م. بلال الحديثي');
                        }
                      }}
                      className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                        newProjectDivision === 'ALUMINUM'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                          : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span>قسم الألمنيوم</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  اسم المشروع <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تفصيل مطبخ مودرن وأبواب قشرة بلوط..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Customer Selector / Creator */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">
                    العميل <span className="text-rose-500">*</span>:
                  </label>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setNewProjectCustomerMode('EXISTING')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        newProjectCustomerMode === 'EXISTING'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      عميل مسجل
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProjectCustomerMode('NEW')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        newProjectCustomerMode === 'NEW'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      عميل جديد
                    </button>
                  </div>
                </div>

                {newProjectCustomerMode === 'EXISTING' ? (
                  <select
                    value={newProjectCustomerId}
                    onChange={(e) => {
                      setNewProjectCustomerId(e.target.value);
                      const c = contacts.find((item) => item.id === e.target.value);
                      if (c) setNewProjectCustomerName(c.name);
                    }}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="">-- اختر العميل --</option>
                    {contacts
                      .filter((c) => c.type === 'CUSTOMER')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - كود: {c.code}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="اسم العميل الكامل أو الشركة..."
                        value={newProjectCustomerName}
                        onChange={(e) => setNewProjectCustomerName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="رقم الهاتف: 0770XXXXXXX"
                        value={newProjectCustomerPhone}
                        onChange={(e) => setNewProjectCustomerPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Financial & Contract Amounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    قيمة العقد (د.ع) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="مثال: 15,000,000"
                    value={newProjectContractAmount}
                    onChange={(e) => setNewProjectContractAmount(formatInputNumber(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {newProjectContractAmount && Number(cleanNumeric(newProjectContractAmount)) > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      القيمة المنسقة: {new PreciseMoney(newProjectContractAmount).formatIQD()}
                    </span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    الدفعة المقدمة (د.ع):
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={newProjectCollectedAmount}
                    onChange={(e) => setNewProjectCollectedAmount(formatInputNumber(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {newProjectCollectedAmount && Number(cleanNumeric(newProjectCollectedAmount)) > 0 && (
                    <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">
                      المبلغ المنسق: {new PreciseMoney(newProjectCollectedAmount).formatIQD()}
                    </span>
                  )}
                </div>
              </div>

              {/* Stage, Status & Manager */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المرحلة الحالية:</label>
                  <select
                    value={newProjectCurrentStage}
                    onChange={(e) => setNewProjectCurrentStage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="تصميم ومقاسات">تصميم ومقاسات</option>
                    <option value="شراء وتجهيز المواد">شراء وتجهيز المواد</option>
                    <option value="تصنيع في الورشة">تصنيع في الورشة</option>
                    <option value="تركيب في الموقع">تركيب في الموقع</option>
                    <option value="تسليم نهائي وضمان">تسليم نهائي وضمان</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">حالة المشروع:</label>
                  <select
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="IN_PROGRESS">قيد التنفيذ</option>
                    <option value="OPEN">مسودة / مفتوح</option>
                    <option value="COMPLETED">منجز ومسلم</option>
                    <option value="ON_HOLD">معلق مؤقتاً</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المهندس المشرف:</label>
                  <input
                    type="text"
                    value={newProjectManager}
                    onChange={(e) => setNewProjectManager(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Timeline Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ البدء:</label>
                  <input
                    type="date"
                    value={newProjectStartDate}
                    onChange={(e) => setNewProjectStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ التسليم:</label>
                  <input
                    type="date"
                    value={newProjectExpectedEndDate}
                    onChange={(e) => setNewProjectExpectedEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات:</label>
                <textarea
                  rows={2}
                  placeholder="المواصفات الفنية، شروط العقد، تفاصيل المقاطع..."
                  value={newProjectNotes}
                  onChange={(e) => setNewProjectNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ المشروع</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 8. QUOTATION EDITOR MODAL (تحرير وكتابة وتعديل عروض الأسعار مع رفع الصور والمخططات) */}
      {isQuotationEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingQuoId ? `تعديل عرض السعر [${editQuoNumber}]` : 'إنشاء عرض سعر جديد'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsQuotationEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
              >
                ✕
              </button>
            </div>

            {/* Error Banner */}
            {editQuoError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editQuoError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveQuotation('APPROVED');
              }}
              className="space-y-5 text-xs"
            >
              {/* Section 1: Basic Info & Division */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم العرض:</label>
                  <input
                    type="text"
                    readOnly
                    value={editQuoNumber}
                    className="w-full p-2.5 bg-slate-200/80 border border-slate-300 rounded-xl font-mono font-bold text-slate-800 select-all cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">القسم <span className="text-rose-500">*</span>:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditQuoDivision('WOOD')}
                      className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                        editQuoDivision === 'WOOD'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>النجارة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditQuoDivision('ALUMINUM')}
                      className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                        editQuoDivision === 'ALUMINUM'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span>الألمنيوم</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">التاريخ:</label>
                  <input
                    type="date"
                    required
                    value={editQuoDate}
                    onChange={(e) => setEditQuoDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">الصلاحية (أيام):</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={editQuoValidDays}
                    onChange={(e) => setEditQuoValidDays(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="font-bold text-slate-700 block mb-1">
                    موضوع العرض <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تجهيز قاعات إدارة ومكاتب ديكور خشب..."
                    value={editQuoSubject}
                    onChange={(e) => setEditQuoSubject(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Section 2: Customer Selection / Input */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>بيانات العميل <span className="text-rose-500">*</span></span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setEditQuoCustomerMode('EXISTING')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        editQuoCustomerMode === 'EXISTING'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      عميل مسجل
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditQuoCustomerMode('CUSTOM');
                        setEditQuoCustomerId(`cust-manual-${Date.now()}`);
                      }}
                      className={`px-2.5 py-1 rounded-md transition ${
                        editQuoCustomerMode === 'CUSTOM'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      عميل جديد
                    </button>
                  </div>
                </div>

                {editQuoCustomerMode === 'EXISTING' ? (
                  <div>
                    <select
                      value={editQuoCustomerId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setEditQuoCustomerId(selectedId);
                        const c = contacts.find((item) => item.id === selectedId);
                        if (c) {
                          setEditQuoCustomerName(c.name);
                          setEditQuoCustomerPhone(c.phone || '');
                          setEditQuoCustomerAddress(c.address || '');
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="">-- اختر العميل من الدليل التجاري --</option>
                      {contacts
                        .filter((c) => c.type === 'CUSTOMER')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.phone}) - {c.address || 'العراق'}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">اسم العميل التجاري أو الشخصي:</label>
                    <input
                      type="text"
                      required
                      placeholder="اسم العميل أو المؤسسة..."
                      value={editQuoCustomerName}
                      onChange={(e) => setEditQuoCustomerName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">رقم الهاتف والاتصال:</label>
                    <input
                      type="text"
                      placeholder="0770XXXXXXX"
                      value={editQuoCustomerPhone}
                      onChange={(e) => setEditQuoCustomerPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">العنوان أو موقع المشروع:</label>
                    <input
                      type="text"
                      placeholder="المدينة، الحي أو الشارع..."
                      value={editQuoCustomerAddress}
                      onChange={(e) => setEditQuoCustomerAddress(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Dynamic Quotation Lines Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      <span>جدول الكميات والبنود</span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuotationLine}
                    className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ إضافة بند</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-3 w-10 text-center">#</th>
                        <th className="p-3">وصف البند</th>
                        <th className="p-3 w-24 text-center">الكمية</th>
                        <th className="p-3 w-28 text-center">الوحدة</th>
                        <th className="p-3 w-36 text-left">السعر الإفرادي (د.ع)</th>
                        <th className="p-3 w-36 text-left">الإجمالي (د.ع)</th>
                        <th className="p-3 w-12 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editQuoLines.map((line, idx) => (
                        <tr key={line.id || idx} className="hover:bg-slate-50/60">
                          <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2">
                            <textarea
                              rows={2}
                              required
                              placeholder="اكتب مواصفات البند (نوع الخشب، السماكة، نوع الألمنيوم، المقاطع، الإكسسوارات)..."
                              value={line.description}
                              onChange={(e) => handleUpdateQuotationLine(idx, 'description', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              required
                              min="0.1"
                              step="any"
                              value={line.quantity}
                              onChange={(e) => handleUpdateQuotationLine(idx, 'quantity', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-slate-800 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={line.unit}
                              onChange={(e) => handleUpdateQuotationLine(idx, 'unit', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-semibold text-xs"
                            >
                              <option value="قطعة">قطعة</option>
                              <option value="متر مربع">متر مربع</option>
                              <option value="متر طولي">متر طولي</option>
                              <option value="طقم">طقم</option>
                              <option value="باب">باب</option>
                              <option value="شباك">شباك</option>
                              <option value="لوح">لوح</option>
                              <option value="جلسة">جلسة</option>
                              <option value="مقطع">مقطع</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              required
                              value={formatThousands(line.unitPrice)}
                              onChange={(e) => handleUpdateQuotationLine(idx, 'unitPrice', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-left font-mono font-bold text-slate-800 text-xs"
                            />
                          </td>
                          <td className="p-3 font-mono font-black text-slate-900 text-left whitespace-nowrap">
                            {new PreciseMoney(line.lineTotal || 0).formatIQD()}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveQuotationLine(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="حذف البند"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal, Discount & Grand Total */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-900 text-white rounded-2xl">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">المجموع التراكمي للبنود:</span>
                    <span className="text-lg font-black font-mono text-slate-200">
                      {editQuoLines
                        .reduce((acc, line) => acc.add(new PreciseMoney(line.lineTotal || 0)), PreciseMoney.zero())
                        .formatIQD()}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">الخصم (د.ع):</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatThousands(editQuoDiscount)}
                      onChange={(e) => setEditQuoDiscount(formatInputNumber(e.target.value))}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl font-mono font-bold text-amber-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="text-left">
                    <span className="text-xs text-emerald-400 font-bold block mb-1">الإجمالي النهائي:</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {editQuoLines
                        .reduce((acc, line) => acc.add(new PreciseMoney(line.lineTotal || 0)), PreciseMoney.zero())
                        .sub(new PreciseMoney(editQuoDiscount || 0))
                        .formatIQD()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Attach Decor Images & Blueprints (الصور والمخططات) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>إرفاق صور الديكورات والمخططات</span>
                    </h4>
                  </div>

                  {/* Upload Trigger Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ صورة ديكور</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadQuotationImages(e, 'DECOR')}
                      />
                    </label>

                    <label className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ مخطط هندسي</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadQuotationImages(e, 'BLUEPRINT')}
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Images Grid */}
                {editQuoImages.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-slate-400">
                    <p className="font-bold text-xs text-slate-600">لا توجد صور أو مخططات مرفقة حالياً</p>
                    <p className="text-[11px] mt-0.5">انقر على الأزرار أعلاه لرفع صور تصاميم الديكورات والمخططات الهندسية</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {editQuoImages.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {img.type === 'DECOR' ? '🎨 ديكور 3D' : '📐 مخطط كروكي'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuotationImage(img.id)}
                            className="absolute top-2 left-2 bg-rose-600/90 text-white p-1 rounded-full hover:bg-rose-700 transition"
                            title="حذف الصورة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-2.5 space-y-1.5">
                          <input
                            type="text"
                            placeholder="عنوان أو اسم التصميم..."
                            value={img.name}
                            onChange={(e) => {
                              const updated = [...editQuoImages];
                              updated[idx].name = e.target.value;
                              setEditQuoImages(updated);
                            }}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                          />
                          <input
                            type="text"
                            placeholder="ملاحظات فنية عن المخطط..."
                            value={img.notes || ''}
                            onChange={(e) => {
                              const updated = [...editQuoImages];
                              updated[idx].notes = e.target.value;
                              setEditQuoImages(updated);
                            }}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 5: Commercial Conditions & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">شروط الدفع وجدول الدفعات:</label>
                  <textarea
                    rows={2}
                    placeholder="مثال: 50% دفعة مقدمة عند توقيع العقد، 40% عند اكتمال التصنيع، 10% بعد التسليم والتركيب..."
                    value={editQuoPaymentTerms}
                    onChange={(e) => setEditQuoPaymentTerms(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">الضمان والملاحظات:</label>
                  <textarea
                    rows={2}
                    placeholder="الأسعار شاملة التوصيل والتركيب مع ضمان صيانة..."
                    value={editQuoNotes}
                    onChange={(e) => setEditQuoNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Print Display Setting */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editQuoShowItemized}
                    onChange={(e) => setEditQuoShowItemized(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>إظهار الأسعار التفصيلية في الطباعة</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsQuotationEditorOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  إلغاء
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveQuotation('DRAFT')}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
                  >
                    حفظ كمسودة
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-95 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>اعتماد العرض</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. OFFICIAL CONTRACT SIGNING MODAL (تحويل العرض الموافق عليه إلى عقد لتوقيعه واعتماده للعمل) */}
      {isContractModalOpen && activeContract && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 printable-modal">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full multi-page-doc">
            {/* Modal Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileSignature className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    عقد مقاولة وتصنيع
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة العقد (A4)</span>
                </button>
                <button
                  onClick={() => setIsContractModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Legal Contract Paper Document */}
            <div className="space-y-6 text-xs text-slate-800 print:text-[10pt] print:space-y-4">
              {/* Contract Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="text-sm print:text-xs font-bold bg-blue-900 text-white px-3 py-1 print:py-0.5 rounded-lg inline-block mb-1 shadow-xs whitespace-nowrap">
                    عقد عمل ملزم
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    رقم العقد: {activeContract.contractNumber}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-600 whitespace-nowrap">
                    تاريخ التوقيع: {activeContract.date}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-600 whitespace-nowrap">
                    تاريخ التسليم: {activeContract.deliveryDate}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-emerald-700 font-bold whitespace-nowrap">
                    مرتبط بعرض السعر: {activeContract.quotationNumber}
                  </p>
                </div>
              </div>

              {/* Contract Preamble (ديباجة العقد - مطابقة لسند القبض) */}
              <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200 space-y-2 print-avoid-break voucher-card">
                <p className="font-bold text-slate-900 text-sm print:text-xs border-b border-slate-200 pb-2 print:pb-1">
                  بعون الله تعالى تم الاتفاق والتراضي بين كل من:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">الطرف الأول (المقاول والجهة المنفذة):</span>
                    <p className="font-black text-emerald-800 text-sm print:text-xs">شركة نوك للديكور الداخلي والألمنيوم</p>
                    <p className="text-slate-600 mt-0.5 print:text-[10px]">الممثل المفوض: المدير العام / مدير الحسابات</p>
                    <p className="text-slate-500 text-[11px] print:text-[10px]">المقر: كربلاء المقدسة - طريق النجف - عمود 1255</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">الطرف الثاني (العميل والمالك):</span>
                    <p className="font-black text-blue-900 text-sm print:text-xs">{activeContract.customerName}</p>
                    <p className="text-slate-600 mt-0.5 print:text-[10px] font-mono">الهاتف: {activeContract.customerPhone || 'مسجل بالعقد'}</p>
                    <p className="text-slate-500 text-[11px] print:text-[10px]">العنوان: {activeContract.customerAddress || 'كربلاء المقدسة - العراق'}</p>
                  </div>
                </div>
              </div>

              {/* Clauses (بنود العقد) */}
              <div className="space-y-4 print:space-y-3">
                <div className="print-avoid-break">
                  <h4 className="font-black text-slate-900 text-sm print:text-xs mb-1.5">البند الأول: موضوع العقد ونطاق العمل</h4>
                  <p className="bg-slate-50 p-3 print:p-2 rounded-lg border border-slate-200 leading-relaxed font-semibold">
                    {activeContract.scopeOfWork || 'تصنيع وتوريد وتركيب بنود الأعمال والمواصفات الفنية المعتمدة بعرض السعر.'}
                  </p>
                </div>

                <div className="print-avoid-break">
                  <h4 className="font-black text-slate-900 text-sm print:text-xs mb-1.5">
                    البند الثاني: القيمة المالية الإجمالية وجدول الدفعات
                  </h4>
                  <div className="p-3 print:p-2 bg-slate-900 text-white rounded-xl flex justify-between items-center mb-2">
                    <span className="font-bold">القيمة الكلية المتفق عليها للعقد:</span>
                    <span className="text-xl print:text-base font-black font-mono text-emerald-400">
                      {new PreciseMoney(activeContract.totalAmount).formatIQD()}
                    </span>
                  </div>

                  {/* Installments Table */}
                  <table className="w-full text-right border-collapse border border-slate-200 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                        <th className="p-2 border-l border-slate-200 w-12 text-center">الدفعة</th>
                        <th className="p-2 border-l border-slate-200">بيان مرحلة الاستحقاق</th>
                        <th className="p-2 border-l border-slate-200 w-28 text-left">المبلغ (د.ع)</th>
                        <th className="p-2 w-24 text-center">حالة السداد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeContract.installments.map((inst, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border-l border-slate-200 text-center font-mono font-bold">{idx + 1}</td>
                          <td className="p-2 border-l border-slate-200 font-semibold">{inst.description}</td>
                          <td className="p-2 border-l border-slate-200 font-mono font-bold text-left">
                            {new PreciseMoney(inst.amount).formatIQD()}
                          </td>
                          <td className="p-2 text-center">
                            {inst.isPaid ? (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                تم السداد ✓
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                تستحق بالمرحلة
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="print-avoid-break">
                  <h4 className="font-black text-slate-900 text-sm print:text-xs mb-1.5">البند الثالث: مدة التنفيذ وفترة الضمان</h4>
                  <div className="bg-slate-50 p-3 print:p-2 rounded-lg border border-slate-200 space-y-1">
                    <p>
                      <strong>مدة الإنجاز والتسليم:</strong> يلتزم الطرف الأول بتسليم كافة الأعمال في الموقع بتاريخ أقصاه{' '}
                      <span className="font-mono font-bold text-slate-900">{activeContract.deliveryDate}</span>.
                    </p>
                    <p>
                      <strong>فترة الضمان والصيانة:</strong> {activeContract.warrantyTerms}
                    </p>
                    <p>
                      <strong>الشروط الجزائية:</strong> {activeContract.penaltyClause}
                    </p>
                  </div>
                </div>
              </div>

              {/* Signatures & Stamps */}
              <div className="grid grid-cols-2 gap-8 text-center pt-8 print:pt-4 border-t-2 border-slate-800 print-avoid-break">
                <div>
                  <p className="font-bold mb-10 print:mb-6">الطرف الثاني (العميل / المالك):</p>
                  <p className="text-slate-800 font-bold">{activeContract.customerName}</p>
                  <p className="text-slate-400 mt-1">التوقيع: .......................................</p>
                </div>
                <div>
                  <p className="font-bold mb-10 print:mb-6">الطرف الأول (شركة نوك للديكور الداخلي والألمنيوم):</p>
                  <p className="text-slate-800 font-bold">المدير العام / م. أحمد الخشاب</p>
                  <p className="text-slate-400 mt-1">الختم الرسمي والتوقيع المعتمد</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setIsContractModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                إغلاق
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsContractModalOpen(false);
                    setActiveTab('projects');
                  }}
                  className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>الانتقال للمشروع في جدول العمليات</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة العقد الرسمي (A4)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. OFFICIAL RECEIPT VOUCHER MODAL (سند قبض مالي رسمي معتمد مع إظهار كافة الدفعات وتواريخها والدفعة الحالية والمتبقي) */}
      {isReceiptVoucherModalOpen && activeReceiptPayment && activeReceiptContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] printable-modal">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full voucher-single-page">
            {/* Modal Header Toolbar (no-print) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    سند قبض مالي
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptVoucherModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Official Receipt Document */}
            <div className="space-y-6 text-xs text-slate-800 print:space-y-2">
              {/* Receipt Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Official Voucher Metadata (بيانات السند الرسمية على يسار اللوغو) */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="bg-emerald-700 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                    سند قبض مالي رسمي
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    رقم السند: {activeReceiptPayment.voucherNumber}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    تاريخ التحرير: {activeReceiptPayment.date}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    كود العميل: {activeReceiptContact.code}
                  </p>
                </div>
              </div>

              {/* Payer Information Box */}
              <div className="bg-slate-50 p-4 print:p-2 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 print:gap-2 voucher-card">
                <div>
                  <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">اسم العميل / الجهة الدافعة:</span>
                  <p className="font-black text-slate-900 text-sm print:text-xs">{activeReceiptContact.name}</p>
                  <p className="text-slate-600 mt-0.5 print:text-[10px] font-mono">الهاتف: {activeReceiptContact.phone || 'غير مسجل'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 text-[11px] print:text-[10px]">عنوان العميل:</span>
                  <p className="font-bold text-slate-800 text-sm print:text-xs">{activeReceiptContact.address || 'العراق'}</p>
                  <p className="text-slate-600 mt-0.5 print:text-[10px]">
                    <span className="text-slate-400">كود العميل: </span>
                    <span className="font-mono font-bold text-slate-800">{activeReceiptContact.code}</span>
                  </p>
                </div>
              </div>

              {/* 1. CURRENT PAYMENT HIGHLIGHT BOX (الدفعة الحالية المستلمة بموجب هذا السند) */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500/40 p-5 print:p-2.5 rounded-2xl print:rounded-xl space-y-3 print:space-y-1.5 shadow-xs voucher-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2 print:pb-1">
                  <span className="font-bold text-emerald-900 text-sm print:text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 print:w-4 print:h-4 text-emerald-600" />
                    <span>الدفعة الحالية المستلمة بموجب هذا السند:</span>
                  </span>
                  <span className="font-mono text-2xl print:text-lg font-black text-emerald-800">
                    {new PreciseMoney(activeReceiptPayment.amount).formatIQD()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:gap-2 text-xs print:text-[10px]">
                  <div>
                    <span className="text-emerald-800/80 font-bold block mb-0.5">المبلغ تفقيطاً بالأحرف العربية:</span>
                    <p className="font-bold text-emerald-950 bg-white/80 p-2.5 print:p-1.5 rounded-lg border border-emerald-200">
                      {tafqeetIQD(activeReceiptPayment.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-emerald-800/80 font-bold block mb-0.5">طريقة القبض والتحصيل:</span>
                    <p className="font-bold text-emerald-950 bg-white/80 p-2.5 print:p-1.5 rounded-lg border border-emerald-200">
                      {activeReceiptPayment.paymentMethod === 'CASH'
                        ? 'نقداً (في صندوق الشركة الرئيسي)'
                        : activeReceiptPayment.paymentMethod === 'BANK'
                        ? 'تحويل مصرفي (الحساب البنكي الجاري)'
                        : 'صك مصرفي معتمد'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-emerald-800/80 font-bold block mb-0.5 print:text-[10px]">البيان والغرض من الدفعة:</span>
                  <p className="text-slate-800 bg-white/80 p-2.5 print:p-1.5 rounded-lg border border-emerald-200 font-semibold print:text-[10px]">
                    {activeReceiptPayment.notes || 'دفعة مسددة من حساب الأعمال والتعاقد'}
                  </p>
                </div>
              </div>

              {/* 2. COMPLETE INSTALLMENTS & PAYMENTS SCHEDULE (كل الدفعات وتواريخها) */}
              <div className="space-y-2 print:space-y-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 print:pb-1">
                  <h4 className="font-bold text-slate-900 text-xs print:text-[11px] flex items-center gap-1.5">
                    <History className="w-4 h-4 print:w-3.5 print:h-3.5 text-emerald-600" />
                    <span>سجل وجدول كافة الدفعات وتواريخها والمتبقي:</span>
                  </h4>
                  <span className="text-[11px] print:text-[9px] text-slate-500 font-mono">
                    إجمالي الدفعات: {activeReceiptContact.paymentHistory ? activeReceiptContact.paymentHistory.length : 1}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-right border-collapse text-xs print:text-[8.5pt]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-center w-7 print:w-6">#</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 w-24 print:w-20 text-center font-mono">رقم السند</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 w-24 print:w-20 font-mono">تاريخ الدفعة</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-left w-28 print:w-24 font-mono">المبلغ المستلم (د.ع)</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-left w-28 print:w-24 font-mono">المتبقي بعد الدفعة (د.ع)</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 w-16 print:w-14 text-center">طريقة الدفع</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5">البيان والشرح</th>
                        <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 w-24 print:w-20 text-center">حالة السند</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeReceiptContact.paymentHistory && activeReceiptContact.paymentHistory.length > 0 ? (
                        activeReceiptContact.paymentHistory.map((p, idx) => {
                          const isCurrent =
                            p.id === activeReceiptPayment.id || p.voucherNumber === activeReceiptPayment.voucherNumber;
                          return (
                            <tr
                              key={p.id || idx}
                              className={isCurrent ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'hover:bg-slate-50'}
                            >
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-center font-mono font-bold">{idx + 1}</td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-center font-mono font-bold">
                                {(() => {
                                  const parts = p.voucherNumber.split(' - ');
                                  if (parts.length >= 3) {
                                    return (
                                      <div className="leading-tight text-center">
                                        <span className="text-slate-500 text-[10px] print:text-[7.5pt] block whitespace-nowrap">
                                          {parts[0]} - {parts[1]}
                                        </span>
                                        <span className="text-blue-700 text-xs print:text-[8.5pt] font-black block whitespace-nowrap">
                                          {parts[2]}
                                        </span>
                                      </div>
                                    );
                                  }
                                  if (parts.length === 2) {
                                    return (
                                      <div className="leading-tight text-center">
                                        <span className="text-slate-500 text-[10px] print:text-[7.5pt] block whitespace-nowrap">
                                          {parts[0]}
                                        </span>
                                        <span className="text-blue-700 text-xs print:text-[8.5pt] font-black block whitespace-nowrap">
                                          {parts[1]}
                                        </span>
                                      </div>
                                    );
                                  }
                                  return <span className="text-blue-700 whitespace-nowrap">{p.voucherNumber}</span>;
                                })()}
                              </td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 font-mono whitespace-nowrap">{p.date}</td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-left font-mono font-black text-emerald-700 whitespace-nowrap">
                                {new PreciseMoney(p.amount).formatIQD()}
                              </td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-left font-mono font-bold text-rose-700 whitespace-nowrap">
                                {new PreciseMoney(p.remainingAfter).formatIQD()}
                              </td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-center text-[10px] print:text-[8pt] whitespace-nowrap">
                                {p.paymentMethod === 'CASH' ? 'نقداً' : p.paymentMethod === 'BANK' ? 'تحويل' : 'صك'}
                              </td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5">
                                <div className="text-[10px] print:text-[7.5pt] text-slate-700 leading-snug line-clamp-2 break-words max-w-[240px] print:max-w-[190px]">
                                  {p.notes || 'دفعة من الحساب'}
                                </div>
                              </td>
                              <td className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-center whitespace-nowrap">
                                {isCurrent ? (
                                  <span className="bg-emerald-600 text-white px-2 py-0.5 print:py-0 rounded-full text-[10px] print:text-[8pt] font-bold inline-block">
                                    ★ الدفعة الحالية
                                  </span>
                                ) : (
                                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 print:py-0 rounded-full text-[10px] print:text-[8pt] inline-block">
                                    سابقاً ✓
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-3 text-center text-slate-400">
                            لا توجد دفعات أخرى مسجلة.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. FINANCIAL SUMMARY & CURRENT REMAINING BALANCE (المتبقي الحالي) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:gap-2 pt-2 print:pt-1">
                <div className="p-3 print:p-1.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 block mb-0.5 text-[11px] print:text-[9.5pt] font-semibold">إجمالي قيمة التعاقد:</span>
                  <span className="font-mono font-black text-slate-800 text-sm print:text-xs block">
                    {new PreciseMoney(activeReceiptContact.totalAmount).formatIQD()}
                  </span>
                </div>

                <div className="p-3 print:p-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <span className="text-emerald-700 block mb-0.5 text-[11px] print:text-[9.5pt] font-semibold">إجمالي المقبوض شاملاً دفعة اليوم:</span>
                  <span className="font-mono font-black text-emerald-800 text-sm print:text-xs block">
                    {new PreciseMoney(activeReceiptContact.paidAmount).formatIQD()}
                  </span>
                </div>

                <div className="p-3 print:p-1.5 bg-rose-50 rounded-xl border-2 border-rose-300 text-center shadow-xs">
                  <span className="text-rose-700 block mb-0.5 text-[11px] print:text-[9.5pt] font-bold">صافي الرصيد المتبقي بذمة العميل:</span>
                  <span className="font-mono font-black text-rose-800 text-base print:text-sm block">
                    {new PreciseMoney(activeReceiptContact.remainingAmount).formatIQD()}
                  </span>
                </div>
              </div>

              {/* Legal Confirmation & Signatures */}
              <div className="border-t border-slate-200 pt-3 print:pt-1.5 space-y-3 print:space-y-1.5 voucher-signatures">
                <p className="text-[11px] print:text-[9pt] text-slate-500 leading-relaxed bg-slate-50 p-2.5 print:p-1.5 rounded-lg border border-slate-200">
                  <strong>إقرار مالي:</strong> يقر الطرف الأول (شركة نوك للديكور الداخلي والألمنيوم) باستلام المبلغ الموضح في خانة الدفعة الحالية أعلاه من الطرف الثاني (العميل)، وبموجب هذا السند يصبح صافي الرصيد المتبقي بذمة العميل كما هو موضح في خانة الرصيد المتبقي أعلاه.
                </p>

                <div className="grid grid-cols-2 gap-10 text-center text-xs print:text-[9.5pt] text-slate-800 pt-3 print:pt-1.5">
                  <div>
                    <p className="font-bold text-slate-900 mb-8 print:mb-3 text-xs print:text-[9.5pt]">
                      الطرف المسلم (الدافع / العميل):
                    </p>
                    <p className="text-slate-800 font-bold text-[11px] print:text-[9pt]">{activeReceiptContact.name}</p>
                    <p className="text-slate-400 text-[10px] print:text-[8.5pt] mt-1">التوقيع: ............................</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-8 print:mb-3 text-xs print:text-[9.5pt]">
                      الطرف المستلم:
                    </p>
                    <p className="text-slate-800 font-bold text-[11px] print:text-[9pt]">شركة نوك للديكور الداخلي والألمنيوم</p>
                    <p className="text-slate-400 text-[10px] print:text-[8.5pt] mt-1">الختم والتوقيع الرسمي المعتمد: ............................</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setIsReceiptVoucherModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                إغلاق
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة سند القبض الرسمي (A4)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. PROJECT PAYMENTS HISTORY MODAL (سجل الدفعات والمقبوضات للمشروع وسندات القبض) */}
      {isProjectPaymentsModalOpen && activeProjectForPayments && (() => {
        const matchedCustomer = contacts.find(
          (c) =>
            c.id === activeProjectForPayments.customerId ||
            c.name === activeProjectForPayments.customerName ||
            (activeProjectForPayments.customerName && c.name.includes(activeProjectForPayments.customerName))
        );

        const projectPaymentsList: CustomerPayment[] =
          matchedCustomer?.paymentHistory && matchedCustomer.paymentHistory.length > 0
            ? matchedCustomer.paymentHistory
            : Number(activeProjectForPayments.collectedAmount) > 0
            ? [
                {
                  id: `pay-prj-${activeProjectForPayments.id}`,
                  voucherNumber: `RCV-2026-${activeProjectForPayments.projectNumber.replace('PRJ-2026-', '')}`,
                  contactId: matchedCustomer?.id || activeProjectForPayments.customerId,
                  contactName: activeProjectForPayments.customerName || 'العميل المعتمد',
                  amount: activeProjectForPayments.collectedAmount,
                  date: activeProjectForPayments.startDate || '2026-02-01',
                  paymentMethod: 'CASH',
                  remainingAfter: new PreciseMoney(activeProjectForPayments.contractAmount)
                    .sub(new PreciseMoney(activeProjectForPayments.collectedAmount))
                    .toString(),
                  notes: `الدفعة الأولى المقدمة عند توقيع العقد لمشروع ${activeProjectForPayments.name}`,
                  receivedBy: activeProjectForPayments.managerName || 'حيدر الصراف (أمين الصندوق)',
                  projectName: activeProjectForPayments.name,
                  createdAt: activeProjectForPayments.createdAt || '2026-02-01',
                },
              ]
            : [];

        const remainingBalance = new PreciseMoney(activeProjectForPayments.contractAmount).sub(
          new PreciseMoney(activeProjectForPayments.collectedAmount || '0')
        );

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      سجل دفعات المشروع [{activeProjectForPayments.projectNumber}]
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeProjectForPayments.name} - العميل:{' '}
                      <strong className="text-slate-800">{activeProjectForPayments.customerName}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProjectPaymentsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1.5"
                >
                  ✕
                </button>
              </div>

              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-slate-500 block mb-0.5">قيمة العقد:</span>
                  <span className="text-lg font-black font-mono text-slate-900 block">
                    {new PreciseMoney(activeProjectForPayments.contractAmount).formatIQD()}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    القسم:{' '}
                    {activeProjectForPayments.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                    المقبوض:
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-700 block">
                    {new PreciseMoney(activeProjectForPayments.collectedAmount || '0').formatIQD()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                    نسبة السداد:{' '}
                    {Number(activeProjectForPayments.contractAmount) > 0
                      ? Math.round(
                          (Number(activeProjectForPayments.collectedAmount || '0') /
                            Number(activeProjectForPayments.contractAmount)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-rose-800 block mb-0.5">
                    المتبقي بذمة العميل:
                  </span>
                  <span className="text-lg font-black font-mono text-rose-700 block">
                    {remainingBalance.formatIQD()}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold mt-1 block">
                    {remainingBalance.isZero() ? '✓ مسدد بالكامل' : 'مستحق الدفع خلال مراحل العمل'}
                  </span>
                </div>
              </div>

              {/* Payments History Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>جدول الدفعات المسددة وسندات القبض الصادرة:</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    عدد الدفعات: {projectPaymentsList.length}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-visible shadow-xs">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-2.5 text-center w-10">#</th>
                        <th className="p-2.5">رقم السند</th>
                        <th className="p-2.5">تاريخ الدفعة</th>
                        <th className="p-2.5 text-left font-mono">المبلغ المقبوض (د.ع)</th>
                        <th className="p-2.5 text-left font-mono">المتبقي بعد الدفعة (د.ع)</th>
                        <th className="p-2.5 text-center">طريقة الدفع</th>
                        <th className="p-2.5">البيان والشرح</th>
                        <th className="p-2.5 text-center min-w-[150px]">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projectPaymentsList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-slate-700">لا توجد دفعات مقبوضة مسجلة بعد لهذا المشروع</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              يمكنك تسجيل أول دفعة بالضغط على زر استلام دفعة أدناه
                            </p>
                          </td>
                        </tr>
                      ) : (
                        projectPaymentsList.map((pmt, idx) => (
                          <tr key={pmt.id || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-center font-mono font-bold">{idx + 1}</td>
                            <td className="p-2.5 font-mono font-bold text-blue-700">
                              {(() => {
                                if (pmt.voucherNumber.includes('-')) {
                                  const lastHyphen = pmt.voucherNumber.lastIndexOf('-');
                                  const prefix = pmt.voucherNumber.substring(0, lastHyphen);
                                  const suffix = pmt.voucherNumber.substring(lastHyphen + 1);
                                  return (
                                    <div className="leading-tight">
                                      <span className="text-slate-500 text-[10px] block font-mono">{prefix}</span>
                                      <span className="text-blue-700 text-xs font-black block font-mono">{suffix}</span>
                                    </div>
                                  );
                                }
                                return pmt.voucherNumber;
                              })()}
                            </td>
                            <td className="p-2.5 font-mono text-slate-700">{pmt.date}</td>
                            <td className="p-2.5 text-left font-mono font-black text-emerald-700">
                              {new PreciseMoney(pmt.amount).formatIQD()}
                            </td>
                            <td className="p-2.5 text-left font-mono font-bold text-rose-700">
                              {new PreciseMoney(pmt.remainingAfter).formatIQD()}
                            </td>
                            <td className="p-2.5 text-center text-[10px]">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                                {pmt.paymentMethod === 'CASH'
                                  ? 'نقداً'
                                  : pmt.paymentMethod === 'BANK'
                                  ? 'تحويل بنكي'
                                  : 'صك'}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-700 truncate max-w-[200px]">{pmt.notes}</td>
                            <td className="p-2.5 text-center relative">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const effectiveContact: ContactRecord = matchedCustomer || {
                                      id: activeProjectForPayments.customerId,
                                      code: `CUST-${activeProjectForPayments.projectNumber.slice(-3)}`,
                                      name: activeProjectForPayments.customerName || 'العميل المعتمد',
                                      type: 'CUSTOMER',
                                      phone: '0770XXXXXXX',
                                      address: 'العراق',
                                      divisionId: activeProjectForPayments.divisionId,
                                      totalAmount: activeProjectForPayments.contractAmount,
                                      paidAmount: activeProjectForPayments.collectedAmount,
                                      remainingAmount: remainingBalance.toString(),
                                      isActive: true,
                                      createdAt: activeProjectForPayments.startDate,
                                      paymentHistory: projectPaymentsList,
                                    };
                                    setIsProjectPaymentsModalOpen(false);
                                    handleOpenReceiptVoucher(effectiveContact, pmt);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition shadow-2xs"
                                  title="إغلاق سجل الدفعات وعرض سند القبض القابل للطباعة"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>طباعة سند القبض</span>
                                </button>

                                <ActionGearMenu
                                  title="خيارات وإجراءات السند"
                                  align="right"
                                  dropUp={projectPaymentsList.length > 2 && idx >= projectPaymentsList.length - 1}
                                  items={[
                                    {
                                      id: 'print-voucher',
                                      label: 'سند قبض مالي (طباعة)',
                                      description: 'إغلاق سجل الدفعات وعرض سند القبض للطباعة',
                                      icon: <Printer className="w-4 h-4 text-emerald-600" />,
                                      variant: 'success',
                                      onClick: () => {
                                        const effectiveContact: ContactRecord = matchedCustomer || {
                                          id: activeProjectForPayments.customerId,
                                          code: `CUST-${activeProjectForPayments.projectNumber.slice(-3)}`,
                                          name: activeProjectForPayments.customerName || 'العميل المعتمد',
                                          type: 'CUSTOMER',
                                          phone: '0770XXXXXXX',
                                          address: 'العراق',
                                          divisionId: activeProjectForPayments.divisionId,
                                          totalAmount: activeProjectForPayments.contractAmount,
                                          paidAmount: activeProjectForPayments.collectedAmount,
                                          remainingAmount: remainingBalance.toString(),
                                          isActive: true,
                                          createdAt: activeProjectForPayments.startDate,
                                          paymentHistory: projectPaymentsList,
                                        };
                                        setIsProjectPaymentsModalOpen(false);
                                        handleOpenReceiptVoucher(effectiveContact, pmt);
                                      },
                                    },
                                    {
                                      id: 'view-voucher',
                                      label: 'معاينة سند القبض الرسمي',
                                      description: 'معاينة كامل تفاصيل وبيانات السند',
                                      icon: <Receipt className="w-4 h-4 text-blue-600" />,
                                      variant: 'primary',
                                      onClick: () => {
                                        const effectiveContact: ContactRecord = matchedCustomer || {
                                          id: activeProjectForPayments.customerId,
                                          code: `CUST-${activeProjectForPayments.projectNumber.slice(-3)}`,
                                          name: activeProjectForPayments.customerName || 'العميل المعتمد',
                                          type: 'CUSTOMER',
                                          phone: '0770XXXXXXX',
                                          address: 'العراق',
                                          divisionId: activeProjectForPayments.divisionId,
                                          totalAmount: activeProjectForPayments.contractAmount,
                                          paidAmount: activeProjectForPayments.collectedAmount,
                                          remainingAmount: remainingBalance.toString(),
                                          isActive: true,
                                          createdAt: activeProjectForPayments.startDate,
                                          paymentHistory: projectPaymentsList,
                                        };
                                        setIsProjectPaymentsModalOpen(false);
                                        handleOpenReceiptVoucher(effectiveContact, pmt);
                                      },
                                    },
                                  ]}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProjectPaymentsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  إغلاق
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (matchedCustomer) {
                        setSelectedContact(matchedCustomer);
                        setPaymentAmount('');
                        setPaymentNote(`دفعة من حساب مشروع [${activeProjectForPayments.name}]`);
                        setIsProjectPaymentsModalOpen(false);
                        setIsPaymentModalOpen(true);
                      } else {
                        // If no customer matched, select first customer or open customer form
                        const firstCust = contacts.find((c) => c.type === 'CUSTOMER');
                        if (firstCust) {
                          setSelectedContact(firstCust);
                          setPaymentAmount('');
                          setPaymentNote(`دفعة من حساب مشروع [${activeProjectForPayments.name}]`);
                          setIsProjectPaymentsModalOpen(false);
                          setIsPaymentModalOpen(true);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ تسجيل واستلام دفعة جديدة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: NEW ENGINEERING PURCHASE INVOICE & GOODS RECEIPT */}
      {/* ------------------------------------------------------------------ */}
      {isPurchaseInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto flex flex-col max-h-[92vh] overflow-hidden text-right">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    إضافة فاتورة مشتريات
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPurchaseInvoiceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Error Alert */}
              {purchaseError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{purchaseError}</span>
                </div>
              )}

              {/* SECTION 1: HEADER & SUPPLIER INFORMATION */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>بيانات الفاتورة والمورد</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Auto Invoice No */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      رقم الفاتورة *
                    </label>
                    <input
                      type="text"
                      value={purchaseInvoiceNumber}
                      onChange={(e) => setPurchaseInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Supplier Manual Invoice No */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      فاتورة المورد:
                    </label>
                    <input
                      type="text"
                      value={purchaseSupplierInvoiceNo}
                      onChange={(e) => setPurchaseSupplierInvoiceNo(e.target.value)}
                      placeholder="مثال: SUP-2026/894"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      التاريخ *
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Division Switcher */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      القسم *
                    </label>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handlePurchaseDivisionChange('WOOD')}
                        className={`py-1 rounded-lg font-bold text-xs transition ${
                          purchaseDivision === 'WOOD'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        النجارة
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePurchaseDivisionChange('ALUMINUM')}
                        className={`py-1 rounded-lg font-bold text-xs transition ${
                          purchaseDivision === 'ALUMINUM'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        الألمنيوم
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
                  {/* Warehouse Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      المستودع المستلم *
                    </label>
                    <select
                      value={purchaseWarehouseId}
                      onChange={(e) => setPurchaseWarehouseId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
                    >
                      {purchaseDivision === 'WOOD' ? (
                        <option value="wh-wood-1">مستودع قسم النجارة والديكور - المقر الرئيسي</option>
                      ) : (
                        <option value="wh-alm-1">مستودع قسم الألمنيوم والواجهات - المقر الرئيسي</option>
                      )}
                    </select>
                  </div>

                  {/* Supplier Mode & Selector */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        المورد / جهة التوريد *
                      </label>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setPurchaseSupplierMode('EXISTING')}
                          className={`px-2 py-0.5 rounded font-bold transition ${
                            purchaseSupplierMode === 'EXISTING'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          مورد مسجل
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setPurchaseSupplierMode('NEW')}
                          className={`px-2 py-0.5 rounded font-bold transition ${
                            purchaseSupplierMode === 'NEW'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          + مورد جديد
                        </button>
                      </div>
                    </div>

                    {purchaseSupplierMode === 'EXISTING' ? (
                      <select
                        value={purchaseSupplierId}
                        onChange={(e) => setPurchaseSupplierId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
                      >
                        <option value="">-- اختر المورد من القائمة المعتمدة --</option>
                        {contacts
                          .filter((c) => c.type === 'SUPPLIER' && (c.divisionId === purchaseDivision || !c.divisionId))
                          .map((sup) => (
                            <option key={sup.id} value={sup.id}>
                              {sup.name} ({sup.phone || 'بدون هاتف'}) — الرصيد الدائن:{' '}
                              {new PreciseMoney(sup.remainingAmount).formatIQD()}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={purchaseNewSupplierName}
                          onChange={(e) => setPurchaseNewSupplierName(e.target.value)}
                          placeholder="اسم المورد أو الشركة الجديدة *"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
                        />
                        <input
                          type="text"
                          value={purchaseNewSupplierPhone}
                          onChange={(e) => setPurchaseNewSupplierPhone(e.target.value)}
                          placeholder="رقم الهاتف (اختياري)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
                  <div className="text-[11px] font-bold text-slate-600">
                    طريقة الدفع والتسوية المالية:
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(
                      [
                        { id: 'CASH', label: 'نقداً (الصندوق)' },
                        { id: 'CREDIT', label: 'آجل / ذمة على الحساب' },
                        { id: 'BANK', label: 'تحويل بنكي' },
                        { id: 'CHEQUE', label: 'صك مصرفي' },
                      ] as const
                    ).map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          setPurchasePaymentMethod(pm.id);
                          if (pm.id === 'CREDIT') {
                            setPurchasePaidAmount('0');
                          } else if (pm.id === 'CASH' && (!purchasePaidAmount || purchasePaidAmount === '0')) {
                            setPurchasePaidAmount(currentPurchaseGrandTotal.toDbString(2));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          purchasePaymentMethod === pm.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: ITEMIZED MATERIALS TABLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Boxes className="w-4 h-4 text-emerald-600" />
                    <span>جدول بنود المواد</span>
                    <span className="text-[11px] text-slate-400 font-mono">({purchaseLines.length} بند)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPurchaseLine}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ إضافة بند</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-2.5 text-center w-10">#</th>
                          <th className="p-2.5 min-w-[220px]">المادة</th>
                          <th className="p-2.5 w-28">كود الصنف</th>
                          <th className="p-2.5 w-24">الوحدة</th>
                          <th className="p-2.5 w-24 text-center">الكمية</th>
                          <th className="p-2.5 w-32 text-left">سعر الوحدة (د.ع)</th>
                          <th className="p-2.5 w-32 text-left">الإجمالي (د.ع)</th>
                          <th className="p-2.5 min-w-[120px]">ملاحظات</th>
                          <th className="p-2.5 text-center w-12">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {purchaseLines.map((line, idx) => {
                          const lineTot = new PreciseMoney(line.quantity || '0').mul(
                            new PreciseMoney(line.unitCost || '0')
                          );

                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 text-center font-mono font-bold text-slate-400">
                                {idx + 1}
                              </td>

                              {/* Material Name & Quick Catalog Pick */}
                              <td className="p-2.5">
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={line.materialNameAr}
                                    onChange={(e) => handlePurchaseLineChange(idx, 'materialNameAr', e.target.value)}
                                    placeholder="اسم المادة ومواصفاتها..."
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:border-emerald-500 outline-none"
                                  />
                                  {/* Quick Catalog Selector */}
                                  <select
                                    onChange={(e) => handleSelectCatalogMat(idx, e.target.value)}
                                    defaultValue=""
                                    className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 focus:border-emerald-500 outline-none"
                                  >
                                    <option value="" disabled>
                                      ⚡ اختر من دليل المواد القياسية لتعبئة سريعة...
                                    </option>
                                    {inventoryMaterials
                                      .filter((m) => m.divisionId === purchaseDivision)
                                      .map((m) => (
                                        <option key={m.id} value={m.code}>
                                          {m.nameAr} ({m.code})
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </td>

                              {/* Material Code */}
                              <td className="p-2.5">
                                <input
                                  type="text"
                                  value={line.materialCode}
                                  onChange={(e) => handlePurchaseLineChange(idx, 'materialCode', e.target.value)}
                                  placeholder="MAT-00"
                                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 text-xs focus:border-emerald-500 outline-none"
                                />
                              </td>

                              {/* Unit */}
                              <td className="p-2.5">
                                <select
                                  value={line.unit}
                                  onChange={(e) => handlePurchaseLineChange(idx, 'unit', e.target.value)}
                                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:border-emerald-500 outline-none"
                                >
                                  <option value="لوح">لوح</option>
                                  <option value="متر طولي">متر طولي</option>
                                  <option value="متر مربع">متر مربع</option>
                                  <option value="كجم">كجم</option>
                                  <option value="قطعة">قطعة</option>
                                  <option value="طقم">طقم</option>
                                  <option value="لفة">لفة</option>
                                  <option value="علبة">علبة</option>
                                </select>
                              </td>

                              {/* Quantity */}
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  min="0.01"
                                  step="any"
                                  value={line.quantity}
                                  onChange={(e) => handlePurchaseLineChange(idx, 'quantity', e.target.value)}
                                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-center text-slate-900 focus:border-emerald-500 outline-none"
                                />
                              </td>

                              {/* Unit Cost */}
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={line.unitCost}
                                  onChange={(e) => handlePurchaseLineChange(idx, 'unitCost', e.target.value)}
                                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-left text-slate-900 focus:border-emerald-500 outline-none"
                                />
                              </td>

                              {/* Line Total */}
                              <td className="p-2.5 text-left font-mono font-black text-slate-900">
                                {lineTot.formatIQD()}
                              </td>

                              {/* Line Notes */}
                              <td className="p-2.5">
                                <input
                                  type="text"
                                  value={line.notes || ''}
                                  onChange={(e) => handlePurchaseLineChange(idx, 'notes', e.target.value)}
                                  placeholder="ملاحظة أو جودة..."
                                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 focus:border-emerald-500 outline-none"
                                />
                              </td>

                              {/* Remove Line */}
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  disabled={purchaseLines.length <= 1}
                                  onClick={() => handleRemovePurchaseLine(idx)}
                                  className={`p-1.5 rounded-lg transition ${
                                    purchaseLines.length <= 1
                                      ? 'text-slate-300 cursor-not-allowed'
                                      : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                                  }`}
                                  title="حذف هذا البند"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION 3: FINANCIAL SUMMARY & TAFQEET */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>3. المبالغ الإجمالية والخصم والمدفوع والتفقيط</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  {/* Subtotal */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      إجمالي البنود (الفرعي)
                    </span>
                    <span className="text-sm font-black font-mono text-slate-800">
                      {currentPurchaseSubtotal.formatIQD()}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      الخصم (د.ع)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={purchaseDiscount}
                      onChange={(e) => setPurchaseDiscount(formatInputNumber(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-800 focus:border-emerald-500 outline-none text-xs"
                    />
                  </div>

                  {/* Grand Total */}
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                      الصافي النهائي
                    </span>
                    <span className="text-sm font-black font-mono text-emerald-950">
                      {currentPurchaseGrandTotal.formatIQD()}
                    </span>
                  </div>

                  {/* Paid Amount */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600">المبلغ المسدد (د.ع)</label>
                      <button
                        type="button"
                        onClick={() => setPurchasePaidAmount(formatThousands(currentPurchaseGrandTotal.toDbString(0)))}
                        className="text-[10px] text-emerald-600 hover:underline font-bold"
                      >
                        سداد كامل
                      </button>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={purchasePaidAmount}
                      onChange={(e) => setPurchasePaidAmount(formatInputNumber(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-800 focus:border-emerald-500 outline-none text-xs"
                    />
                  </div>

                  {/* Remaining Amount */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      المتبقي للمورد
                    </span>
                    <span
                      className={`text-sm font-black font-mono ${
                        safeCurrentPurchaseRemaining.isZero() ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {safeCurrentPurchaseRemaining.formatIQD()}
                    </span>
                  </div>
                </div>

                {/* Arabic Tafqeet Box */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-900 block">
                      المبلغ كتابةً:
                    </span>
                    <span className="font-semibold text-amber-800 mt-0.5 block">
                      {tafqeetIQD(currentPurchaseGrandTotal.toDbString(2))}
                    </span>
                  </div>
                </div>
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظات:
                </label>
                <textarea
                  rows={2}
                  value={purchaseNotes}
                  onChange={(e) => setPurchaseNotes(e.target.value)}
                  placeholder="ملاحظات التوريد أو الفحص الهندسي..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsPurchaseInvoiceModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إلغاء
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitPurchaseInvoice}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>حفظ الفاتورة وتوريد المواد</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: OFFICIAL PRINTABLE A4 PURCHASE INVOICE & GOODS RECEIPT */}
      {/* ------------------------------------------------------------------ */}
      {isViewInvoiceModalOpen && selectedPurchaseInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 printable-modal">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto flex flex-col max-h-[95vh] overflow-hidden text-right print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full voucher-single-page">
            {/* Modal Controls Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-800">
                  معاينة وطباعة سند توريد وفاتورة المشتريات الرسمية
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedPurchaseInvoice.invoiceNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة السند الرسمي A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewInvoiceModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 Voucher Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 print:p-0 print:overflow-visible">
              <div className="bg-white p-8 print:p-0 border border-slate-200 print:border-none rounded-2xl shadow-sm print:shadow-none space-y-6 print:space-y-2 text-slate-800">
                {/* Official Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                  {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                  <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                    <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                      شركة نوك للديكور الداخلي والألمنيوم
                    </h2>
                    <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                      NOAK WOOD & ALUMINUM INDUSTRIES
                    </p>
                    <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                      كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                    </p>
                    <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                      أرقام التواصل: 07800000000 - 07700000000
                    </p>
                  </div>

                  {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                  <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                    <img
                      src={noakLogo}
                      alt="شركة نوك للديكور الداخلي والألمنيوم"
                      className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                    />
                  </div>

                  {/* Left: Metadata */}
                  <div className="text-left font-mono flex-1 min-w-0 pl-1">
                    <span className="bg-slate-900 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                      سند استلام وتوريد مشتريات
                    </span>
                    <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                      رقم السند: {selectedPurchaseInvoice.invoiceNumber}
                    </p>
                    <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                      تاريخ التوريد: {selectedPurchaseInvoice.date}
                    </p>
                    <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                      المستودع: {selectedPurchaseInvoice.warehouseName}
                    </p>
                  </div>
                </div>

                {/* Voucher Title Banner */}
                <div className="bg-slate-900 text-white py-2.5 print:py-1 px-4 rounded-xl flex items-center justify-between voucher-banner">
                  <span className="font-black text-sm print:text-xs">
                    سند استلام وتوريد مشتريات مخزنية (Goods Receipt & Purchase Voucher)
                  </span>
                  <span className="font-mono text-xs print:text-[10px] text-emerald-400 font-bold">
                    حالة السند: معتمد ومورد للمستودع
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:gap-2 p-4 print:p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs print:text-[10px] voucher-card">
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">رقم السند النظامي:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedPurchaseInvoice.invoiceNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">رقم فاتورة المورد:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedPurchaseInvoice.supplierInvoiceNumber || 'غير محدد'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">تاريخ التوريد:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedPurchaseInvoice.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">طريقة الدفع:</span>
                    <span className="font-bold text-slate-900">
                      {selectedPurchaseInvoice.paymentMethod === 'CASH'
                        ? 'نقداً'
                        : selectedPurchaseInvoice.paymentMethod === 'BANK'
                        ? 'تحويل بنكي'
                        : selectedPurchaseInvoice.paymentMethod === 'CHEQUE'
                        ? 'صك'
                        : 'آجل / ذمة'}
                    </span>
                  </div>
                </div>

                {/* Supplier & Warehouse Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2 text-xs print:text-[10px]">
                  <div className="p-3.5 print:p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 voucher-card">
                    <span className="text-[11px] print:text-[9.5pt] font-bold text-slate-400 block">بيانات المورد / جهة التوريد:</span>
                    <div className="font-black text-slate-900 text-sm print:text-xs">
                      {selectedPurchaseInvoice.supplierName}
                    </div>
                    {selectedPurchaseInvoice.supplierPhone && (
                      <div className="font-mono text-slate-600 print:text-[9pt]">
                        الهاتف: {selectedPurchaseInvoice.supplierPhone}
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 print:p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 voucher-card">
                    <span className="text-[11px] print:text-[9.5pt] font-bold text-slate-400 block">جهة الاستلام والقسم:</span>
                    <div className="font-bold text-slate-900">
                      {selectedPurchaseInvoice.warehouseName}
                    </div>
                    <div className="text-slate-600 print:text-[9pt]">
                      القسم:{' '}
                      {selectedPurchaseInvoice.divisionId === 'WOOD'
                        ? 'قسم النجارة والديكور'
                        : 'قسم الألمنيوم والواجهات'}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right border-collapse text-xs print:text-[9.5pt]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-2.5 print:p-1 text-center w-8">#</th>
                        <th className="p-2.5 print:p-1 w-20">كود المادة</th>
                        <th className="p-2.5 print:p-1">المادة والمواصفة الهندسية</th>
                        <th className="p-2.5 print:p-1 text-center w-14">الوحدة</th>
                        <th className="p-2.5 print:p-1 text-center w-14">الكمية</th>
                        <th className="p-2.5 print:p-1 text-left font-mono w-24">سعر الوحدة</th>
                        <th className="p-2.5 print:p-1 text-left font-mono w-24">الإجمالي (د.ع)</th>
                        <th className="p-2.5 print:p-1">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPurchaseInvoice.lines.map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 print:p-1 text-center font-mono font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="p-2.5 print:p-1 font-mono text-slate-600">{l.materialCode}</td>
                          <td className="p-2.5 print:p-1 font-bold text-slate-800">{l.materialNameAr}</td>
                          <td className="p-2.5 print:p-1 text-center font-bold text-slate-700">{l.unit}</td>
                          <td className="p-2.5 print:p-1 text-center font-mono font-bold text-slate-900">{l.quantity}</td>
                          <td className="p-2.5 print:p-1 text-left font-mono text-slate-700">
                            {new PreciseMoney(l.unitCost).formatIQD()}
                          </td>
                          <td className="p-2.5 print:p-1 text-left font-mono font-black text-slate-900">
                            {new PreciseMoney(l.lineTotal).formatIQD()}
                          </td>
                          <td className="p-2.5 print:p-1 text-slate-500">{l.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary & Tafqeet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
                  {/* Tafqeet & Notes */}
                  <div className="p-4 print:p-2 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 print:space-y-1 text-xs print:text-[10px] voucher-card">
                    <span className="font-bold text-amber-900 block">المبلغ الصافي كتابةً:</span>
                    <div className="font-semibold text-amber-950 leading-relaxed">
                      فقط {tafqeetIQD(selectedPurchaseInvoice.grandTotal)}
                    </div>
                    {selectedPurchaseInvoice.notes && (
                      <div className="pt-2 print:pt-1 border-t border-amber-200/60 text-slate-600">
                        <span className="font-bold block text-slate-700">ملاحظات:</span>
                        {selectedPurchaseInvoice.notes}
                      </div>
                    )}
                  </div>

                  {/* Totals Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs print:text-[9.5pt] divide-y divide-slate-100">
                    <div className="p-2.5 print:p-1 flex items-center justify-between">
                      <span className="text-slate-500 font-bold">المجموع الفرعي:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {new PreciseMoney(selectedPurchaseInvoice.subtotal).formatIQD()}
                      </span>
                    </div>
                    <div className="p-2.5 print:p-1 flex items-center justify-between">
                      <span className="text-slate-500 font-bold">الخصم التجاري:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {new PreciseMoney(selectedPurchaseInvoice.discount).formatIQD()}
                      </span>
                    </div>
                    <div className="p-2.5 print:p-1 flex items-center justify-between bg-slate-50">
                      <span className="text-slate-900 font-black">الصافي الإجمالي:</span>
                      <span className="font-mono font-black text-emerald-900 text-sm print:text-xs">
                        {new PreciseMoney(selectedPurchaseInvoice.grandTotal).formatIQD()}
                      </span>
                    </div>
                    <div className="p-2.5 print:p-1 flex items-center justify-between">
                      <span className="text-emerald-700 font-bold">المبلغ المسدد:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        {new PreciseMoney(selectedPurchaseInvoice.paidAmount).formatIQD()}
                      </span>
                    </div>
                    <div className="p-2.5 print:p-1 flex items-center justify-between bg-slate-50">
                      <span className="text-rose-700 font-bold">الرصيد المتبقي (ذمة دائنة):</span>
                      <span className="font-mono font-black text-rose-800">
                        {new PreciseMoney(selectedPurchaseInvoice.remainingAmount).formatIQD()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-8 print:pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 print:gap-2 text-center text-xs print:text-[9.5pt] voucher-signatures">
                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">أمين المستودع المستلم</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block font-mono">
                      {selectedPurchaseInvoice.receivedBy || 'أمين المستودع'}
                    </span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">التدقيق الفني والهندسي</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">التوقيع والاعتماد</span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">الإدارة المالية والحسابات</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">مطابق للقيود</span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">المورد أو مندوب التسليم</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">
                      {selectedPurchaseInvoice.supplierName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                وثيقة نظامية صادرة آلياً من منظومة NOAK ERP
              </span>
              <button
                type="button"
                onClick={() => setIsViewInvoiceModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: NEW GENERAL EXPENSE VOUCHER */}
      {/* ------------------------------------------------------------------ */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-auto flex flex-col max-h-[92vh] overflow-hidden text-right">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    تسجيل سند صرف
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewExpenseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitNewExpense} className="p-5 overflow-y-auto space-y-4 flex-1">
              {newExpenseError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{newExpenseError}</span>
                </div>
              )}

              {/* Grid 1: Voucher Number & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    رقم سند الصرف *
                  </label>
                  <input
                    type="text"
                    value={newExpenseVoucherNo}
                    onChange={(e) => setNewExpenseVoucherNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    تاريخ الصرف *
                  </label>
                  <input
                    type="date"
                    value={newExpenseDate}
                    onChange={(e) => setNewExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  بند وتصنيف المصروف *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {(
                    [
                      { id: 'ELECTRICITY', label: 'فواتير الكهرباء والمولد', icon: <Zap className="w-3.5 h-3.5 text-amber-600" /> },
                      { id: 'INTERNET', label: 'الإنترنت والاتصالات', icon: <Wifi className="w-3.5 h-3.5 text-sky-600" /> },
                      { id: 'RENT', label: 'إيجار المعمل والورش', icon: <Building2 className="w-3.5 h-3.5 text-indigo-600" /> },
                      { id: 'MAINTENANCE', label: 'الصيانة والتشغيل', icon: <Wrench className="w-3.5 h-3.5 text-rose-600" /> },
                      { id: 'SALARIES', label: 'رواتب الموظفين والعمال', icon: <Users className="w-3.5 h-3.5 text-purple-600" /> },
                      { id: 'HOSPITALITY', label: 'ضيافة ونثريات مكتبية', icon: <Sparkles className="w-3.5 h-3.5 text-teal-600" /> },
                      { id: 'FUEL_TRANSPORT', label: 'وقود ونقل ولوجستيات', icon: <TrendingUp className="w-3.5 h-3.5 text-orange-600" /> },
                      { id: 'OTHER', label: 'مصروفات أخرى', icon: <Layers className="w-3.5 h-3.5 text-slate-600" /> },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewExpenseCategory(item.id)}
                      className={`p-2 rounded-xl border text-right transition flex items-center gap-1.5 ${
                        newExpenseCategory === item.id
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {item.icon}
                      <span className="truncate text-[11px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Division Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  القسم *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewExpenseDivision('WOOD')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      newExpenseDivision === 'WOOD'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                    <span>قسم النجارة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewExpenseDivision('ALUMINUM')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      newExpenseDivision === 'ALUMINUM'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                    <span>قسم الألمنيوم</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewExpenseDivision('SHARED')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      newExpenseDivision === 'SHARED'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>مشترك</span>
                  </button>
                </div>
              </div>

              {/* Beneficiary & Reference Bill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    المستلم *
                  </label>
                  <input
                    type="text"
                    value={newExpenseBeneficiary}
                    onChange={(e) => setNewExpenseBeneficiary(e.target.value)}
                    placeholder="مثال: دائرة الكهرباء، مالك المعمل، اسم الموظف..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    رقم الوصل (اختياري):
                  </label>
                  <input
                    type="text"
                    value={newExpenseRefInvoiceNo}
                    onChange={(e) => setNewExpenseRefInvoiceNo(e.target.value)}
                    placeholder="مثال: REC-9823 أو INV-4421"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Amount & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    المبلغ (د.ع) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(formatInputNumber(e.target.value))}
                      placeholder="أدخل مبلغ الصرف، مثال: 500,000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-black text-emerald-800 text-sm focus:border-emerald-500 outline-none"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                      د.ع
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    طريقة الدفع *
                  </label>
                  <select
                    value={newExpensePaymentMethod}
                    onChange={(e) => setNewExpensePaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
                  >
                    <option value="CASH">نقداً</option>
                    <option value="BANK">تحويل مصرفي</option>
                    <option value="CHEQUE">شيك</option>
                  </select>
                </div>
              </div>

              {/* Live Arabic Tafqeet Box & Formatted Comma Badge */}
              {newExpenseAmount && Number(cleanNumeric(newExpenseAmount)) > 0 && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">المبلغ المنسق بفواصل الآلاف:</span>
                    <span className="font-mono font-black text-amber-950 text-sm">
                      {new PreciseMoney(newExpenseAmount).formatIQD()}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 pt-1 border-t border-amber-200/60 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">
                      فقط {tafqeetIQD(cleanNumeric(newExpenseAmount))} لا غير.
                    </span>
                  </div>
                </div>
              )}

              {/* Purpose & Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  البيان *
                </label>
                <textarea
                  rows={2}
                  value={newExpenseNotes}
                  onChange={(e) => setNewExpenseNotes(e.target.value)}
                  placeholder="وصف وتفاصيل المصروف والسبب..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ سند الصرف</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: OFFICIAL PRINTABLE A4 PAYMENT VOUCHER */}
      {/* ------------------------------------------------------------------ */}
      {isPrintExpenseModalOpen && selectedExpenseForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 printable-modal">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-auto flex flex-col max-h-[95vh] overflow-hidden text-right print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full voucher-single-page">
            {/* Modal Controls Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-800">
                  معاينة وطباعة سند الصرف المالي الرسمي
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedExpenseForPrint.voucherNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة السند الرسمي A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintExpenseModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 Voucher Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/40 print:p-0 print:overflow-visible">
              <div className="bg-white p-8 print:p-0 border border-slate-200 print:border-none rounded-2xl shadow-sm print:shadow-none space-y-6 print:space-y-2 text-slate-800">
                {/* Official Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                  {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                  <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                    <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                      شركة نوك للديكور الداخلي والألمنيوم
                    </h2>
                    <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                      NOAK WOOD & ALUMINUM INDUSTRIES
                    </p>
                    <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                      كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                    </p>
                    <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                      أرقام التواصل: 07800000000 - 07700000000
                    </p>
                  </div>

                  {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                  <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                    <img
                      src={noakLogo}
                      alt="شركة نوك للديكور الداخلي والألمنيوم"
                      className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                    />
                  </div>

                  {/* Left: Metadata */}
                  <div className="text-left font-mono flex-1 min-w-0 pl-1">
                    <span className="bg-emerald-700 text-white text-xs print:text-[10px] px-3 py-1 print:py-0.5 rounded-lg font-bold inline-block mb-1 shadow-xs whitespace-nowrap">
                      سند صرف نقدي ومصروفات
                    </span>
                    <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                      رقم السند: {selectedExpenseForPrint.voucherNumber}
                    </p>
                    <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                      تاريخ الصرف: {selectedExpenseForPrint.date}
                    </p>
                    <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                      القسم: {selectedExpenseForPrint.divisionId === 'WOOD' ? 'النجارة' : selectedExpenseForPrint.divisionId === 'ALUMINUM' ? 'الألمنيوم' : 'مشترك'}
                    </p>
                  </div>
                </div>

                {/* Voucher Title Banner */}
                <div className="bg-slate-900 text-white py-2.5 print:py-1 px-4 rounded-xl flex items-center justify-between voucher-banner">
                  <span className="font-black text-sm print:text-xs">
                    سند صرف نقدي ومصروفات عامة (Official Payment Voucher)
                  </span>
                  <span className="font-mono text-xs print:text-[10px] text-emerald-400 font-bold">
                    حالة السند: معتمد ومصروف
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:gap-2 p-4 print:p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs print:text-[10px] voucher-card">
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">رقم السند:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedExpenseForPrint.voucherNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">تاريخ الصرف:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedExpenseForPrint.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">طريقة الدفع:</span>
                    <span className="font-bold text-slate-900">
                      {selectedExpenseForPrint.paymentMethod === 'CASH'
                        ? 'نقداً (الصندوق الرئيسي)'
                        : selectedExpenseForPrint.paymentMethod === 'BANK'
                        ? 'تحويل مصرفي'
                        : 'صك مصرفي'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] print:text-[9.5pt] text-slate-400 block mb-0.5">القسم المستفيد:</span>
                    <span className="font-bold text-slate-900">
                      {selectedExpenseForPrint.divisionId === 'WOOD'
                        ? 'قسم النجارة والديكور'
                        : selectedExpenseForPrint.divisionId === 'ALUMINUM'
                        ? 'قسم الألمنيوم والواجهات'
                        : 'مشترك بين القسمين (مناصفة)'}
                    </span>
                  </div>
                </div>

                {/* Beneficiary & Reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2 text-xs print:text-[10px]">
                  <div className="p-3.5 print:p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 voucher-card">
                    <span className="text-[11px] print:text-[9.5pt] font-bold text-slate-400 block">
                      اصرفوا إلى السيد / السادة (المستلم):
                    </span>
                    <div className="font-black text-slate-900 text-sm print:text-xs">
                      {selectedExpenseForPrint.beneficiary}
                    </div>
                  </div>

                  <div className="p-3.5 print:p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 voucher-card">
                    <span className="text-[11px] print:text-[9.5pt] font-bold text-slate-400 block">
                      تصنيف النفقة ورقم الوصل المرجعي:
                    </span>
                    <div className="font-bold text-slate-900">
                      {selectedExpenseForPrint.categoryLabelAr}
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] print:text-[9pt]">
                      الوصل المرجعي: {selectedExpenseForPrint.referenceInvoiceNo || 'لا يوجد'}
                    </div>
                  </div>
                </div>

                {/* Amount Box & Arabic Tafqeet */}
                <div className="p-5 print:p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-2 border-emerald-300 rounded-2xl print:rounded-xl space-y-2 print:space-y-1 voucher-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs print:text-[10px] font-bold text-emerald-900">المبلغ المصروف:</span>
                    <span className="text-xl print:text-base font-black font-mono text-emerald-950">
                      {new PreciseMoney(selectedExpenseForPrint.amount).formatIQD()}
                    </span>
                  </div>
                  <div className="pt-2 print:pt-1 border-t border-emerald-200/80 text-xs print:text-[10px]">
                    <span className="font-bold text-emerald-950">فقط وقدره:</span>{' '}
                    <span className="font-bold text-emerald-900">
                      {tafqeetIQD(selectedExpenseForPrint.amount)} لا غير.
                    </span>
                  </div>
                </div>

                {/* Purpose / Notes */}
                <div className="p-4 print:p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs print:text-[10px] voucher-card">
                  <span className="text-[11px] print:text-[9.5pt] font-bold text-slate-500 block">وذلك عن (البيان والغرض من الصرف):</span>
                  <div className="font-semibold text-slate-800 leading-relaxed">
                    {selectedExpenseForPrint.notes}
                  </div>
                </div>

                {/* Signatures Grid */}
                <div className="pt-8 print:pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 print:gap-2 text-center text-xs print:text-[9.5pt] voucher-signatures">
                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">المحاسب / منظم السند</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block font-mono">
                      {selectedExpenseForPrint.paidBy || 'أمين الصندوق'}
                    </span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">التدقيق المالي</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">مطابق للقيود</span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">المدير العام (الاعتماد)</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">
                      {selectedExpenseForPrint.approvedBy || 'معتمد'}
                    </span>
                  </div>

                  <div className="space-y-6 print:space-y-1">
                    <span className="text-slate-500 font-bold block">المستلم / القابض</span>
                    <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto signature-line"></div>
                    <span className="text-[11px] print:text-[8.5pt] text-slate-400 block">
                      {selectedExpenseForPrint.beneficiary}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                وثيقة نظامية صادرة آلياً من منظومة NOAK ERP
              </span>
              <button
                type="button"
                onClick={() => setIsPrintExpenseModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR MODAL 1: NEW EMPLOYEE MODAL (إضافة موظف جديد وتحديد الدوام)           */}
      {/* ========================================================================= */}
      {isNewEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">إضافة موظف جديد</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewEmployeeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-5 space-y-4 text-xs">
              {newEmpError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newEmpError}</span>
                </div>
              )}

              {/* Row 1: Full Name & Employee Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">اسم الموظف الكامل *</label>
                  <input
                    type="text"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="مثال: م. علي حيدر الركابي"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">كود الموظف</label>
                  <input
                    type="text"
                    value={newEmpCode}
                    onChange={(e) => setNewEmpCode(e.target.value)}
                    placeholder={`EMP-${String(employees.length + 1).padStart(3, '0')}`}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Division, Job Title, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">القسم *</label>
                  <select
                    value={newEmpDivision}
                    onChange={(e) => setNewEmpDivision(e.target.value as DivisionId | 'SHARED')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="WOOD">قسم النجارة</option>
                    <option value="ALUMINUM">قسم الألمنيوم</option>
                    <option value="SHARED">مشترك</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    value={newEmpJobTitle}
                    onChange={(e) => setNewEmpJobTitle(e.target.value)}
                    placeholder="مثال: فني نجارة وتفصيل"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    placeholder="0770xxxxxxx"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Monthly Salary & Work Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الراتب الأساسي (د.ع) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newEmpMonthlySalary}
                    onChange={(e) => setNewEmpMonthlySalary(formatInputNumber(e.target.value))}
                    placeholder="مثال: 1,250,000"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                  {newEmpMonthlySalary && Number(cleanNumeric(newEmpMonthlySalary)) > 0 && (
                    <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                      الراتب: {new PreciseMoney(newEmpMonthlySalary).formatIQD()}
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">أيام العمل شهرياً</label>
                  <input
                    type="number"
                    value={newEmpWorkingDays}
                    onChange={(e) => setNewEmpWorkingDays(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ساعات العمل اليومية</label>
                  <input
                    type="number"
                    value={newEmpDailyHours}
                    onChange={(e) => setNewEmpDailyHours(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Shift Start & End Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">بدء الدوام *</label>
                  <input
                    type="time"
                    value={newEmpShiftStart}
                    onChange={(e) => setNewEmpShiftStart(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">نهاية الدوام *</label>
                  <input
                    type="time"
                    value={newEmpShiftEnd}
                    onChange={(e) => setNewEmpShiftEnd(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Engineering Minute-Rate Calculation Live Preview */}
              {(() => {
                const days = Number(newEmpWorkingDays) || 26;
                const hours = Number(newEmpDailyHours) || 8;
                const totalMinutes = days * hours * 60;
                const salaryNum = Number(newEmpMonthlySalary.replace(/,/g, '')) || 0;
                const minuteRate = totalMinutes > 0 && salaryNum > 0 ? (salaryNum / totalMinutes).toFixed(2) : '0.00';

                return (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-900 block text-xs">
                      احتساب أجر الدقيقة:
                    </span>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-emerald-800">
                      <span>إجمالي دقائق العمل الشهرية: <strong className="font-mono">{totalMinutes.toLocaleString()} دقيقة</strong></span>
                      <span>أجر الدقيقة المقدر: <strong className="font-mono text-emerald-950 font-bold">{minuteRate} د.ع / دقيقة</strong></span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ الموظف</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR MODAL 2: RECORD DAILY ATTENDANCE (تسجيل دوام يومي وساعة دخول وخروج)     */}
      {/* ========================================================================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">تسجيل دوام الموظف</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordAttendance} className="p-5 space-y-4 text-xs">
              {attError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{attError}</span>
                </div>
              )}

              {/* Employee Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">اختر الموظف *</label>
                <select
                  value={attEmployeeId}
                  onChange={(e) => setAttEmployeeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - [{emp.code}] - ({emp.shiftStartTime || '08:00'} إلى {emp.shiftEndTime || '16:00'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">تاريخ الدوام *</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                  required
                >
                </input>
              </div>

              {/* Clock-In & Clock-Out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">وقت الدخول *</label>
                  <input
                    type="time"
                    value={attClockIn}
                    onChange={(e) => setAttClockIn(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">وقت الخروج *</label>
                  <input
                    type="time"
                    value={attClockOut}
                    onChange={(e) => setAttClockOut(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Live Calculations Box */}
              {(() => {
                const targetEmp = employees.find((e) => e.id === attEmployeeId) || employees[0];
                if (!targetEmp) return null;

                const scheduledIn = targetEmp.shiftStartTime || '08:00';
                const scheduledOut = targetEmp.shiftEndTime || '16:00';
                const minuteRate = calculateEmployeeMinuteRate(targetEmp);

                const inMin = timeToMinutes(attClockIn);
                const outMin = timeToMinutes(attClockOut);
                const schInMin = timeToMinutes(scheduledIn);
                const schOutMin = timeToMinutes(scheduledOut);

                const lateMin = Math.max(0, inMin - schInMin);
                const lateCost = minuteRate.mul(lateMin);

                const otMin = Math.max(0, outMin - schOutMin);
                const otAddition = minuteRate.mul(otMin);

                return (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 border-b border-slate-200 pb-2">
                      <span>الدوام الرسمي: <strong className="font-mono text-slate-800">{scheduledIn} - {scheduledOut}</strong></span>
                      <span>أجر الدقيقة: <strong className="font-mono text-indigo-700 font-bold">{minuteRate.toNumber().toFixed(2)} د.ع</strong></span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Late Result */}
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                        <span className="text-[10px] text-rose-600 font-bold block">التأخير:</span>
                        <div className="font-bold text-rose-800 font-mono mt-0.5">
                          {lateMin} دقيقة
                        </div>
                        <span className="text-[10px] text-rose-700 font-mono block mt-0.5">
                          خصم: -{lateCost.formatIQD()}
                        </span>
                      </div>

                      {/* Overtime Result */}
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                        <span className="text-[10px] text-amber-700 font-bold block">الإضافي:</span>
                        <div className="font-bold text-amber-900 font-mono mt-0.5">
                          {otMin} دقيقة
                        </div>
                        <span className="text-[10px] text-amber-800 font-mono block mt-0.5">
                          إضافة: +{otAddition.formatIQD()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات:</label>
                <input
                  type="text"
                  value={attNotes}
                  onChange={(e) => setAttNotes(e.target.value)}
                  placeholder="ملاحظات الحضور..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ الدوام</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR MODAL 3: SALARY ADVANCE (صرف سلفة على الراتب)                          */}
      {/* ========================================================================= */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">صرف سلفة موظف</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdvanceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisburseAdvance} className="p-5 space-y-4 text-xs">
              {advError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{advError}</span>
                </div>
              )}

              {/* Target Employee */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">الموظف *</label>
                <select
                  value={advanceEmpId}
                  onChange={(e) => setAdvanceEmpId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:border-purple-500 outline-none"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - راتب: {new PreciseMoney(emp.monthlySalary).formatIQD()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voucher Number & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم السند</label>
                  <input
                    type="text"
                    value={advVoucherNo}
                    onChange={(e) => setAdvVoucherNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ الصرف *</label>
                  <input
                    type="date"
                    value={advDate}
                    onChange={(e) => setAdvDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Amount & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">مبلغ السلفة (د.ع) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={advAmount}
                    onChange={(e) => setAdvAmount(formatInputNumber(e.target.value))}
                    placeholder="مثال: 100,000"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-purple-700 focus:bg-white focus:border-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">طريقة الصرف *</label>
                  <select
                    value={advPaymentMethod}
                    onChange={(e) => setAdvPaymentMethod(e.target.value as 'CASH' | 'BANK')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:border-purple-500 outline-none"
                  >
                    <option value="CASH">نقداً</option>
                    <option value="BANK">تحويل مصرفي</option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">البيان *</label>
                <input
                  type="text"
                  value={advReason}
                  onChange={(e) => setAdvReason(e.target.value)}
                  placeholder="سبب السلفة..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-purple-500 outline-none"
                  required
                />
              </div>

              {/* Tafqeet & Context */}
              {advAmount && !isNaN(Number(cleanNumeric(advAmount))) && Number(cleanNumeric(advAmount)) > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">المبلغ المنسق بفواصل الآلاف:</span>
                    <span className="font-mono font-black text-purple-950 text-sm">
                      {new PreciseMoney(advAmount).formatIQD()}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-purple-200/60 font-medium">
                    فقط {tafqeetIQD(cleanNumeric(advAmount))} لا غير.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>صرف السلفة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR MODAL 4: DISBURSE & ARCHIVE PAYROLL (صرف رواتب الشهر وأرشفة الدوام)    */}
      {/* ========================================================================= */}
      {isClosePayrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">صرف رواتب الشهر</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClosePayrollModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Target Month Name Input */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-1/2">
                  <label className="font-bold text-slate-700 block mb-1">دورة الرواتب *</label>
                  <input
                    type="text"
                    value={payrollMonthName}
                    onChange={(e) => setPayrollMonthName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 outline-none"
                    required
                  />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">إجمالي الصافي المستحق للصرف</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {hrKpis.totalNetPayable.formatIQD()}
                  </span>
                </div>
              </div>

              {/* Financial Summary KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">إجمالي الأساسي</span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                    {hrKpis.totalBaseSalaries.formatIQD()}
                  </span>
                </div>
                <div>
                  <span className="text-amber-600 block text-[10px]">إجمالي الإضافي (+)</span>
                  <span className="font-bold text-amber-600 font-mono mt-0.5 block">
                    +{hrKpis.totalAdditions.formatIQD()}
                  </span>
                </div>
                <div>
                  <span className="text-rose-600 block text-[10px]">إجمالي الخصومات (-)</span>
                  <span className="font-bold text-rose-600 font-mono mt-0.5 block">
                    -{hrKpis.totalDeductions.formatIQD()}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 block text-[10px]">السلف المحسومة (-)</span>
                  <span className="font-bold text-purple-700 font-mono mt-0.5 block">
                    -{hrKpis.totalAdvances.formatIQD()}
                  </span>
                </div>
              </div>

              {/* Table of Employees & Final Net Pay */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">الموظف</th>
                      <th className="p-2.5">القسم</th>
                      <th className="p-2.5">الراتب الأساسي</th>
                      <th className="p-2.5 text-amber-600">الإضافي</th>
                      <th className="p-2.5 text-rose-600">الخصم</th>
                      <th className="p-2.5 text-purple-600">السلفة</th>
                      <th className="p-2.5 text-emerald-700">صافي الصرف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {employees.map((emp) => {
                      const b = getEmployeePayrollBreakdown(emp);
                      return (
                        <tr key={emp.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold font-sans text-slate-800">{emp.fullName}</td>
                          <td className="p-2.5 font-sans text-slate-500">
                            {emp.divisionId === 'WOOD' ? 'نجارة' : emp.divisionId === 'ALUMINUM' ? 'ألمنيوم' : 'مشترك'}
                          </td>
                          <td className="p-2.5">{b.baseSalary.formatIQD()}</td>
                          <td className="p-2.5 text-amber-600">+{b.totalOvertimeAdditions.formatIQD()}</td>
                          <td className="p-2.5 text-rose-600">-{b.totalLateDeductions.formatIQD()}</td>
                          <td className="p-2.5 text-purple-600">-{b.totalAdvances.formatIQD()}</td>
                          <td className="p-2.5 font-bold text-emerald-700">{b.netSalary.formatIQD()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Notice */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>سيتم أرشفة دورة الرواتب وحسم السلف وتصفير سجل الدوام للشهر الجديد.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClosePayrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleDisburseAndArchivePayroll}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الصرف والأرشفة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR MODAL 5: PRINTABLE SALARY SLIP (قسيمة راتب شهرية رسمية A4)             */}
      {/* ========================================================================= */}
      {isSalarySlipModalOpen && selectedEmpForSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn printable-modal">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:max-w-none print:w-full voucher-single-page">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">معاينة وطباعة قسيمة الراتب الشهرية (A4)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSalarySlipModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable A4 Payload */}
            <div className="p-8 print:p-0 space-y-6 print:space-y-2 text-slate-800">
              {/* Slip Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="inline-block px-3 py-1 print:py-0.5 bg-slate-100 border border-slate-300 rounded-lg text-xs print:text-[10px] font-bold voucher-banner mb-1 whitespace-nowrap">
                    قسيمة راتب شهرية
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    الدورة: {payrollMonthName}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    الموظف: {selectedEmpForSlip.fullName}
                  </p>
                </div>
              </div>

              {/* Employee Metadata */}
              {(() => {
                const b = getEmployeePayrollBreakdown(selectedEmpForSlip);
                const workingDays = selectedEmpForSlip.workingDaysPerMonth || 26;
                const dailyHours = selectedEmpForSlip.dailyHours || 8;
                const minuteRateIQD = b.minuteRate.toNumber().toFixed(2);

                return (
                  <div className="space-y-4 print:space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:gap-2 p-3.5 print:p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs print:text-[10px] voucher-card">
                      <div>
                        <span className="text-slate-400 text-[10px] print:text-[9pt] block">اسم الموظف:</span>
                        <strong className="text-slate-900 block mt-0.5">{selectedEmpForSlip.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] print:text-[9pt] block">كود الموظف:</span>
                        <strong className="font-mono text-slate-900 block mt-0.5">{selectedEmpForSlip.code}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] print:text-[9pt] block">القسم الصناعي:</span>
                        <strong className="text-slate-900 block mt-0.5">
                          {selectedEmpForSlip.divisionId === 'WOOD'
                            ? 'قسم النجارة'
                            : selectedEmpForSlip.divisionId === 'ALUMINUM'
                            ? 'قسم الألمنيوم'
                            : 'كادر مشترك'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] print:text-[9pt] block">المسمى الوظيفي:</span>
                        <strong className="text-slate-900 block mt-0.5">{selectedEmpForSlip.jobTitle}</strong>
                      </div>
                    </div>

                    {/* Shift & Minute Rate Info */}
                    <div className="flex items-center justify-between text-xs print:text-[9.5pt] px-3 py-2 print:py-1 bg-slate-100 rounded-lg text-slate-600 font-mono">
                      <span>الدوام الرسمي: {selectedEmpForSlip.shiftStartTime || '08:00'} - {selectedEmpForSlip.shiftEndTime || '16:00'} ({dailyHours} س/يوم)</span>
                      <span>أجر الدقيقة المعتمد: {minuteRateIQD} د.ع</span>
                    </div>

                    {/* Earnings vs Deductions Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2 text-xs print:text-[9.5pt]">
                      {/* Column 1: Earnings (المستحقات) */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden voucher-card">
                        <div className="p-2.5 print:p-1.5 bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                          الاستحقاقات والإضافات (+)
                        </div>
                        <div className="p-3 print:p-2 space-y-2 print:space-y-1 font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-sans">الراتب الأساسي العقدي:</span>
                            <span className="font-bold text-slate-900">{b.baseSalary.formatIQD()}</span>
                          </div>
                          <div className="flex justify-between items-center text-amber-700">
                            <span className="text-slate-600 font-sans">عمل إضافي ({b.totalOvertimeMinutes} دقيقة):</span>
                            <span className="font-bold">+{b.totalOvertimeAdditions.formatIQD()}</span>
                          </div>
                          <div className="pt-2 print:pt-1 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                            <span className="font-sans">إجمالي الاستحقاق:</span>
                            <span>{b.baseSalary.add(b.totalOvertimeAdditions).formatIQD()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Deductions (الاستقطاعات) */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden voucher-card">
                        <div className="p-2.5 print:p-1.5 bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                          الاستقطاعات والخصومات (-)
                        </div>
                        <div className="p-3 print:p-2 space-y-2 print:space-y-1 font-mono">
                          <div className="flex justify-between items-center text-rose-700">
                            <span className="text-slate-600 font-sans">خصم التأخير ({b.totalLateMinutes} دقيقة):</span>
                            <span className="font-bold">-{b.totalLateDeductions.formatIQD()}</span>
                          </div>
                          <div className="flex justify-between items-center text-purple-700">
                            <span className="text-slate-600 font-sans">السلف المصروفة المحسومة:</span>
                            <span className="font-bold">-{b.totalAdvances.formatIQD()}</span>
                          </div>
                          <div className="pt-2 print:pt-1 border-t border-slate-200 flex justify-between items-center font-bold text-rose-700">
                            <span className="font-sans">إجمالي الاستقطاع:</span>
                            <span>-{b.totalLateDeductions.add(b.totalAdvances).formatIQD()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net Salary Payable Highlight */}
                    <div className="p-4 print:p-2 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-1 text-center voucher-card">
                      <span className="text-xs print:text-[10px] font-bold text-emerald-900 block">صافي الراتب المستحق للصرف:</span>
                      <div className="text-xl print:text-base font-black text-emerald-950 font-mono">
                        {b.netSalary.formatIQD()}
                      </div>
                      <div className="text-xs print:text-[9.5pt] text-emerald-800 font-medium pt-1">
                        فقط وقدره: {tafqeetIQD(b.netSalary.toDbString(2))} لا غير.
                      </div>
                    </div>

                    {/* Signatures Grid */}
                    <div className="pt-6 print:pt-2 border-t border-slate-200 grid grid-cols-3 gap-4 print:gap-2 text-center text-xs print:text-[9.5pt] voucher-signatures">
                      <div className="space-y-6 print:space-y-1">
                        <span className="text-slate-500 font-bold block">إعداد الموارد البشرية</span>
                        <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                        <span className="text-[10px] print:text-[8.5pt] text-slate-400 block font-mono">مسؤول الرواتب</span>
                      </div>
                      <div className="space-y-6 print:space-y-1">
                        <span className="text-slate-500 font-bold block">التدقيق المالي</span>
                        <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                        <span className="text-[10px] print:text-[8.5pt] text-slate-400 block">مطابق للقيود</span>
                      </div>
                      <div className="space-y-6 print:space-y-1">
                        <span className="text-slate-500 font-bold block">توقيع الموظف بالاستلام</span>
                        <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                        <span className="text-[10px] print:text-[8.5pt] text-slate-400 block">{selectedEmpForSlip.fullName}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-[11px] text-slate-400">
                وثيقة استحقاق نظامية صادرة آلياً من منظومة NOAK ERP
              </span>
              <button
                type="button"
                onClick={() => setIsSalarySlipModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* PARTNER MODAL 1: PARTNER ADVANCE DISBURSEMENT MODAL                       */}
      {/* ========================================================================= */}
      {isPartnerAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-purple-300" />
                <div>
                  <h3 className="text-sm font-bold">صرف سلفة لشريك</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPartnerAdvanceModalOpen(false);
                  setPadvError(null);
                }}
                className="p-1 text-purple-200 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisbursePartnerAdvance} className="p-5 space-y-4 text-xs">
              {padvError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{padvError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  الشريك المستفيد <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedPartnerForAdvance}
                  onChange={(e) => setSelectedPartnerForAdvance(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-slate-800"
                >
                  <optgroup label="قسم النجارة">
                    {partners
                      .filter((p) => p.divisionId === 'WOOD')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ({p.profitPercentage}%)
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="قسم الألمنيوم">
                    {partners
                      .filter((p) => p.divisionId === 'ALUMINUM')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ({p.profitPercentage}%)
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">رقم سند الصرف</label>
                  <input
                    type="text"
                    value={padvVoucherNo}
                    onChange={(e) => setPadvVoucherNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">تاريخ السند</label>
                  <input
                    type="date"
                    value={padvDate}
                    onChange={(e) => setPadvDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    مبلغ السلفة (د.ع) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={padvAmount}
                    onChange={(e) => setPadvAmount(formatInputNumber(e.target.value))}
                    placeholder="مثال: 500,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">طريقة الصرف</label>
                  <select
                    value={padvPaymentMethod}
                    onChange={(e) => setPadvPaymentMethod(e.target.value as 'CASH' | 'BANK')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="CASH">نقداً من الصندوق (Cash)</option>
                    <option value="BANK">تحويل بنكي / مصرفي (Bank Transfer)</option>
                  </select>
                </div>
              </div>

              {/* Live Tafqeet for the entered amount */}
              {cleanNumeric(padvAmount) && !isNaN(Number(cleanNumeric(padvAmount))) && Number(cleanNumeric(padvAmount)) > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-700 font-bold">المبلغ المنسق بفواصل الآلاف:</span>
                    <span className="font-mono font-black text-purple-950 text-sm">
                      {new PreciseMoney(padvAmount).formatIQD()}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-purple-200/60 text-purple-900 font-semibold text-[11px]">
                    فقط {tafqeetIQD(cleanNumeric(padvAmount))} لا غير.
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">البيان / سبب السحب</label>
                <input
                  type="text"
                  value={padvReason}
                  onChange={(e) => setPadvReason(e.target.value)}
                  placeholder="مثال: سلفة نقدية على حساب الأرباح لدورة الربع الرابع"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsPartnerAdvanceModalOpen(false);
                    setPadvError(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الصرف</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTNER MODAL 2: PRINTABLE PARTNER ADVANCE VOUCHER (A4)                   */}
      {/* ========================================================================= */}
      {isPadvPrintModalOpen && selectedPadvForPrint && (
        <div className="printable-modal fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:max-w-none voucher-single-page">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">معاينة وطباعة سند صرف سلفة شريك رسمي (A4)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPadvPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 print:p-0 space-y-6 print:space-y-2 text-slate-800">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="inline-block px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs print:text-[10px] font-black mb-1 whitespace-nowrap">
                    سند صرف سلفة شريك
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    {selectedPadvForPrint.voucherNumber}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    التاريخ: {selectedPadvForPrint.date}
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    الشريك: {selectedPadvForPrint.partnerName}
                  </p>
                </div>
              </div>

              {/* Voucher Info Grid */}
              <div className="grid grid-cols-2 gap-4 print:gap-2 p-4 print:p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs print:text-[10px] voucher-card">
                <div>
                  <span className="text-slate-400 text-[10px] print:text-[9pt] block">اسم الشريك المستفيد:</span>
                  <strong className="text-slate-900 text-sm print:text-xs block mt-0.5">{selectedPadvForPrint.partnerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] print:text-[9pt] block">القسم الصناعي:</span>
                  <strong className="text-slate-900 text-sm print:text-xs block mt-0.5">
                    {selectedPadvForPrint.divisionId === 'WOOD' ? 'قسم النجارة والديكور' : 'قسم الألمنيوم والواجهات'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] print:text-[9pt] block">طريقة الصرف:</span>
                  <strong className="text-slate-800 block mt-0.5">
                    {selectedPadvForPrint.paymentMethod === 'CASH' ? 'نقداً من الصندوق المركزي' : 'تحويل بنكي / مصرفي'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] print:text-[9pt] block">حالة السند:</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] print:text-[9pt] font-bold ${
                    selectedPadvForPrint.status === 'ACTIVE'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedPadvForPrint.status === 'ACTIVE' ? 'نشط (بانتظار دورة التصفية)' : 'تمت تسويته بالأرشيف'}
                  </span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-5 print:p-2 bg-gradient-to-r from-purple-50 to-purple-100/50 border-2 border-purple-300 rounded-xl text-center space-y-2 print:space-y-0.5 voucher-card">
                <span className="text-xs print:text-[10px] font-bold text-purple-900 block">مبلغ السلفة المصروفة:</span>
                <div className="text-2xl print:text-lg font-black text-purple-950 font-mono">
                  {new PreciseMoney(selectedPadvForPrint.amount).formatIQD()}
                </div>
                <div className="text-xs print:text-[9.5pt] text-purple-900 font-semibold pt-1">
                  فقط وقدره: {tafqeetIQD(selectedPadvForPrint.amount)} لا غير.
                </div>
              </div>

              {/* Reason / Statement */}
              <div className="p-4 print:p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs print:text-[10px] space-y-1 voucher-card">
                <span className="text-slate-400 text-[10px] print:text-[9pt] font-bold block">البيان والغرض:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedPadvForPrint.reason}</p>
              </div>

              {/* Legal notice */}
              <div className="p-3 print:p-1.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[10px] print:text-[8.5pt] text-amber-900 leading-relaxed voucher-card">
                إقرار واستلام: أقر أنا الموقع أدناه باستلام مبلغ السلفة الموضح أعلاه نقداً/حوالة، وأفوض إدارة الشؤون المالية بحسمه من كامل مستحقاتي من الأرباح في دورة التصفية القادمة.
              </div>

              {/* Signatures */}
              <div className="pt-8 print:pt-2 border-t border-slate-200 grid grid-cols-3 gap-4 print:gap-2 text-center text-xs print:text-[9.5pt] voucher-signatures">
                <div className="space-y-6 print:space-y-1">
                  <span className="text-slate-500 font-bold block">أمين الصندوق المركزي</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                  <span className="text-[10px] print:text-[8.5pt] text-slate-400 block">{selectedPadvForPrint.paidBy || 'المحاسب المسؤول'}</span>
                </div>
                <div className="space-y-6 print:space-y-1">
                  <span className="text-slate-500 font-bold block">التدقيق المالي</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                  <span className="text-[10px] print:text-[8.5pt] text-slate-400 block">معتمد نظامياً</span>
                </div>
                <div className="space-y-6 print:space-y-1">
                  <span className="text-slate-500 font-bold block">توقيع الشريك المستلم</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto signature-line"></div>
                  <span className="text-[10px] print:text-[8.5pt] text-slate-400 block">{selectedPadvForPrint.partnerName}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-[11px] text-slate-400">
                وثيقة صرف سلفة رسمية صادرة من منظومة NOAK ERP
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPadvPrintModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTNER MODAL 3: PRINTABLE PARTNERS SETTLEMENT SHEET (A4)                 */}
      {/* ========================================================================= */}
      {isSettlementPrintModalOpen && selectedSettlementForPrint && (
        <div className="printable-modal fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:max-w-none multi-page-doc">
            <div className="p-3 bg-slate-800 text-white flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">معاينة وطباعة كشف تصفية وتوزيع الأرباح الدوري (A4)</span>
                </div>

                {/* Division Switcher in Print Preview Toolbar */}
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSettlementForPrint({
                        divisionId: 'WOOD',
                        periodName: `تصفية أرباح قسم النجارة (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`,
                        summary: woodSummary,
                      })
                    }
                    className={`px-3 py-1 rounded-md transition font-bold ${
                      selectedSettlementForPrint.divisionId === 'WOOD'
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    قسم النجارة (4 شركاء)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSettlementForPrint({
                        divisionId: 'ALUMINUM',
                        periodName: `تصفية أرباح قسم الألمنيوم (${partnerDateFrom || 'البداية'} إلى ${partnerDateTo || 'الآن'})`,
                        summary: alumSummary,
                      })
                    }
                    className={`px-3 py-1 rounded-md transition font-bold ${
                      selectedSettlementForPrint.divisionId === 'ALUMINUM'
                        ? 'bg-sky-700 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    قسم الألمنيوم (5 شركاء)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettlementPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-slate-800 print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className={`inline-block px-3 py-1 print:py-0.5 rounded-lg text-xs print:text-[10px] font-black mb-1 whitespace-nowrap ${
                    selectedSettlementForPrint.divisionId === 'WOOD'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-sky-100 text-sky-900 border border-sky-300'
                  }`}>
                    {selectedSettlementForPrint.divisionId === 'WOOD' ? 'قسم النجارة والديكور' : 'قسم الألمنيوم والواجهات'}
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    كشف تصفية وتوزيع الأرباح
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    الفترة: {partnerDateFrom || 'البداية'} إلى {partnerDateTo || 'الآن'}
                  </p>
                </div>
              </div>

              {/* Division Financial Aggregates Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  <span>أولاً: ملخص الكتل المالية للقسم (وفق التدفقات الواصلة والمصروفات الفعلية)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 block">كتلة الإيراد الواصل (دفعات الزبائن):</span>
                    <div className="text-sm font-black text-emerald-950 font-mono mt-0.5">
                      {selectedSettlementForPrint.summary.realizedRevenue.formatIQD()}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-800 block">كتلة المصروفات الكاملة:</span>
                    <div className="text-sm font-black text-rose-950 font-mono mt-0.5">
                      {selectedSettlementForPrint.summary.totalExpenses.formatIQD()}
                    </div>
                    <div className="text-[9px] text-rose-600 mt-1">
                      (مواد + عمومية + 50% مشتركة + رواتب)
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-800 block">صافي ربح القسم:</span>
                    <div className="text-sm font-black text-blue-950 font-mono mt-0.5">
                      {selectedSettlementForPrint.summary.netProfit.formatIQD()}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-[10px] font-bold text-purple-800 block">صافي الأرباح القابلة للتوزيع:</span>
                    <div className="text-sm font-black text-purple-950 font-mono mt-0.5">
                      {selectedSettlementForPrint.summary.distributableProfit.formatIQD()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners Breakdown Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>ثانياً: جدول استحقاقات وتوزيع حصص الشركاء (مع خصم السلف)</span>
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">ت</th>
                        <th className="p-2.5">اسم الشريك</th>
                        <th className="p-2.5 text-center">نسبة الحصة (%)</th>
                        <th className="p-2.5 text-left">إجمالي حصة الربح</th>
                        <th className="p-2.5 text-left">السلف المحسومة</th>
                        <th className="p-2.5 text-left font-black text-emerald-900">صافي المستحق للصرف</th>
                        <th className="p-2.5 text-center">توقيع الشريك</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedSettlementForPrint.summary.partnerShares.map((s: any, idx: number) => (
                        <tr key={s.partner.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-900">{s.partner.name}</td>
                          <td className="p-2.5 text-center font-bold font-mono">
                            {Number(s.profitPercentage).toFixed(2)}%
                          </td>
                          <td className="p-2.5 text-left font-mono font-medium text-slate-700">
                            {s.grossShare.formatIQD()}
                          </td>
                          <td className="p-2.5 text-left font-mono font-bold text-purple-700">
                            {s.totalAdvances.toNumber() > 0 ? `-${s.totalAdvances.formatIQD()}` : '0 د.ع'}
                          </td>
                          <td className="p-2.5 text-left font-mono font-black text-emerald-700 text-sm">
                            {s.netPayable.formatIQD()}
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="w-24 border-b border-dashed border-slate-400 mx-auto h-5"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <tr>
                        <td colSpan={2} className="p-2.5">المجموع الكلي المعتمد:</td>
                        <td className="p-2.5 text-center font-mono">
                          {selectedSettlementForPrint.summary.partnerShares.reduce((acc: number, cur: any) => acc + Number(cur.profitPercentage || 0), 0).toFixed(0)}%
                        </td>
                        <td className="p-2.5 text-left font-mono">
                          {selectedSettlementForPrint.summary.distributableProfit.formatIQD()}
                        </td>
                        <td className="p-2.5 text-left font-mono text-purple-800">
                          {selectedSettlementForPrint.summary.partnerShares.reduce((acc: any, cur: any) => acc.add(cur.totalAdvances), new PreciseMoney(0)).formatIQD()}
                        </td>
                        <td className="p-2.5 text-left font-mono text-emerald-900 text-sm">
                          {selectedSettlementForPrint.summary.partnerShares.reduce((acc: any, cur: any) => acc.add(cur.netPayable), new PreciseMoney(0)).formatIQD()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Tafqeet Summary */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 text-center print-avoid-break">
                <span className="text-[11px] font-bold text-emerald-900 block">إجمالي صافي المبالغ المستحقة للصرف للشركاء:</span>
                <div className="text-base font-black text-emerald-950">
                  {tafqeetIQD(
                    selectedSettlementForPrint.summary.partnerShares.reduce((acc: any, cur: any) => acc.add(cur.netPayable), new PreciseMoney(0)).toDbString(2)
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-4 gap-4 text-center text-xs print-avoid-break">
                <div className="space-y-6">
                  <span className="text-slate-500 font-bold block">المحاسب المالي</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                  <span className="text-[10px] text-slate-400 block">مطابق للدفاتر</span>
                </div>
                <div className="space-y-6">
                  <span className="text-slate-500 font-bold block">مدير الحسابات</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                  <span className="text-[10px] text-slate-400 block">معتمد قانونياً</span>
                </div>
                <div className="space-y-6">
                  <span className="text-slate-500 font-bold block">التدقيق العام</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                  <span className="text-[10px] text-slate-400 block">صحيح بعد المراجعة</span>
                </div>
                <div className="space-y-6">
                  <span className="text-slate-500 font-bold block">اعتماد الشركاء المفوضين</span>
                  <div className="border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                  <span className="text-[10px] text-slate-400 block">مجلس الإدارة</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-[11px] text-slate-400">
                كشف رسمي صادر من قسم الشؤون المالية - منظومة NOAK ERP
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettlementPrintModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTNER MODAL 4: CONFIRM SETTLEMENT & ARCHIVE CYCLE MODAL                */}
      {/* ========================================================================= */}
      {isConfirmSettlementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="text-sm font-bold">اعتماد وأرشفة دورة تصفية الأرباح</h3>
                  <p className="text-[11px] text-emerald-200">
                    {targetDivisionForSettlement === 'WOOD' ? 'قسم النجارة والخشب' : 'قسم الألمنيوم والواجهات'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmSettlementModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">عنوان دورة التصفية (لأغراض الأرشفة):</label>
                <input
                  type="text"
                  value={settlementPeriodTitle}
                  onChange={(e) => setSettlementPeriodTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              {(() => {
                const sum = targetDivisionForSettlement === 'WOOD' ? woodSummary : alumSummary;
                return (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-700">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold">
                      <span>القسم:</span>
                      <span className="text-slate-900">
                        {targetDivisionForSettlement === 'WOOD' ? 'قسم النجارة (4 شركاء)' : 'قسم الألمنيوم (5 شركاء)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>الفترة المحددة:</span>
                      <span className="font-mono text-slate-900">من {partnerDateFrom || 'البداية'} إلى {partnerDateTo || 'الآن'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>كتلة الإيراد الواصل:</span>
                      <span className="font-mono text-emerald-700 font-bold">{sum.realizedRevenue.formatIQD()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>كتلة المصروفات:</span>
                      <span className="font-mono text-rose-700 font-bold">{sum.totalExpenses.formatIQD()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold">
                      <span>صافي الأرباح القابلة للتوزيع:</span>
                      <span className="font-mono text-emerald-900 font-black text-sm">{sum.distributableProfit.formatIQD()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                <span>سيتم تثبيت الحصص رسميّاً وترحيل السلف النشطة للأرشيف.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfirmSettlementModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSettlementCycle(targetDivisionForSettlement)}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الاعتماد</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SELL SHOWROOM ITEM MODAL (بيع قطعة معروضة وتسجيل الإيراد والربح) */}
      {isSellShowroomModalOpen && selectedShowroomItemForSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">بيع منتج من مستودع المعرض وتحصيل النقدية</h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedShowroomItemForSale.itemCode} — {selectedShowroomItemForSale.nameAr}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSellShowroomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSaleShowroomItem} className="space-y-3.5 text-xs">
              {saleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saleError}</span>
                </div>
              )}

              {/* Accounting Impact Real-Time Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>تكلفة المواد والتصنيع (تسترد كسيولة نقدية في الصندوق):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {new PreciseMoney(selectedShowroomItemForSale.productionCost).formatIQD()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>سعر البيع الفعلي المحصل (يدخل الصندوق كاملاً):</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {new PreciseMoney(salePrice || 0).formatIQD()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-emerald-900">
                  <span>صافي الربح المحقق (يُرحل لأرباح قسم {selectedShowroomItemForSale.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'} والشركاء):</span>
                  <span className="font-mono text-sm font-black bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    +{new PreciseMoney(salePrice || 0).sub(new PreciseMoney(selectedShowroomItemForSale.productionCost)).formatIQD()}
                  </span>
                </div>
              </div>

              {/* Selling Price */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  سعر البيع (د.ع) <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="مثال: 2,500,000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(formatInputNumber(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                {salePrice && Number(cleanNumeric(salePrice)) > 0 && (
                  <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                    السعر المنسق: {new PreciseMoney(salePrice).formatIQD()}
                  </span>
                )}
              </div>

              {/* Buyer Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم العميل:</label>
                  <input
                    type="text"
                    placeholder="مثال: د. عمار السامرائي"
                    value={saleBuyerName}
                    onChange={(e) => setSaleBuyerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الهاتف:</label>
                  <input
                    type="text"
                    placeholder="مثال: 07701234567"
                    value={saleBuyerPhone}
                    onChange={(e) => setSaleBuyerPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Date & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ البيع:</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">طريقة الدفع:</label>
                  <select
                    value={salePaymentMethod}
                    onChange={(e) => setSalePaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="CASH">نقداً في الصندوق</option>
                    <option value="BANK">تحويل مصرفي</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">الملاحظات:</label>
                <input
                  type="text"
                  placeholder="ملاحظات التسليم أو التركيب..."
                  value={saleNotes}
                  onChange={(e) => setSaleNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSellShowroomModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد البيع والتحصيل للصندوق</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLENISH / ADD NEW SHOWROOM ITEM MODAL (تعويض / إضافة قطعة جديدة للمعرض) */}
      {isReplenishModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">توريد وتصنيع قطعة لمستودع المعرض (المواد الجاهزة)</h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">إثبات بضاعة تامة الصنع قابلة للبيع المباشر</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReplenishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Accounting Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Store className="w-4 h-4 text-amber-700 shrink-0" />
                <span>حركة مخزنية للمواد الجاهزة (بدون تأثير مالي على الصندوق):</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                تقييد القطعة المصنعة كبضاعة جاهزة في مستودع المعرض بكلفة المواد الفعلية. لا تسجل هذه العملية أي سند صرف أو خصم من الصندوق، وعند البيع يدخل كامل الإيراد نقداً للصندوق وتسترد تكلفة المواد كسيولة نقدية.
              </p>
            </div>

            <form onSubmit={handleConfirmReplenishShowroomItem} className="space-y-3.5 text-xs">
              {newShowroomError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newShowroomError}</span>
                </div>
              )}

              {/* Division Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">القسم المصنّع:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewShowroomDivision('WOOD')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      newShowroomDivision === 'WOOD'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>قسم النجارة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShowroomDivision('ALUMINUM')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      newShowroomDivision === 'ALUMINUM'
                        ? 'bg-sky-100 border-sky-400 text-sky-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span>قسم الألمنيوم</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  اسم القطعة والمنتج التام <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باب صاج ملكي، نموذج مطبخ بلوط، واجهة ألمنيوم..."
                  value={newShowroomItemName}
                  onChange={(e) => setNewShowroomItemName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Category & Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">التصنيف:</label>
                  <input
                    type="text"
                    placeholder="أبواب، شبابيك، مطابخ..."
                    value={newShowroomCategory}
                    onChange={(e) => setNewShowroomCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الأبعاد والمواصفات:</label>
                  <input
                    type="text"
                    placeholder="مثال: 120 سم × 240 سم"
                    value={newShowroomDimensions}
                    onChange={(e) => setNewShowroomDimensions(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Production Cost & Proposed Sale Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <div>
                  <label className="font-bold text-amber-900 block mb-1">
                    تكلفة المواد والتصنيع (د.ع) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="مثال: 1,200,000"
                    value={newShowroomCost}
                    onChange={(e) => setNewShowroomCost(formatInputNumber(e.target.value))}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                  {newShowroomCost && Number(cleanNumeric(newShowroomCost)) > 0 && (
                    <span className="text-[10px] text-amber-900 font-mono mt-0.5 block">
                      التكلفة المنسقة: {new PreciseMoney(newShowroomCost).formatIQD()}
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-bold text-amber-900 block mb-1">سعر البيع المقترح للزبائن:</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: 1,800,000"
                    value={newShowroomProposedPrice}
                    onChange={(e) => setNewShowroomProposedPrice(formatInputNumber(e.target.value))}
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg font-mono font-bold text-emerald-800"
                  />
                  {newShowroomProposedPrice && Number(cleanNumeric(newShowroomProposedPrice)) > 0 && (
                    <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                      السعر المقترح: {new PreciseMoney(newShowroomProposedPrice).formatIQD()}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات:</label>
                <input
                  type="text"
                  placeholder="ملاحظات التشطيب أو الموقع..."
                  value={newShowroomNotes}
                  onChange={(e) => setNewShowroomNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReplenishModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>قيد القطعة بمستودع المعرض</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DIVISION LUMP-SUM ASSETS MODAL (تعديل وتثبيت المبالغ الثابتة للأقسام) */}
      {isEditLumpSumsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تثبيت مبالغ الأصول للأقسام</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditLumpSumsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLumpSums} className="space-y-4 text-xs">
              {/* Wood Division */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                <label className="font-bold text-amber-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>أصول قسم النجارة (د.ع):</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={editWoodLumpSum}
                  onChange={(e) => setEditWoodLumpSum(formatInputNumber(e.target.value))}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-mono text-base font-bold text-slate-900"
                />
                <span className="text-[11px] text-amber-800 block">
                  القيمة كتابةً: {tafqeetIQD(Number(cleanNumeric(editWoodLumpSum || '0')))}
                </span>
              </div>

              {/* Aluminum Division */}
              <div className="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5">
                <label className="font-bold text-sky-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span>أصول قسم الألمنيوم (د.ع):</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={editAlumLumpSum}
                  onChange={(e) => setEditAlumLumpSum(formatInputNumber(e.target.value))}
                  className="w-full p-2.5 bg-white border border-sky-300 rounded-xl font-mono text-base font-bold text-slate-900"
                />
                <span className="text-[11px] text-sky-800 block">
                  القيمة كتابةً: {tafqeetIQD(Number(cleanNumeric(editAlumLumpSum || '0')))}
                </span>
              </div>

              {/* Shared Company Assets */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  <span>الأصول العامة المشتركة (د.ع):</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={editSharedLumpSum}
                  onChange={(e) => setEditSharedLumpSum(formatInputNumber(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-600 block">
                  القيمة كتابةً: {tafqeetIQD(Number(cleanNumeric(editSharedLumpSum || '0')))}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditLumpSumsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تثبيت مبالغ الأصول</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DETAILED FIXED ASSET (إضافة ماكينة / أصل تفصيلي) */}
      {isAddFixedAssetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">إضافة أصل جديد</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFixedAssetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFixedAsset} className="space-y-3.5 text-xs">
              {newAssetError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newAssetError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  اسم الأصل <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ماكينة راوتر CNC خشبية..."
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Division & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">القسم التابع له:</label>
                  <select
                    value={newAssetDivision}
                    onChange={(e) => setNewAssetDivision(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="WOOD">قسم النجارة</option>
                    <option value="ALUMINUM">قسم الألمنيوم</option>
                    <option value="SHARED">مشترك</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">تصنيف الأصل:</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="MACHINERY">آلات وماكينات الورش والـ CNC</option>
                    <option value="VEHICLES">سيارات وشاحنات النقل</option>
                    <option value="TOOLS_EQUIPMENT">عدد وأدوات كهربائية وهيدروليكية</option>
                    <option value="BUILDINGS_PREMISES">مباني المعرض والورش والتجهيزات الثابتة</option>
                    <option value="IT_OFFICE">أجهزة حاسوب وسيرفرات وتصميم هندسي</option>
                    <option value="OTHER">أصول أخرى</option>
                  </select>
                </div>
              </div>

              {/* Cost & Purchase Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    القيمة / تكلفة الشراء (IQD) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="مثال: 18,000,000"
                    value={newAssetCost}
                    onChange={(e) => setNewAssetCost(formatInputNumber(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {newAssetCost && Number(cleanNumeric(newAssetCost)) > 0 && (
                    <span className="text-[10px] text-slate-600 font-mono mt-0.5 block">
                      القيمة المنسقة: {new PreciseMoney(newAssetCost).formatIQD()}
                    </span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">تاريخ الشراء / التقييم:</label>
                  <input
                    type="date"
                    required
                    value={newAssetPurchaseDate}
                    onChange={(e) => setNewAssetPurchaseDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Location & Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">الموقع / الورشة الحالية:</label>
                <input
                  type="text"
                  placeholder="مثال: ورشة النجارة - خط القص والتفريز..."
                  value={newAssetLocation}
                  onChange={(e) => setNewAssetLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات ومواصفات إضافية:</label>
                <input
                  type="text"
                  placeholder="سنة الصنع، الموديل، الرقم التسلسلي، إلخ..."
                  value={newAssetNotes}
                  onChange={(e) => setNewAssetNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFixedAssetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وإضافة الأصل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE ASSET & SHOWROOM INVENTORY STATEMENT (كشف جرد الأصول الرسمي) */}
      {isPrintAssetsModalOpen && (
        <div className="printable-modal fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 multi-page-doc">
            {/* Top Toolbar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">كشف جرد الأصول ومستودع المعرض للمواد الجاهزة</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الكشف (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintAssetsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 space-y-6 text-slate-800 print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 print:pb-2 print:mb-2 flex items-center justify-between voucher-header gap-3">
                {/* Right: Company Name & Department Info (على يمين اللوغو - كل عبارة في سطر واحد واسم الشركة قياس 10) */}
                <div className="text-right flex-1 min-w-0 pr-1 space-y-0.5">
                  <h2 className="text-[10pt] print:text-[10pt] font-black text-slate-900 leading-tight whitespace-nowrap">
                    شركة نوك للديكور الداخلي والألمنيوم
                  </h2>
                  <p className="text-[8.5pt] print:text-[8pt] text-slate-700 font-bold tracking-wider whitespace-nowrap">
                    NOAK WOOD & ALUMINUM INDUSTRIES
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-600 font-medium">
                    كربلاء المقدسة - طريق النجف - قرب جامعة العميد - عمود 1255
                  </p>
                  <p className="whitespace-nowrap text-[9pt] print:text-[8pt] text-slate-500 font-semibold font-mono">
                    أرقام التواصل: 07800000000 - 07700000000
                  </p>
                </div>

                {/* Center: Logo (مزاح إلى اليسار بمقدار 5 أحرف) */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 print:px-2 mx-auto relative -translate-x-[5ch]">
                  <img
                    src={noakLogo}
                    alt="شركة نوك للديكور الداخلي والألمنيوم"
                    className="h-[102px] sm:h-[118px] print:h-[88px] w-auto object-contain rounded-2xl bg-white p-2 shadow-xs border border-slate-200"
                  />
                </div>

                {/* Left: Metadata */}
                <div className="text-left font-mono flex-1 min-w-0 pl-1">
                  <span className="inline-block px-3 py-1 print:py-0.5 rounded-lg text-xs print:text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300 mb-1 whitespace-nowrap">
                    قسم النجارة & الألمنيوم
                  </span>
                  <p className="text-xs print:text-[10px] font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    كشف تقييم الأصول وجرد المعرض
                  </p>
                  <p className="text-[11px] print:text-[9px] text-slate-500 whitespace-nowrap">
                    تاريخ التقرير: {new Date().toLocaleDateString('ar-IQ')}
                  </p>
                </div>
              </div>

              {/* Financial Summary KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 block">أصول ومخزون قسم النجارة:</span>
                  <div className="text-sm font-black text-amber-950 font-mono mt-0.5">
                    {totalWoodAssetsPM.formatIQD()}
                  </div>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                  <span className="text-[10px] font-bold text-sky-800 block">أصول ومخزون قسم الألمنيوم:</span>
                  <div className="text-sm font-black text-sky-950 font-mono mt-0.5">
                    {totalAlumAssetsPM.formatIQD()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-700 block">أصول مشتركة عامة:</span>
                  <div className="text-sm font-black text-slate-900 font-mono mt-0.5">
                    {sharedLumpSumPM.formatIQD()}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <span className="text-[10px] font-black text-emerald-900 block">إجمالي أصول ومخزون الشركة:</span>
                  <div className="text-sm font-black text-emerald-800 font-mono mt-0.5">
                    {grandTotalCompanyAssetsPM.formatIQD()}
                  </div>
                </div>
              </div>

              {/* Showroom Display Pieces Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-500" />
                  <span>مستودع المعرض (المواد الجاهزة المعروضة للبيع)</span>
                </h3>
                <table className="w-full text-right border-collapse text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2 text-center border border-slate-200 w-10">#</th>
                      <th className="p-2 border border-slate-200 w-24">الكود</th>
                      <th className="p-2 border border-slate-200">اسم القطعة والمنتج التام</th>
                      <th className="p-2 text-center border border-slate-200">القسم</th>
                      <th className="p-2 text-center border border-slate-200">التصنيف</th>
                      <th className="p-2 text-left font-mono border border-slate-200">تكلفة المواد والتصنيع (المخزون)</th>
                      <th className="p-2 text-left font-mono border border-slate-200">سعر البيع المقترح</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {showroomItems
                      .filter((s) => s.status === 'IN_SHOWROOM')
                      .map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2 text-center font-mono border border-slate-200">{idx + 1}</td>
                          <td className="p-2 font-mono font-bold border border-slate-200">{item.itemCode}</td>
                          <td className="p-2 font-bold border border-slate-200">{item.nameAr}</td>
                          <td className="p-2 text-center border border-slate-200">
                            {item.divisionId === 'WOOD' ? 'نجارة وخشب' : 'ألمنيوم وواجهات'}
                          </td>
                          <td className="p-2 text-center border border-slate-200 text-slate-600">{item.category}</td>
                          <td className="p-2 text-left font-mono font-bold border border-slate-200">
                            {new PreciseMoney(item.productionCost).formatIQD()}
                          </td>
                          <td className="p-2 text-left font-mono border border-slate-200">
                            {new PreciseMoney(item.proposedSalePrice).formatIQD()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <tr>
                      <td colSpan={5} className="p-2 text-right">إجمالي مخزون مستودع المعرض للمواد الجاهزة (بالتكلفة):</td>
                      <td colSpan={2} className="p-2 text-left font-mono text-emerald-800">
                        {activeWoodShowroomCost.add(activeAlumShowroomCost).formatIQD()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Sold Items Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>سجل مبيعات وأرباح قطع المعرض (محصلة ومرحلة للأرباح)</span>
                </h3>
                <table className="w-full text-right border-collapse text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2 text-center border border-slate-200 w-10">#</th>
                      <th className="p-2 border border-slate-200">القطعة المباعة</th>
                      <th className="p-2 text-center border border-slate-200">القسم</th>
                      <th className="p-2 border border-slate-200">المشتري</th>
                      <th className="p-2 text-center font-mono border border-slate-200">تاريخ البيع</th>
                      <th className="p-2 text-left font-mono border border-slate-200">تكلفة التصنيع</th>
                      <th className="p-2 text-left font-mono border border-slate-200">سعر البيع الفعلي</th>
                      <th className="p-2 text-left font-mono border border-slate-200">صافي الربح المحقق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {showroomItems
                      .filter((s) => s.status === 'SOLD')
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2 text-center font-mono border border-slate-200">{idx + 1}</td>
                          <td className="p-2 font-bold border border-slate-200">{item.nameAr}</td>
                          <td className="p-2 text-center border border-slate-200">
                            {item.divisionId === 'WOOD' ? 'نجارة' : 'ألمنيوم'}
                          </td>
                          <td className="p-2 border border-slate-200">{item.buyerName || 'نقدي'}</td>
                          <td className="p-2 text-center font-mono border border-slate-200">{item.soldDate}</td>
                          <td className="p-2 text-left font-mono border border-slate-200">
                            {new PreciseMoney(item.productionCost).formatIQD()}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-slate-900 border border-slate-200">
                            {new PreciseMoney(item.actualSalePrice || 0).formatIQD()}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-emerald-800 border border-slate-200">
                            +{new PreciseMoney(item.netProfit || 0).formatIQD()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <tr>
                      <td colSpan={6} className="p-2 text-right">إجمالي أرباح مبيعات قطع المعرض المحصلة:</td>
                      <td colSpan={2} className="p-2 text-left font-mono text-emerald-800">
                        +{woodShowroomSoldProfit.add(alumShowroomSoldProfit).formatIQD()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures & Approvals */}
              <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-xs print-avoid-break">
                <div className="space-y-8">
                  <span className="font-bold text-slate-700 block">مسؤول المعرض والتسليم</span>
                  <div className="border-b border-dotted border-slate-400 mx-6"></div>
                  <span className="text-[10px] text-slate-400 block font-mono">التوقيع والختم</span>
                </div>
                <div className="space-y-8">
                  <span className="font-bold text-slate-700 block">المدير المالي والحسابات</span>
                  <div className="border-b border-dotted border-slate-400 mx-6"></div>
                  <span className="text-[10px] text-slate-400 block font-mono">التوقيع والختم</span>
                </div>
                <div className="space-y-8">
                  <span className="font-bold text-slate-700 block">المدير المفوض للشركة</span>
                  <div className="border-b border-dotted border-slate-400 mx-6"></div>
                  <span className="text-[10px] text-slate-400 block font-mono">التوقيع والختم</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD SYSTEM USER MODAL (نافذة إضافة مستخدم جديد) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">إضافة مستخدم جديد للنظام</h3>
                  <p className="text-xs text-slate-500">خاص بمبرمج ومطور النظام (م. ميثم ابراهيم)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {newUserError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{newUserError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    الاسم الكامل للمستخدم <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="مثال: أحمد عبد الله الهاشمي"
                      className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    اسم تسجيل الدخول (Username) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold">@</span>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      placeholder="e.g. ahmed"
                      className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-left"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">أحرف وأرقام إنجليزية بدون مسافات</span>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    كلمة المرور الأولية <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAddUserPassword ? 'text' : 'password'}
                      dir="ltr"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="noak2026"
                      className="w-full pr-9 pl-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-left"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddUserPassword(!showAddUserPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAddUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewUserPassword('noak2026')}
                    className="text-[10px] text-emerald-600 hover:underline font-bold mt-0.5 block"
                  >
                    تعيين كلمة المرور الافتراضية (noak2026)
                  </button>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    الدور والصلاحيات <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="ACCOUNTANT">محاسب مالي (سندات، قيود، تقارير، رواتب)</option>
                    <option value="ADMIN">مدير قسم (مشاريع، مستودع، عقود)</option>
                    <option value="SUPER_ADMIN">المدير العام (صلاحيات كاملة وغير مقيدة)</option>
                    <option value="MANAGER">مسؤول العمليات والمستودع</option>
                    <option value="SALES">مسؤول المبيعات وعروض الأسعار</option>
                  </select>
                </div>

                {/* Division */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    القسم التابع له <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newUserDivision}
                    onChange={(e) => setNewUserDivision(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="ALL">كافة الأقسام (الشركة العامة)</option>
                    <option value="WOOD">قسم الديكور الداخلي والنجارة</option>
                    <option value="ALUMINUM">قسم واجهات وتطبيقات الألمنيوم</option>
                  </select>
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">المسمى الوظيفي المخصص (اختياري)</label>
                  <input
                    type="text"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    placeholder="مثال: مهندس موقع / محاسب فرعي / مشرف إنتاج"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف (اختياري)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      dir="ltr"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="0770XXXXXXX"
                      className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none text-left"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@noak.iq"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-500 outline-none text-left"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>حفظ وإضافة المستخدم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL (نافذة تغيير كلمة المرور) */}
      {isChangePasswordModalOpen && targetUserForPassword && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تغيير كلمة المرور</h3>
                  <p className="text-xs text-slate-500">خاص بمبرمج ومطور النظام (م. ميثم ابراهيم)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${targetUserForPassword.avatarColor || 'bg-slate-700'} text-white font-bold text-sm flex items-center justify-center font-mono shadow-xs`}>
                {targetUserForPassword.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{targetUserForPassword.fullName}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    @{targetUserForPassword.username}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{targetUserForPassword.title || targetUserForPassword.roleArabic}</span>
                  <span>•</span>
                  <span>{targetUserForPassword.divisionId === 'ALL' ? 'كافة الأقسام' : targetUserForPassword.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}</span>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {passwordModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordModalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              {/* New Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  كلمة المرور الجديدة <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    dir="ltr"
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة (4 أحرف على الأقل)"
                    className="w-full pr-9 pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  تأكيد كلمة المرور الجديدة <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    dir="ltr"
                    required
                    value={confirmPasswordValue}
                    onChange={(e) => setConfirmPasswordValue(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور للتأكيد"
                    className="w-full pr-9 pl-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition text-left"
                  />
                </div>
              </div>

              {/* Helper Links & Quick Reset */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>استعادة أو تعيين سريع:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPasswordValue('noak2026');
                      setConfirmPasswordValue('noak2026');
                      setShowNewPassword(true);
                    }}
                    className="text-[11px] text-amber-900 hover:underline font-mono font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300"
                  >
                    تعيين noak2026
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  تنويه: سيتم حفظ التغيير فورياً ومزامنة الحساب مع شاشة الدخول، بحيث يستطيع المستخدم تسجيل الدخول فوراً بكلمة المرور الجديدة.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ كلمة المرور الجديدة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


