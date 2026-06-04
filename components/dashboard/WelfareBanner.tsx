'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { toast } from '@/lib/toast';

type WelfareStatus = {
  enabled: boolean;
  weeklyPrice: string;
  currentWeekStart: string;
  paidForCurrentWeek: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  accrualPausedToday: boolean;
  message: string | null;
};

export function WelfareBanner() {
  const qc = useQueryClient();
  const { format } = useMoney();

  const { data } = useQuery({
    queryKey: ['welfare-status'],
    queryFn: async () => (await api.get<WelfareStatus>('/welfare/status')).data,
  });

  const purchase = useMutation({
    mutationFn: async () => (await api.post('/welfare/purchase')).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['welfare-status'] });
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      toast.success('Weekly welfare paid! Your investments will continue earning this week.');
    },
  });

  if (!data?.enabled) return null;

  const needsPay = !data.paidForCurrentWeek;

  return (
    <section
      className={`rounded-2xl border p-5 ${
        needsPay
          ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
          : 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Weekly welfare</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {data.message ??
              'Pay each Monday to keep all active investments earning. Returns pause on weekends and holidays.'}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Week of {data.currentWeekStart} · Fee {format(data.weeklyPrice)}
            {data.accrualPausedToday ? ' · Accrual paused today' : ''}
          </p>
        </div>
        {needsPay ? (
          <button
            type="button"
            disabled={purchase.isPending}
            onClick={() => purchase.mutate()}
            className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {purchase.isPending ? 'Paying…' : `Pay ${format(data.weeklyPrice)}`}
          </button>
        ) : (
          <span className="rounded-full bg-emerald-600/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Paid this week
          </span>
        )}
      </div>
      <Link href="/dashboard/welfare" className="mt-3 inline-block text-xs font-medium text-amber-800 hover:underline dark:text-amber-300">
        Learn more about welfare rules
      </Link>
    </section>
  );
}
