'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname } from 'next/navigation';

const base =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL ?? ''
    : '';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? '';

const config = apiKey ? { headers: { 'x-api-key': apiKey } } : {};

export function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStaff = pathname?.startsWith('/staff');

  const { data } = useQuery({
    queryKey: ['public-site'],
    queryFn: async () =>
      (
        await axios.get(`${base}/public/site`, config)
      ).data as {
        maintenanceMode: boolean;
        maintenanceMessage: string | null;
      },
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: typeof window !== 'undefined' && !isStaff,
  });

  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (!data?.maintenanceMode) return;

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.location.reload();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [data?.maintenanceMode]);

  if (isStaff) return <>{children}</>;

  if (data?.maintenanceMode) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-6 dark:bg-slate-950">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          {/* Animated Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Under Maintenance
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {data.maintenanceMessage ||
              'We are performing scheduled maintenance to improve your experience.'}
          </p>

          <div className="mt-8 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Automatically checking again in
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {secondsLeft}s
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Check Again Now
          </button>

          <p className="mt-6 text-xs text-slate-400">
            Thank you for your patience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}