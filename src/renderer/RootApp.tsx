import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { INITIAL_SYSTEM_USERS, SystemUser } from './data/usersData';

// Lazy-load the comprehensive ERP application
const MainApp = lazy(() => import('./App'));

export function RootApp() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem('noak_auth_session') || localStorage.getItem('noak_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed && typeof parsed === 'object' && parsed.fullName);
      }
      return false;
    } catch {
      return false;
    }
  });

  const [activeUser, setActiveUser] = useState<SystemUser>(() => {
    try {
      const saved = sessionStorage.getItem('noak_auth_session') || localStorage.getItem('noak_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.fullName) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_SYSTEM_USERS[0];
  });

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
    } catch {}
    return INITIAL_SYSTEM_USERS;
  });

  const handleLoginSuccess = (user: SystemUser) => {
    setActiveUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من النظام السحابي؟')) {
      try {
        sessionStorage.removeItem('noak_auth_session');
        localStorage.removeItem('noak_auth_session');
      } catch {}
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} users={systemUsers} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 space-y-4 font-cairo">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-white">جاري تهيئة منظومة نوك السحابية...</h2>
            <p className="text-xs text-slate-400 font-mono">NOAK ERP Enterprise Core Architecture</p>
          </div>
        </div>
      }
    >
      <MainApp
        rootActiveUser={activeUser}
        rootSystemUsers={systemUsers}
        onRootLogout={handleLogout}
      />
    </Suspense>
  );
}
