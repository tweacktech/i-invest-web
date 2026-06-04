'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Copy,
  Crown,
  Gift,
  ShieldCheck,
  Wallet,
  TrendingUp,
  History,
  Banknote,
  Settings,
  Bell,
  Activity,
  Lock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Award
} from 'lucide-react';

import { api } from '@/lib/api-client';
import { formatNgn } from '@/lib/format';
import { AccountStatusBadge, KycStatusBadge } from '@/components/staff/StatusBadge';
import { useMoney } from '@/lib/currency';

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings-profile'],
    queryFn: async () =>
      (await api.get('/settings/profile')).data,
  });
  const { format } = useMoney();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent sm:h-14 sm:w-14" />
          <p className="text-xs text-slate-500 sm:text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const u = data?.user;
  const w = data?.wallet;

  const hasInvestment = Number(w?.frozen || 0) > 0;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const refLink = hasInvestment && u?.referralCode
    ? `${origin}/register?ref=${encodeURIComponent(u.referralCode)}`
    : '';

  const maskPhone = (phone?: string) => {
    if (!phone) return '****';
    return phone.slice(0, 4) + '****' + phone.slice(-3);
  };

  const copy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  // Menu items with icons for better mobile UX
  const menuItems = [
    { label: 'My Investments', href: '/dashboard/investments', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Recharge History', href: '/dashboard/recharge/history', icon: History, color: 'text-blue-500' },
    { label: 'Withdrawal History', href: '/dashboard/withdraw/history', icon: Banknote, color: 'text-purple-500' },
    { label: 'Bank Accounts', href: '/dashboard/settings', icon: Wallet, color: 'text-cyan-500' },
    { label: 'VIP Program', href: '/dashboard/vip', icon: Crown, color: 'text-yellow-500' },
    { label: 'Welfare', href: '/dashboard/welfare', icon: Gift, color: 'text-pink-500' },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, color: 'text-orange-500' },
    { label: 'Activities', href: '/dashboard/activities', icon: Activity, color: 'text-indigo-500' },
    { label: 'Security Settings', href: '/dashboard/settings', icon: Lock, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:space-y-8 lg:px-8 lg:py-8">
        
        {/* Profile Hero - Responsive */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-2xl sm:p-6 lg:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-40 rounded-full bg-emerald-500/10 blur-3xl sm:h-40 sm:w-56" />
          <div className="absolute -bottom-20 -left-20 h-32 w-40 rounded-full bg-amber-500/5 blur-3xl sm:h-40 sm:w-56" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <Link href="/dashboard/vip" className="transition-transform hover:scale-105">
              <div className="relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 p-1.5 shadow-xl sm:p-2">
                    <Crown className="h-4 w-4 text-black sm:h-5 sm:w-5" />
                  </div>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-white/10 text-3xl backdrop-blur sm:h-24 sm:w-24 sm:text-4xl">
                  👤
                </div>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg sm:px-3 sm:py-1 sm:text-xs">
                  VIP {u?.vipTier ?? 0}
                </div>
              </div>
            </Link>

            <h1 className="mt-3 text-xl font-black sm:mt-4 sm:text-2xl lg:text-3xl">
              {maskPhone(u?.phoneNumber)}
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">
              Smart Investor Account
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-4 sm:gap-2">
              {u?.kycStatus ? <KycStatusBadge status={u.kycStatus} /> : null}
              {u?.accountStatus ? <AccountStatusBadge status={u.accountStatus} /> : null}
            </div>

            {u?.kycStatus === 'PENDING' && (
              <div className="mt-3 max-w-xs rounded-lg bg-amber-500/10 p-2 sm:mt-4 sm:max-w-sm sm:p-3">
                <p className="text-xs text-slate-400 sm:text-sm">
                  {/* Identity verification is pending. Withdrawals may require verified KYC. */}
                </p>
              </div>
            )}
            
            {u?.kycStatus === 'REJECTED' && (
              <div className="mt-3 max-w-xs rounded-lg bg-red-500/10 p-2 sm:mt-4 sm:max-w-sm sm:p-3">
                <p className="text-xs text-red-400 sm:text-sm">
                  KYC was not approved. Please contact support to resubmit your documents.
                </p>
              </div>
            )}

            {/* Referral Code - Responsive */}
            {hasInvestment ? (
                <div className="mt-4 w-full max-w-sm rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur sm:mt-5">
                  <div className="flex items-center justify-center gap-2">
                    <Gift className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold">Referral</span>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    {/* Code Row */}
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-3 py-2">
                      <code className="text-sm font-mono font-bold tracking-wider text-white">
                        {u?.referralCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(u?.referralCode || '', 'code')}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-emerald-600 active:scale-95"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedField === 'code' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    {/* Link Row (if refLink exists) */}
                    {refLink && (
                      <div className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-3 py-2">
                        <p className="flex-1 truncate text-xs text-slate-300 font-mono">
                          {refLink}
                        </p>
                        <button
                          type="button"
                          onClick={() => copy(refLink, 'link')}
                          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-2.5 py-1 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedField === 'link' ? 'Copied!' : 'Link'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 w-full max-w-sm rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 backdrop-blur">
                  <p className="text-xs text-amber-300 text-center">
                    💡 Make your first investment to unlock referral rewards
                  </p>
                </div>
              )}
        
          </div>
        </section>

        {/* Wallet Cards - Responsive Grid */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl sm:rounded-3xl sm:p-5 lg:p-7 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-2xl sm:p-3">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Available Balance
                </p>
                <h2 className="text-xl font-black sm:text-2xl lg:text-3xl">
                  {format(w?.available)}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl sm:rounded-3xl sm:p-5 lg:p-7 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-500 sm:rounded-2xl sm:p-3">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Frozen Balance
                </p>
                <h2 className="text-xl font-black sm:text-2xl lg:text-3xl">
                  {format(w?.frozen)}
                </h2>
              </div>
            </div>
          </div>
        </div>
       

        {/* Menu - Responsive Navigation */}
        <nav className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900/60">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 transition-all hover:bg-slate-50 active:bg-slate-100 sm:px-5 sm:py-4 lg:px-6 lg:py-5 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`rounded-lg bg-slate-100 p-1.5 sm:rounded-xl sm:p-2 dark:bg-slate-800 ${item.color}`}>
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 sm:text-base dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Account Stats Footer (Optional) */}
        {u?.createdAt && (
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-3 text-center backdrop-blur-sm sm:rounded-3xl sm:p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <p className="text-xs text-slate-500 sm:text-sm">
              Member since {new Date(u.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}