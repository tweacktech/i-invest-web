'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { StaffSidebar } from '@/components/staff/StaffSidebar';
import { StaffHeader } from '@/components/staff/StaffHeader';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (pathname === '/staff/login') {
      setReady(true);
      return;
    }
    const token = window.localStorage.getItem('adminAccessToken');
    if (!token) {
      window.location.href = '/staff/login';
      return;
    }
    adminApi
      .get('/staff/auth/me')
      .then((res) => {
        setEmail(res.data?.email);
        setReady(true);
      })
      .catch(() => {
        window.localStorage.removeItem('adminAccessToken');
        router.replace('/staff/login');
      });
  }, [router, pathname]);

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  if (pathname === '/staff/login') {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <StaffSidebar email={email} mobileOpen={mobileMenu} onCloseMobile={() => setMobileMenu(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <StaffHeader onMenu={() => setMobileMenu(true)} email={email} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
