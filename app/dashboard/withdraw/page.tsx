'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { HistoryIcon } from 'lucide-react'; // Using lucide-react for icons
import { useMoney } from '@/lib/currency';

const PRESETS = [3000, 6000, 12000, 25000, 60000, 100000];

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [bankId, setBankId] = useState('');
  const [pin, setPin] = useState('');
  const [timeError, setTimeError] = useState('');
  const qc = useQueryClient();

  const profile = useQuery({
    queryKey: ['settings-profile'],
    queryFn: async () => (await api.get('/settings/profile')).data,
  });

  const limits = useQuery({
    queryKey: ['withdrawal-limits'],
    queryFn: async () => (await api.get('/withdrawals/limits')).data,
  });

  // Check if current time is within withdrawal hours (10 AM to 5 PM)
  const isWithinWithdrawalHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 10 && hours < 24; // 10 AM to 5 PM
  };

  const { format } = useMoney();

  useEffect(() => {
    if (!isWithinWithdrawalHours()) {
      setTimeError('Withdrawals are only allowed between 10:00 AM and 5:00 PM');
    } else {
      setTimeError('');
    }
  }, []);

  const submit = useMutation({
    mutationFn: async () => {
      // Check withdrawal hours before submitting
      if (!isWithinWithdrawalHours()) {
        throw new Error('Withdrawals are only allowed between 10:00 AM and 5:00 PM');
      }
      
      const { data } = await api.post('/withdrawals', {
        amount,
        bankAccountId: bankId,
        withdrawalPin: pin,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['withdrawals'] });
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setAmount('');
      setPin('');
      setTimeError('');
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setTimeError(error.response.data.message);
      } else if (error.message) {
        setTimeError(error.message);
      }
    },
  });

  const banks = profile.data?.bankAccounts ?? [];
  const hasPin = profile.data?.hasWithdrawalPin;
  const isWithdrawalTime = isWithinWithdrawalHours();
  const canWithdraw = limits.data?.canWithdraw !== false;
  const isSubmitDisabled =
    submit.isPending || !hasPin || !bankId || !amount || !pin || !isWithdrawalTime || !canWithdraw;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:p-10">
      {/* Header with History Icon Link */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Withdraw</h1>
        <Link
          href="/dashboard/withdraw/history"
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="View withdrawal history"
        >
          <HistoryIcon className="h-5 w-5" />
          <span className="hidden sm:inline">History</span>
        </Link>
      </div>
      
      <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
        Funds are reserved until an admin approves the payout
      </p>

      {!hasPin && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          Set a withdrawal PIN under{' '}
          <a className="font-semibold underline" href="/dashboard/settings">
            Settings
          </a>{' '}
          first.
        </div>
      )}

{limits.data && (
  limits.data.vipTier >= 1 ? (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
      <p>
        VIP {limits.data.vipTier}: withdraw up to{' '}
        <strong>{limits.data.maxWithdrawalPercent}%</strong> of available balance
         {/* (
        {format(limits.data.maxWithdrawalAmount)} max). */}
      </p>
      {limits.data.requiresActiveInvestment && !limits.data.hasActiveInvestment ? (
        <p className="mt-2 text-amber-800 dark:text-amber-300">
          You need an active investment before you can withdraw.
        </p>
      ) : null}
    </div>
  ) : (
    <></>
    // <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
    //   <p>
    //     {/* 💡 Upgrade to VIP 1 or higher to unlock withdrawal benefits and higher limits. */}
    //   </p>
    // </div>
  )
)}

      {timeError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
          {timeError}
        </div>
      )}

      {/* Withdrawal Hours Info */}
      {/* <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
        <p className="font-semibold">⏰ Withdrawal Hours: 10:00 AM - 5:00 PM</p>
        <p className="mt-1">Withdrawals are only processed during business hours.</p>
      </div> */}

      {/* Amount Selection Section - Only presets, no custom input */}
      <div className="mt-8">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select amount</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAmount(String(n))}
              className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                amount === String(n)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-600'
              }`}
            >
              {format(n)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Selected amount: {amount ? format(amount) : 'None'}
        </p>
      </div>

      {/* Bank Account Selection - Dropdown */}
      <div className="mt-8">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank account</label>
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={bankId}
          onChange={(e) => setBankId(e.target.value)}
        >
          <option value="">Select account</option>
          {banks.map((b: { id: string; bankName: string; accountNumber: string; accountName: string }) => (
            <option key={b.id} value={b.id}>
              {b.bankName} - {b.accountName} - {b.accountNumber}
            </option>
          ))}
        </select>
        {banks.length === 0 && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            No bank accounts added. Add one in Settings.
          </p>
        )}
      </div>

      {/* Withdrawal PIN */}
      <div className="mt-6">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Withdrawal PIN</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
          maxLength={4}
          pattern="[0-9]{4}"
        />
      </div>

      <button
        type="button"
        disabled={isSubmitDisabled}
        onClick={() => submit.mutate()}
        className="mt-8 w-full rounded-xl bg-slate-800 py-4 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {submit.isPending ? 'Processing…' : 'Submit withdrawal'}
      </button>

      {/* Withdrawal Instructions */}
      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-semibold">Withdrawal instructions</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Withdrawals are only allowed between 10:00 AM and 5:00 PM.</li>
          <li>Minimum withdrawal is ₦3,000.</li>
          <li>Funds are reserved instantly and reviewed by an admin.</li>
          <li>Processing typically takes 24-48 hours.</li>
          <li>You'll receive a notification when your withdrawal is approved or rejected.</li>
        </ol>
      </div>
    </div>
  );
}