'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

type Summary = {
  teamCounts: { level1: number; level2: number; level3: number; total: number };
  commissionRates: { level: number; percent: number }[];
  commissions: {
    total: string;
    level1: string;
    level2: string;
    level3: string;
    count: number;
  };
};

type TeamLevel = {
  level: number;
  ratePercent: number;
  members: {
    id: string;
    phoneMasked: string;
    referralCode: string;
    vipTier: number;
    level: number;
    joinedAt: string;
    investmentCount: number;
    directReferrals: number;
  }[];
};

export default function TeamPage() {
  const summary = useQuery({
    queryKey: ['referral-summary'],
    queryFn: async () => (await api.get<Summary>('/referral/summary')).data,
  });
  

  const team = useQuery({
    queryKey: ['referral-team'],
    queryFn: async () => (await api.get<{ levels: TeamLevel[] }>('/referral/team')).data,
  });

  const commissions = useQuery({
    queryKey: ['referral-commissions'],
    queryFn: async () =>
      (
        await api.get<
          { id: string; amount: string; level: number; description: string | null; createdAt: string }[]
        >('/referral/commissions')
      ).data,
  });
  const { format } = useMoney();
  const s = summary.data;

  const c = s?.commissions;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">My team</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Earn commissions when your network invests — Level 1: 3%, Level 2: 2.5%, Level 3: 2%.
        </p>
      </div>

      {summary.isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : s ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total team" value={String(s.teamCounts.total)} />
            <StatCard label="Level 1" value={String(s.teamCounts.level1)} sub="3% commission" />
            <StatCard label="Level 2" value={String(s.teamCounts.level2)} sub="2.5% commission" />
            <StatCard label="Level 3" value={String(s.teamCounts.level3)} sub="2% commission" />
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Commission earnings</h2>
            <p className="mt-4 text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {format(c?.total ?? 0)}
            </p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-slate-500">Level 1</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{format (c?.level1 ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-slate-500">Level 2</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{format(c?.level2 ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-slate-500">Level 3</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{format(c?.level3 ?? 0)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{c?.count ?? 0} commission payments received</p>
          </section>
        </>
      ) : null}

      <section className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Network members</h2>
        {team.isLoading ? (
          <p className="text-sm text-slate-500">Loading team…</p>
        ) : (
          team.data?.levels.map((lvl) => (
            <div
              key={lvl.level}
              className="rounded-[28px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Level {lvl.level}{' '}
                  <span className="text-sm font-normal text-slate-500">({lvl.ratePercent}% on their investments)</span>
                </h3>
                <p className="text-xs text-slate-400">{lvl.members.length} member{lvl.members.length !== 1 ? 's' : ''}</p>
              </div>
              {lvl.members.length ? (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lvl.members.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{m.phoneMasked}</p>
                        <p className="text-xs text-slate-500">
                          Joined {new Date(m.joinedAt).toLocaleDateString()} · Level {m.level}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{m.investmentCount} investment{m.investmentCount !== 1 ? 's' : ''}</p>
                        {m.directReferrals > 0 ? <p>{m.directReferrals} direct referral{m.directReferrals !== 1 ? 's' : ''}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-6 text-sm text-slate-500">No members at this level yet.</p>
              )}
            </div>
          ))
        )}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent commissions</h2>
        </div>
        {commissions.isLoading ? (
          <p className="px-5 py-6 text-sm text-slate-500">Loading…</p>
        ) : commissions.data?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {commissions.data.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">+{format(row.amount)}</p>
                  <p className="text-xs text-slate-500">{row.description ?? `Level ${row.level}`}</p>
                </div>
                <p className="text-xs text-slate-400">{new Date(row.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-slate-500">
            No commissions yet. Share your referral link — you earn when your team invests.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">{value}</p>
      {sub ? <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{sub}</p> : null}
    </div>
  );
}
