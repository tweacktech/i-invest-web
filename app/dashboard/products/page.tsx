'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useState } from 'react';
import { useMoney } from '@/lib/currency';
import { toast } from '@/lib/toast';
import { WelfareBanner } from '@/components/dashboard/WelfareBanner';

import {
  ArrowUpRight,
  Clock3,
  Gift,
  TrendingUp,
  Wallet,
} from 'lucide-react';

type Package = {
  id: string;
  name: string;
  description: string | null;
  dailyYieldPercent: string;
  maturityDays: number;
  minAmount: string;
  maxAmount: string;
  price: string;
  firstTimeBonus: string;
};


export default function ProductsPage() {
  const qc = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () =>
      (await api.get<Package[]>('/investments/packages')).data,
  });

  const [err, setErr] = useState<string | null>(null);
  const { format } = useMoney();
  const buy = useMutation({
    mutationFn: async ({
      packageId,
      amount,
    }: {
      packageId: string;
      amount?: string;
    }) => {
      const payload: {
        packageId: string;
        amount?: string;
      } = {
        packageId,
      };

      if (amount) {
        payload.amount = amount;
      }

      const { data } = await api.post(
        '/investments/purchase',
        payload
      );

      return data;
    },

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['packages'] });
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      qc.invalidateQueries({ queryKey: ['my-investments'] });
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });
      setErr(null);
      const name = data?.package?.name ?? 'Investment plan';
      toast.success(`${name} purchased successfully! Daily returns will accrue when welfare rules are met.`);
    },

    onError: (error: any) => {
      setErr(
        error?.response?.data?.message ||
          'Could not complete purchase. Check your balance.'
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

          <p className="text-sm text-slate-500">
            Loading investment plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-5 lg:p-8">
      <WelfareBanner />
  
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            Investment Opportunities
          </div>
  
          <h1 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Packages
          </h1>
  
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose a Package and grow your wealth securely.
          </p>
        </div>
      </div>
  
      {/* Error */}
      {err && (
        <div className="rounded-xl border border-red-200 bg-red-500/10 p-3 text-xs sm:text-sm text-red-500">
          {err}
        </div>
      )}
  
      {/* Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages?.map((p) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-2xl sm:rounded-[28px] border border-slate-200 bg-white/70 shadow-md backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
          >
            {/* Top */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 sm:p-6 text-white">
              <div className="absolute right-[-30px] top-[-30px] h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-emerald-500/10 blur-3xl" />
  
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-white/10 p-2 sm:p-3 backdrop-blur">
                    <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  </div>
  
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] sm:text-xs font-semibold text-emerald-400">
                    ACTIVE
                  </span>
                </div>
  
                <p className="mt-4 text-xs sm:text-sm text-slate-300">
                  {p.name}
                </p>
  
                <h2 className="mt-1 text-lg sm:text-2xl font-black">
                  {format(Number(p.price) * Number(p.dailyYieldPercent) / 100)}
                </h2>
  
                <p className="text-xs sm:text-sm text-slate-400">
                  Daily Profit
                </p>
              </div>
            </div>
  
            {/* Body */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-cyan-500" />
                    <span className="text-xs sm:text-sm font-medium">Duration</span>
                  </div>
                  <span className="text-sm sm:text-base font-bold">
                    {p.maturityDays} Days
                  </span>
                </div>
  
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                  <span className="text-xs sm:text-sm font-medium">Min Bal</span>
                  <span className="text-sm sm:text-base font-bold">
                    {format(p.minAmount)}
                  </span>
                </div>
  
                {Number(p.firstTimeBonus) > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-500/10 p-3 sm:p-4 text-amber-700 dark:border-amber-900">
                    <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
  
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase">
                        First Time Bonus
                      </p>
                      <p className="text-sm sm:text-base font-bold">
                        +{format(p.firstTimeBonus)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Bottom */}
              <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800 p-2">
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    Starting Price
                  </p>
                  <h3 className="mt-1 text-md sm:text-2xl md:text-2xl lg:text-2xl font-black">
                    {format(p.price)}
                  </h3>
                </div>
  
                <button
                  type="button"
                  disabled={buy.isPending}
                  onClick={() => buy.mutate({ packageId: p.id })}
                  className="flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] disabled:opacity-50"
                >
                  {buy.isPending ? '...' : 'Purchase'}
                  {!buy.isPending && (
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}