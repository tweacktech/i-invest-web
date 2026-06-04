'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { formatNgn } from '@/lib/format';

type VipStatus = {
  currentLevel: {
    level: number;
    name: string;
    description: string | null;
    dividendRate: string;
    weeklySalary: string;
    membersUnlockCount: number;
    maxWithdrawalPercent: string;
  };
  progression: {
    investmentProgress: string;
    investmentTarget: string;
    teamMembersProgress: number;
    teamMembersTarget: number;
    commissionProgress: string;
    commissionTarget: string;
    levelsCompleted: number;
  } | null;
  nextLevel: {
    level: number;
    name: string;
    requirements: {
      minInvestmentRequired: string;
      minTeamMembers: number;
      minCommissionEarned: string;
    };
    benefits: {
      dividendRate: string;
      weeklySalary: string;
      membersUnlockCount: number;
      maxWithdrawalPercent: string;
    };
  } | null;
};

function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : value > 0 ? 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        <span>
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function VipPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vip-status'],
    queryFn: async () => (await api.get<VipStatus>('/vip/status')).data,
  });

  if (isLoading) {
    return <p className="p-10 text-slate-500">Loading VIP status…</p>;
  }

  if (error || !data) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">VIP center</h1>
        <p className="mt-2 text-red-600">Could not load VIP status. Try again later.</p>
      </div>
    );
  }

  const p = data.progression;
  const invProgress = Number(p?.investmentProgress ?? 0);
  const invTarget = Number(p?.investmentTarget ?? 1);
  const commProgress = Number(p?.commissionProgress ?? 0);
  const commTarget = Number(p?.commissionTarget ?? 1);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 sm:p-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">VIP center</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Level up by growing investments, your team, and referral commissions.
        </p>
      </div>

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-900 dark:from-amber-950/40 dark:to-orange-950/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
          Current tier
        </p>
        <h2 className="mt-1 text-3xl font-black text-amber-900 dark:text-amber-100">
          VIP {data.currentLevel.level} · {data.currentLevel.name}
        </h2>
        {data.currentLevel.description ? (
          <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-200/80">{data.currentLevel.description}</p>
        ) : null}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-amber-800/70 dark:text-amber-300/70">Dividend</dt>
            <dd className="font-semibold text-amber-950 dark:text-amber-100">{data.currentLevel.dividendRate}%</dd>
          </div>
          <div>
            <dt className="text-amber-800/70 dark:text-amber-300/70">Weekly salary</dt>
            <dd className="font-semibold text-amber-950 dark:text-amber-100">
              {formatNgn(data.currentLevel.weeklySalary)}
            </dd>
          </div>
          <div>
            <dt className="text-amber-800/70 dark:text-amber-300/70">Member unlocks</dt>
            <dd className="font-semibold text-amber-950 dark:text-amber-100">{data.currentLevel.membersUnlockCount}</dd>
          </div>
          <div>
            <dt className="text-amber-800/70 dark:text-amber-300/70">Withdraw cap</dt>
            <dd className="font-semibold text-amber-950 dark:text-amber-100">
              {data.currentLevel.maxWithdrawalPercent}% of balance
            </dd>
          </div>
        </dl>
      </section>

      {p ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Progress to next level</h3>
          <ProgressBar value={invProgress} max={invTarget} label="Total investment" />
          <ProgressBar value={p.teamMembersProgress} max={p.teamMembersTarget || 1} label="Team members" />
          <ProgressBar value={commProgress} max={commTarget} label="Commission earned" />
        </section>
      ) : null}

      {data.nextLevel ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Next: VIP {data.nextLevel.level} · {data.nextLevel.name}
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>Invest at least {formatNgn(data.nextLevel.requirements.minInvestmentRequired)}</li>
            <li>Team size: {data.nextLevel.requirements.minTeamMembers} members</li>
            <li>Commission earned: {formatNgn(data.nextLevel.requirements.minCommissionEarned)}</li>
            <li>Withdraw up to {data.nextLevel.benefits.maxWithdrawalPercent}% of available balance</li>
          </ul>
        </section>
      ) : (
        <p className="text-center text-sm text-slate-500">You have reached the highest VIP tier.</p>
      )}
    </div>
  );
}
