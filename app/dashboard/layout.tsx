'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { DashboardBannerAlert } from '@/components/dashboard/DashboardBannerAlert';
import { api } from '@/lib/api-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phone, setPhone] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('accessToken')
        : null;

    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setPhone(res.data?.phoneNumber))
      .catch(() => router.replace('/login'))
      .finally(() => setReady(true));
  }, [router, pathname]);

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      <Sidebar
        phone={phone}
        mobileOpen={mobileMenu}
        onCloseMobile={() => setMobileMenu(false)}
      />
  
      {/* Main Section */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenu={() => setMobileMenu(true)} phone={phone} />
        <DashboardTopBar phone={phone} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <DashboardBannerAlert />
          <div className="min-h-full pb-24 lg:pb-8">{children}</div>
        </main>
      </div>
  
      {/* Floating Support */}
      <a
        href="mailto:tweacktech@gmail.com"
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition hover:bg-blue-700"
        aria-label="Support"
      >
        🎧
      </a>
    </div>
  );
}