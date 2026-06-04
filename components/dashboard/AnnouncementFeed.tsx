'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export function AnnouncementFeed() {
  const qc = useQueryClient();

  const { data } = useQuery({
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

  const unread = data?.filter((n) => !n.read) ?? [];
  const latest = unread[0] ?? data?.[0];

  if (!latest) return null;

  return (
    <section
      className={`rounded-2xl border p-5 ${
        latest.read
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          : 'border-blue-200 bg-blue-50/80 dark:border-blue-900 dark:bg-blue-950/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Announcement</h2>
        <Link href="/dashboard/notifications" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
          View all{unread.length > 1 ? ` (${unread.length} new)` : ''}
        </Link>
      </div>
      <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{latest.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{latest.body}</p>
      {!latest.read && (
        <button
          type="button"
          className="mt-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          onClick={() => markRead.mutate(latest.id)}
        >
          Mark as read
        </button>
      )}
    </section>
  );
}
