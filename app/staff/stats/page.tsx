'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';
import { formatNgn } from '@/lib/format';

type StatsOverview = {
  users: { total: number; newToday: number; newThisWeek: number };
  recharges: {
    byStatus: Record<string, { count: number; amount: string }>;
    pending: number;
    completedToday: number;
  };
  withdrawals: {
    byStatus: Record<string, { count: number; amount: string }>;
    pending: number;
  };
  investments: { totalCount: number; totalPrincipal: string; activeCount: number };
  commissions: { totalPaid: string; transactionCount: number };
  generatedAt: string;
};

function statusAmount(byStatus: Record<string, { count: number; amount: string }>, key: string) {
  const row = byStatus[key];
  if (!row) return { count: 0, amount: '0' };
  return row;
}

export default function StaffStatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => (await adminApi.get<StatsOverview>('/staff/stats/overview')).data,
    refetchInterval: 60_000,
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  const completedRecharges = statusAmount(data.recharges.byStatus, 'COMPLETED');
  const pendingRechargeAmt = statusAmount(data.recharges.byStatus, 'PENDING');
  const approvedWithdrawals = statusAmount(data.withdrawals.byStatus, 'APPROVED');
  const completedWithdrawals = statusAmount(data.withdrawals.byStatus, 'COMPLETED');
  const pendingWithdrawAmt = statusAmount(data.withdrawals.byStatus, 'PENDING');

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Statistics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform overview — updated {new Date(data.generatedAt).toLocaleString()}
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Users</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard title="Total users" value={String(data.users.total)} accent="blue" />
          <MetricCard title="New today" value={String(data.users.newToday)} accent="emerald" />
          <MetricCard title="New this week" value={String(data.users.newThisWeek)} accent="cyan" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recharges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Pending queue" value={String(data.recharges.pending)} sub={formatNgn(pendingRechargeAmt.amount)} accent="amber" />
          <MetricCard title="Completed (all)" value={String(completedRecharges.count)} sub={formatNgn(completedRecharges.amount)} accent="emerald" />
          <MetricCard title="Approved today" value={String(data.recharges.completedToday)} accent="blue" />
          <MetricCard
            title="Rejected"
            value={String(statusAmount(data.recharges.byStatus, 'REJECTED').count)}
            sub={formatNgn(statusAmount(data.recharges.byStatus, 'REJECTED').amount)}
            accent="slate"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Withdrawals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Pending queue" value={String(data.withdrawals.pending)} sub={formatNgn(pendingWithdrawAmt.amount)} accent="amber" />
          <MetricCard
            title="Approved"
            value={String(approvedWithdrawals.count + completedWithdrawals.count)}
            sub={formatNgn(
              String(Number(approvedWithdrawals.amount) + Number(completedWithdrawals.amount)),
            )}
            accent="emerald"
          />
          <MetricCard
            title="Rejected"
            value={String(statusAmount(data.withdrawals.byStatus, 'REJECTED').count)}
            sub={formatNgn(statusAmount(data.withdrawals.byStatus, 'REJECTED').amount)}
            accent="slate"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Investments & referrals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total investments" value={String(data.investments.totalCount)} accent="blue" />
          <MetricCard title="Active investments" value={String(data.investments.activeCount)} accent="cyan" />
          <MetricCard title="Principal deployed" value={formatNgn(data.investments.totalPrincipal)} accent="emerald" large />
          <MetricCard
            title="Referral commissions paid"
            value={formatNgn(data.commissions.totalPaid)}
            sub={`${data.commissions.transactionCount} payouts`}
            accent="amber"
            large
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  accent = 'slate',
  large,
}: {
  title: string;
  value: string;
  sub?: string;
  accent?: 'blue' | 'emerald' | 'amber' | 'cyan' | 'slate';
  large?: boolean;
}) {
  const accents: Record<string, string> = {
    blue: 'border-blue-200 dark:border-blue-900',
    emerald: 'border-emerald-200 dark:border-emerald-900',
    amber: 'border-amber-200 dark:border-amber-900',
    cyan: 'border-cyan-200 dark:border-cyan-900',
    slate: 'border-slate-200 dark:border-slate-800',
  };

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${accents[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-2 font-black text-slate-900 dark:text-slate-100 ${large ? 'text-xl' : 'text-2xl'}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}
