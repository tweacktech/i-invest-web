'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { NotificationBell } from './NotificationBell';
import { Moon, Sun } from 'lucide-react';

type Props = {
  onMenu: () => void;
  phone?: string;
};


export function DashboardHeader({ onMenu, phone }: Props) {
  const router = useRouter();
  const { theme, toggle } = useTheme();

  const logout = () => {
    window.localStorage.removeItem('accessToken');
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
          aria-label="Open menu"
        >
          ☰
        </button>
        <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-xl font-black text-white shadow-lg">
              I
            </div>
            <div>
              <h1 className="text-md font-black tracking-tight text-slate-900 dark:text-white">
                I-Invest
              </h1>

            </div>
          </Link>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium dark:border-slate-700"
        >
         {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 sm:h-5 sm:w-5" />
        )}
        </button>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
