'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { toast } from '@/lib/toast';
import { WelfareBanner } from '@/components/dashboard/WelfareBanner';

export default function WelfarePage() {
  const qc = useQueryClient();
  const { format } = useMoney();

  const { data } = useQuery({
    queryKey: ['welfare-status'],
    queryFn: async () => (await api.get('/welfare/status')).data,
  });

  const purchase = useMutation({
    mutationFn: async () => (await api.post('/welfare/purchase')).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['welfare-status'] });
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });
      toast.success('Weekly welfare paid successfully!');
    },
  });

  if (!data?.enabled) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Weekly welfare</h1>
        <p className="mt-4 text-slate-500">Welfare is not required on the platform right now.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Weekly welfare</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Required to keep your investments earning on working days.
        </p>
      </div>

      <WelfareBanner />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">How it works</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Pay {format(data.weeklyPrice)} once per week (week starts Monday UTC).</li>
          <li>Without payment, active investments do not accrue returns that week.</li>
          <li>Returns automatically pause on Saturdays, Sundays, and configured public holidays.</li>
          <li>Payment is deducted from your available wallet balance.</li>
        </ul>
      </section>

      {!data.paidForCurrentWeek && (
        <button
          type="button"
          disabled={purchase.isPending}
          onClick={() => purchase.mutate()}
          className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 py-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {purchase.isPending ? 'Processing…' : `Pay welfare — ${format(data.weeklyPrice)}`}
        </button>
      )}
    </div>
  );
}
