import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import {
  LayoutDashboard, CheckSquare, Gift, MonitorPlay, FileText,
  Crown, Wallet, Users, Settings, LogOut, Menu, X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLang();

  const NAV_LINKS = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('tasks'), href: '/tasks', icon: CheckSquare },
    { name: t('offers'), href: '/offers', icon: Gift },
    { name: t('ads'), href: '/ads', icon: MonitorPlay },
    { name: t('surveys'), href: '/surveys', icon: FileText },
    { name: t('vip'), href: '/vip', icon: Crown },
    { name: t('wallet'), href: '/wallet', icon: Wallet },
    { name: t('referral'), href: '/referral', icon: Users },
  ];

  if (isLoading) return null;
  if (!user) { setLocation('/login'); return null; }

  const handleLogout = () => { logout(); setLocation('/login'); };

  const NavItem = ({ name, href, icon: Icon }: any) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer mb-1 ${
            isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{name}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-800 dark:bg-blue-950 text-white shadow-xl flex-shrink-0 fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-blue-700 dark:border-blue-900">
          <span className="text-xl font-bold tracking-tight">ClickEarn</span>
          <div className="ms-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 border-b border-blue-700 dark:border-blue-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm line-clamp-1">{user.name}</p>
              <span className="text-xs bg-yellow-500 text-yellow-900 px-1.5 py-0.5 rounded font-bold">
                VIP {user.vipLevel}
              </span>
            </div>
          </div>
          <div className="bg-blue-900 dark:bg-blue-950 rounded-lg p-3 mt-3">
            <p className="text-xs text-blue-200 mb-1">{t('balance')}</p>
            <p className="text-lg font-bold">${user.balance.toFixed(2)}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_LINKS.map(link => <NavItem key={link.href} {...link} />)}
          {user.isAdmin && <NavItem name={t('adminPanel')} href="/admin" icon={Settings} />}
        </nav>

        <div className="p-4 border-t border-blue-700 dark:border-blue-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-blue-800 dark:bg-blue-950 flex items-center justify-between px-4 z-50">
        <span className="text-white text-xl font-bold">ClickEarn</span>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <button className="text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-blue-800 dark:bg-blue-950 z-40 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <span className="text-xs bg-yellow-500 text-yellow-900 px-1.5 py-0.5 rounded font-bold">VIP {user.vipLevel}</span>
              </div>
            </div>
            <p className="text-white font-bold mt-2">${user.balance.toFixed(2)}</p>
          </div>
          <nav className="flex-1 py-4 px-3">
            {NAV_LINKS.map(link => <NavItem key={link.href} {...link} />)}
            {user.isAdmin && <NavItem name={t('adminPanel')} href="/admin" icon={Settings} />}
          </nav>
          <div className="p-4">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-blue-200 w-full">
              <LogOut className="w-5 h-5" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen pt-16 md:pt-0 md:ps-64">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
