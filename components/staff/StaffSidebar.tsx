'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { LogOut, LogOutIcon, Sun, Moon } from 'lucide-react';

const nav = [
  { href: '/staff', label: 'Overview', icon: '📊' },
  { href: '/staff/stats', label: 'Statistics', icon: '📈' },
  { href: '/staff/users', label: 'Users', icon: '👥' },
  { href: '/staff/recharges', label: 'Recharges', icon: '💳' },
  { href: '/staff/withdrawals', label: 'Withdrawals', icon: '🏦' },
  { href: '/staff/manage/banks', label: 'Banks', icon: '🏛️' },
  { href: '/staff/manage/vip', label: 'VIP levels', icon: '👑' },
  { href: '/staff/manage/package', label: 'Packages', icon: '📦' },
  { href: '/staff/manage/task', label: 'Daily tasks', icon: '✨' },
  { href: '/staff/announcements', label: 'Announcements', icon: '📢' },
];

type StaffSidebarProps = {
  email?: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function StaffSidebar({ email, mobileOpen, onCloseMobile }: StaffSidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      active
        ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="shrink-0 border-b border-slate-100 px-5 py-6 dark:border-slate-800">
          <Link href="/staff" className="flex items-center gap-3" onClick={onCloseMobile}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-xl font-black text-white shadow-lg">
              S
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">I-Invest</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Staff console</p>
            </div>
          </Link>
          <div className="mt-4 hidden lg:block">
          
      <button
        onClick={toggle}
        className="fixed right-4 top-4 z-50 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition-all hover:scale-110 dark:bg-slate-800/80 sm:right-6 sm:top-6 sm:p-3"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 sm:h-5 sm:w-5" />
        )}
      </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {nav.map((item) => {
              const active =
                item.href === '/staff'
                  ? pathname === '/staff'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={linkClass(active)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
          {email ? (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem('adminAccessToken');
              window.location.href = '/staff/login';
            }}
            className="mt-3 text-left text-xs font-medium text-red-600 hover:underline dark:text-red-400"
          >
            <LogOutIcon></LogOutIcon>
          </button>
        </div>
      </aside>
    </>
  );
}
