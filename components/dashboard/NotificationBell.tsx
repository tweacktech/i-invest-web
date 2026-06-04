'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { api } from '@/lib/api-client';

export function NotificationBell() {
  const { data } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => (await api.get<{ count: number }>('/notifications/unread-count')).data,
    refetchInterval: 45_000,
  });

  const count = data?.count ?? 0;

  return (
    <Link
      href="/dashboard/notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={count > 0 ? `${count} unread notifications` : 'Notifications'}
    >
      <Bell className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
