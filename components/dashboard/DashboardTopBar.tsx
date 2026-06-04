'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { NotificationBell } from './NotificationBell';
import { Moon, Sun } from 'lucide-react';

type Props = {
  phone?: string;
};

 const maskPhone = (phone?: string) => {
    if (!phone) return '****';

    return (
      phone.slice(0, 4) +
      '****' +
      phone.slice(-3)
    );
  };

export function DashboardTopBar({ phone }: Props) {
  const router = useRouter();
  const { theme, toggle } = useTheme();

  const logout = () => {
    window.localStorage.removeItem('accessToken');
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 hidden shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:flex">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Dashboard
        </p>
        {phone ? (
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{maskPhone(phone)}</p>
        ) : (
          <Link href="/dashboard" className="text-sm font-bold text-[#1e3a5f] dark:text-blue-300">
            I‑INVEST
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 sm:h-5 sm:w-5" />
        )}
        </button>
        <Link
          href="/dashboard/profile"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          Profile
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
