'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { CurrencySwitcher } from '../CurrencySwitcher';
import { NotificationNavLink } from './NotificationNavLink';
import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';

const nav = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/dashboard/products', label: 'Products', icon: '📦' },
  { href: '/dashboard/recharge', label: 'Recharge', icon: '💳' },
  { href: '/dashboard/investments', label: 'My I-Invest', icon: '📈' },
  // { href: '/dashboard/welfare', label: 'Welfare', icon: '🛡️' },
  { href: '/dashboard/team', label: 'My Team', icon: '👥' },
  // { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔', badge: true },
  { href: '/dashboard/activities', label: 'Activities', icon: '✨' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

type SidebarProps = {
  phone?: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  phone,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      active
        ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-100 px-5 py-6 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="I-Invest Logo"
              width={24}
              height={24}
              className="h-full w-full object-cover"
              priority
            />
          </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                I-Invest
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Investment Platform
              </p>
            </div>
          </Link>

          {/* <div className="mt-4 hidden items-center justify-between gap-2 lg:flex">
            <button
              type="button"
              onClick={toggle}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div> */}
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {nav.map((item) => {
              const active =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              if ('badge' in item && item.badge) {
                return (
                  <NotificationNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    onNavigate={onCloseMobile}
                    linkClass={linkClass}
                  />
                );
              }

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

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
          {/* {phone ? (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {phone}
            </p>
          ) : null} */}

          <div className="mt-3 flex flex-col gap-3">
            <CurrencySwitcher />

            {/* <Link
              href="/dashboard/profile"
              onClick={onCloseMobile}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View Profile
            </Link> */}

            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem('accessToken');
                window.location.href = '/login';
              }}
              className="text-left text-xs font-medium text-red-600 hover:underline dark:text-red-400"
            >
              <LogOutIcon className="mr-2" /> 
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}