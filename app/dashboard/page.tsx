'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  CreditCard,
  Gift,
  TrendingUp,
  Wallet,
  Loader2,
  User,
} from 'lucide-react';

import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { WelfareBanner } from '@/components/dashboard/WelfareBanner';
import { useQuery } from '@tanstack/react-query';

export default function DashboardHomePage() {
  const { format } = useMoney();

  // Wallet balance query
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () =>
      (await api.get<{ available: string; frozen: string; reserved: string }>('/wallet/balance'))
        .data,
  });

  // Referral commissions query
  const { data: commissions, isLoading: commissionsLoading } = useQuery({
    queryKey: ['referral-commissions'],
    queryFn: async () =>
      (
        await api.get<
          { id: string; amount: string; level: number; description: string | null; createdAt: string }[]
        >('/referral/commissions')
      ).data,
  });

  // Active investments query
  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['active-investments'],
    queryFn: async () => {
      const response = await api.get('/investments/mine');
      const investments = response.data?.investments ?? response.data ?? [];
      // Filter only active investments
      return investments.filter((i: { status: string }) => i.status === 'ACTIVE');
    },
  });

  const avail = balance?.available ?? '0';
  
  // Calculate total active investment sum (principal amount)
  const totalActiveInvestment = investments?.reduce(
    (sum: number, inv: { principalAmount: string }) => sum + (parseFloat(inv.principalAmount) || 0),
    0
  ) ?? 0;

  // Calculate total earned interest from active investments
  const totalEarnedInterest = investments?.reduce(
    (sum: number, inv: { totalInterestAccrued: string }) => sum + (parseFloat(inv.totalInterestAccrued) || 0),
    0
  ) ?? 0;

  const cards = [
    {
      title: 'Frozen Balance',
      value: format(balance?.frozen),
      icon: Wallet,
      color: 'from-cyan-500 to-blue-500',
      loading: balanceLoading,
    },
    {
      title: 'Reserved Funds',
      value: format(balance?.reserved),
      icon: CreditCard,
      color: 'from-emerald-500 to-green-500',
      loading: balanceLoading,
    },
    {
      title: 'Referral Commissions',
      value: format(commissions?.reduce((acc, curr) => acc + Number(curr.amount), 0) ?? 0),
      icon: Gift,
      color: 'from-orange-500 to-amber-500',
      loading: commissionsLoading,
    },
  ];

  return (
    <div className="space-y-8 p-5 lg:p-8">
      <WelfareBanner />
      
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl">
        {/* Glow */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-40px] h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
            <Link 
                href="/dashboard/investments"> 
                 <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              
                 <TrendingUp className="h-4 w-4 text-emerald-400" />
                Investment Wallet
               
              </div>
            </Link>
              <p className="mt-6 text-sm text-slate-300">Available Balance</p>

              <h1 className="mt-2 text-3xl font-black tracking-tight">
                {balanceLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  format(avail)
                )}
              </h1>

              <p className="mt-3 max-w-md text-slate-400">
                Monitor your investment growth, earnings, and transactions in real time.
              </p>
            </div>

            {/* Investment Stats */}
            <div className="grid min-w-[200px] gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-slate-300"> ({investmentsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    investments?.length ?? 0
                  )} ) Active Investments</p>

                <h3 className="mt-2 text-2xl font-black">
                   {format(totalEarnedInterest.toString())}
                </h3>
                <Link 
                href="/dashboard/investments">

                   <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Active Positions
                </span>
                </Link>

              </div>

             
            </div>
          </div>
{/* Buttons */}
<div className="mt-4">
  {/* Mobile: 2x2 grid */}
  <div className="grid grid-cols-2 gap-2 sm:hidden">
    <Link
      href="/dashboard/recharge"
      className="group flex items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-3 text-xs font-semibold text-white shadow-xl transition hover:scale-[1.02]"
    >
      + Recharge
      <ArrowUpRight className="h-3 w-2 transition group-hover:translate-x-1" />
    </Link>
    
    <Link
      href="/dashboard/products"
      className="group flex items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-3 text-xs font-semibold text-white shadow-xl transition hover:scale-[1.02]"
    >
      + I-invest
      <ArrowUpRight className="h-3 w-2 transition group-hover:translate-x-1" />
    </Link>

    <Link
      href="/dashboard/withdraw"
      className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
    >
      Withdraw
    </Link>

    <Link
      href="/dashboard/activities"
      className="flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 px-3 py-3 text-xs font-semibold text-white transition hover:bg-slate-900/70"
    >
      Daily Tasks
    </Link>
  </div>

            {/* Tablet/Desktop: 4 in a row */}
            <div className="hidden sm:flex sm:flex-wrap sm:gap-3">
              <Link
                href="/dashboard/recharge"
                className="group flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-4 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02]"
              >
                + Recharge
                <ArrowUpRight className="h-4 w-3 transition group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/dashboard/investments"
                className="group flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-700 to-cyan-500 px-4 py-4 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02]"
              >
                I-invest
                <User className="h-4 w-3 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/withdraw"
                className="flex flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Withdraw
              </Link>

              <Link
                href="/dashboard/activities"
                className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-900/70"
              >
                Daily Tasks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="grid gap-5 md:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group rounded-[28px] border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-white shadow-lg`}
            >
              <card.icon className="h-6 w-6" />
            </div>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              {card.title}
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight">
              {card.loading ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                card.value
              )}
            </h3>
          </div>
        ))}
      </section>

     {/* QUICK LINKS */}
      <section className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Investment */}
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-7 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Investment Plans</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Browse available investment packages and start earning.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-500">📈</div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Investments</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {investmentsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  `${investments?.length ?? 0} positions`
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Invested</p>
              <p className="text-xl font-bold">
                {investmentsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  format(totalActiveInvestment.toString())
                )}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/products"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03]"
          >
            Browse Plans
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Account Statement */}
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-7 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Account Statement</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                View your transaction history and statements.
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-500">📊</div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Transactions</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {/* {transactionsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                transactions?.length || 0
              )} */}
            </p>
          </div>

          <Link
            href="/dashboard/transactions"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 hover:text-cyan-500 dark:border-slate-700"
          >
            View Statement
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Daily Activities */}
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-7 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Daily Activities</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Complete daily tasks and increase your earnings.
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-500">✨</div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Earned Interest (Active)</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {investmentsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                format(totalEarnedInterest.toString())
              )}
            </p>
          </div>

          <Link
            href="/dashboard/activities"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 hover:text-cyan-500 dark:border-slate-700"
          >
            Open Activities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}