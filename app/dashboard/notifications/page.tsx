'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api-client';

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get<Notification[]>('/notifications')).data,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Updates and announcements from I-Invest
          {unread > 0 ? (
            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
              {unread} new
            </span>
          ) : null}
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : data?.length ? (
        <ul className="space-y-4">
          {data.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border p-5 shadow-sm transition ${
                n.read
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  : 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                    New
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {n.body}
              </p>
              {!n.read && (
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  disabled={markRead.isPending}
                  onClick={() => markRead.mutate(n.id)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
          <p className="text-slate-500">No announcements right now.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
