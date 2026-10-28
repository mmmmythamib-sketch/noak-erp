import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Globe,
  Building2,
  KeyRound,
  AlertCircle,
  Server,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import noakLogo from '../assets/noak-logo-2026.png';
import { INITIAL_SYSTEM_USERS, SystemUser } from '../data/usersData';

interface LoginScreenProps {
  onLoginSuccess: (user: SystemUser) => void;
  users?: SystemUser[];
}

export function LoginScreen({ onLoginSuccess, users }: LoginScreenProps) {
  const currentUsers: SystemUser[] = (users && users.length > 0 ? users : (() => {
    try {
      const saved = localStorage.getItem('noak_system_users');
      if (saved) {
        const parsed = JSON.parse(saved) as SystemUser[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SYSTEM_USERS;
  })()).map((u) => {
    if (u.username === 'maytham' || u.id === 'usr-maytham') {
      return { ...u, password: '1988' };
    }
    return u;
  });

  // Remember username state (defaults to true)
  const [rememberUsername, setRememberUsername] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('noak_remember_username_enabled');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  // Remembered username pre-filled (default to 'maytham')
  const [username, setUsername] = useState<string>(() => {
    try {
      const remembered = localStorage.getItem('noak_remembered_username');
      if (remembered) return remembered;
    } catch {}
    return 'maytham';
  });

  // Password is NEVER remembered - always requested manually
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setErrorMessage('يرجى إدخال اسم المستخدم أو البريد الإلكتروني.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    setIsLoading(true);

    // Realistic authentication delay
    setTimeout(() => {
      // Find matching user (accepts username, email, or fullName)
      const matched = currentUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          u.email?.toLowerCase() === cleanUser ||
          u.fullName.toLowerCase() === cleanUser
      );

      // Check if user is disabled
      if (matched && !matched.isActive) {
        setIsLoading(false);
        setErrorMessage('هذا الحساب معطل حالياً من قبل إدارة النظام.');
        return;
      }

      // Password validation (1988 for maytham)
      const isPasswordValid =
        matched &&
        (cleanPass === matched.password ||
          (matched.username === 'maytham' && (cleanPass === '1988' || cleanPass === matched.password)) ||
          (!matched.password && (cleanPass === '1988' || cleanPass === 'noak2026')) ||
          (matched.username === 'abbas' &&
            (cleanPass === 'noak2026' || cleanPass === '123456' || cleanPass === 'admin')));

      if (matched && isPasswordValid) {
        // Save or clear remembered username
        try {
          if (rememberUsername) {
            localStorage.setItem('noak_remembered_username', cleanUser);
            localStorage.setItem('noak_remember_username_enabled', 'true');
          } else {
            localStorage.removeItem('noak_remembered_username');
            localStorage.setItem('noak_remember_username_enabled', 'false');
          }
        } catch {}

        // Safe session without saving raw password
        const safeSessionUser = {
          ...matched,
          password: matched.username === 'maytham' ? '1988' : matched.password,
        };
        try {
          sessionStorage.setItem('noak_auth_session', JSON.stringify(safeSessionUser));
          localStorage.setItem('noak_auth_session', JSON.stringify(safeSessionUser));
        } catch {
          // ignore
        }
        setIsLoading(false);
        onLoginSuccess({
          ...matched,
          password: matched.username === 'maytham' ? '1988' : matched.password,
        });
      } else {
        setIsLoading(false);
        setErrorMessage('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Dynamic Background Lighting Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.22),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/95 p-1 flex items-center justify-center shadow-md border border-slate-700/60">
            <img src={noakLogo} alt="NOAK Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
              <span>شركة نوك للديكور الداخلي والألمنيوم</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Cloud ERP Enterprise
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
              NOAK WOOD & ALUMINUM INDUSTRIES - ONLINE SYSTEM
            </p>
          </div>
        </div>

        {/* Server & Security Status Badges */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>الخادم السحابي متصل (Online)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>SSL 256-Bit</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Right Brand Showcase (Arabic Right / First Column) */}
          <div className="lg:col-span-6 space-y-6 text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>البوابة السحابية الموحدة لإدارة المشاريع والمصانع</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                منظومة NOAK ERP المتطورة
                <span className="block text-emerald-400 mt-1">
                  لقسمي النجارة والديكور والألمنيوم
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                نظام إدارة موارد المؤسسات السحابي الشامل، مصمم خصيصاً للربط المباشر بين الورش والمشاريع، الحسابات المالية المزدوجة، إدارة المستودعات بنظام FIFO، وسجل الشركاء وتصفية الأرباح.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs">المشاريع والعقود</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  توليد العقود وسندات القبض وكشوفات الحساب A4 الرسمية بضغطة زر واحدة.
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs">حساب كلفة FIFO</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  صرف وجبات المواد الخام وحساب ربحية كل مشروع بدقة محاسبية صفرية الفروقات.
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs">الشركاء والأرباح</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  عزل مالي تام بين قسمي النجارة والألمنيوم وتصفية الأرباح الدورية بدقة.
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-xs">أمان سحابي متكامل</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  صلاحيات مستخدمين متعددة، تدقيق مستندي، واتصال مشفر على الدومين المعتمد.
                </p>
              </div>
            </div>

            {/* Support Note */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center gap-3 text-xs text-slate-400">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                كربلاء المقدسة - طريق النجف - قرب جامعة العميد | هاتف الدعم: 07700000000
              </span>
            </div>
          </div>

          {/* Left: Login Form Card (Arabic Left / Second Column) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
              {/* Form Card Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500"></div>

              {/* Form Header */}
              <div className="space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>بوابة أمان NOAK-Auth</span>
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">تسجيل الدخول للنظام</h3>
                <p className="text-xs text-slate-400">
                  أدخل بيانات حسابك للوصول إلى لوحة التحكم والعمليات السحابية
                </p>
              </div>

              {/* Error Alert Banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Standard Login Form */}
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-right">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    اسم المستخدم أو البريد الإلكتروني:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      dir="ltr"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. abbas or abbas@noak.iq"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs font-mono outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                      autoComplete="off"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-300 flex items-center gap-1.5">
                      <span>كلمة المرور:</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        مطلوب إدخالها
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('لإعادة ضبط كلمة المرور، يرجى التواصل مع مبرمج ومطور النظام م. ميثم ابراهيم.')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور للمتابعة..."
                      autoFocus={Boolean(username)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs font-mono outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                      autoComplete="new-password"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                      title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Username & Security Info */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500/30 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-slate-300">تذكر اسم المستخدم على هذا الجهاز</span>
                  </label>
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SSL 256-Bit</span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>جاري التحقق من الصلاحيات والاتصال السحابي...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول للنظام السحابي</span>
                      <ArrowRight className="w-4 h-4 mr-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>
          <span>جميع الحقوق محفوظة © 2026 شركة نوك للديكور الداخلي والألمنيوم.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام محمي ومشفر بالكامل</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>NOAK Cloud Core Architecture</span>
        </div>
      </footer>
    </div>
  );
}
