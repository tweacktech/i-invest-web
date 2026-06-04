'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Megaphone, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';

type BannerData = {
  welcomeMessage: string;
  urgentAdminNote: string | null;
  unreadCount: number;
  latestUnread: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
  } | null;
};

export function DashboardBannerAlert() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-banner'],
    queryFn: async () => (await api.get<BannerData>('/notifications/dashboard-banner')).data,
    refetchInterval: 60_000,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-banner'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="mx-4 mt-4 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 p-6 lg:mx-6 dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  const hasUrgent = Boolean(data.urgentAdminNote);
  const hasUnread = Boolean(data.latestUnread);

  return (
    <div
      role="region"
      aria-label="Platform announcements"
      className="mx-4 mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl lg:mx-6 dark:border-slate-700"
    >
      <div className="relative p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-40 rounded-full bg-blue-500/15 blur-2xl" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90">
                Welcome
              </p>
              <p className="mt-1 text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
                {data.welcomeMessage}
              </p>
            </div>
          </div>

          {hasUrgent && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/15 p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-200">Urgent notice</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-amber-50">
                    {data.urgentAdminNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasUnread && data.latestUnread && (
            <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-4 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-200">
                      New notification
                      {data.unreadCount > 1 ? ` · ${data.unreadCount} unread` : ''}
                    </p>
                    <p className="mt-1 font-semibold text-white">{data.latestUnread.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">{data.latestUnread.body}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"
                    disabled={markRead.isPending}
                    onClick={() => markRead.mutate(data.latestUnread!.id)}
                  >
                    Mark read
                  </button>
                  <Link
                    href="/dashboard/notifications"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!hasUnread && data.unreadCount === 0 && (
            <Link
              href="/dashboard/notifications"
              className="inline-flex text-xs font-medium text-slate-400 hover:text-white"
            >
              View notification history →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
