'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { theme, toggle } = useTheme();

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-[#0a1628] via-[#1a2d4a] to-[#f5f0e8] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/20 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <Link href="/" className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">I‑INVEST</p>
          <p className="mt-1 text-xs font-semibold tracking-[0.25em] text-white/75">NIGERIA</p>
        </Link>

        <div className="w-full max-w-[420px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">{footer}</div>
        </div>
      </div>
    </div>
  );
}
