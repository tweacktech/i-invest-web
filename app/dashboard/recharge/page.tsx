'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { toast, toastApiError } from '@/lib/toast';
import Link from 'next/link';
import { HistoryIcon } from 'lucide-react';

const PRESETS = [3000, 6000, 12000, 25000, 60000, 100_000];

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

type DepositMethod = {
  id: string;
  code: string;
  label: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

type RechargeRow = {
  id: string;
  amount: string;
  status: string;
  channel: string;
  transferNarration?: string | null;
  expiresAt?: string | null;
  depositMethod?: DepositMethod | null;
};

export default function RechargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState('3000');
  const [mode, setMode] = useState<'instant' | 'transfer'>('transfer');
  const [gateway, setGateway] = useState<'PAYSTACK' | 'BANK_TRANSFER'>('BANK_TRANSFER');
  // const [gateway, setGateway] = useState<'PAYSTACK' | 'BANK_TRANSFER'>('PAYSTACK');
  const [depositMethodId, setDepositMethodId] = useState<string>('');
  const qc = useQueryClient();
  const { format } = useMoney();

  const methods = useQuery({
    queryKey: ['deposit-methods'],
    queryFn: async () => (await api.get<DepositMethod[]>(`${apiBase}/public/deposit-methods`)).data,
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (mode === 'transfer') {
        const { data } = await api.post<RechargeRow>('/recharge', {
          amount,
          channel: 'MANUAL',
          depositMethodId,
        });
        return data;
      }
      const { data } = await api.post<RechargeRow>('/recharge', { amount, channel: gateway });
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['recharges'] });
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });

      if (mode === 'transfer' && data?.id) {
        // Redirect to confirm page for bank transfer
        router.push(`/dashboard/recharge/confirm?id=${data.id}`);
        return;
      }

      if (data?.status === 'COMPLETED') {
        toast.success(`Recharge successful! ${format(data.amount)} added to your wallet.`);
      } else {
        toast.success('Recharge request submitted.');
      }
    },
    onError: (err) => toastApiError(err),
  });

  useEffect(() => {
    const first = methods.data?.[0]?.id;
    if (first && !depositMethodId) setDepositMethodId(first);
  }, [methods.data, depositMethodId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recharge</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add funds to your wallet</p>
        </div>
        <Link
          href="/dashboard/recharge/history"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <HistoryIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Recharge History</span>
        </Link>
      </div>

      {/* Amount */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select amount</p>
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {format(amount)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESETS.map((n) => {
            const active = amount === String(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(String(n))}
                className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
                  active
                    ? 'scale-[1.02] border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950 dark:text-blue-200'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-slate-800'
                }`}
              >
                {format(n)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment type */}
      <div className="mt-8 space-y-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment type</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* <button
            type="button"
            onClick={() => setMode('instant')}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium ${
              mode === 'instant'
                ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
           Paystack
          </button> */}
          <button
            type="button"
            onClick={() => setMode('transfer')}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium ${
              mode === 'transfer'
                ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            Bank transfer (A–B)
          </button>
        </div>
      </div>

      {/* Gateway / Deposit method selector */}
      {mode === 'instant' ? (
        <div className="mt-6 max-w-xs">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Gateway</p>
          <div className="mt-2 space-y-2">
            {(
              [
                ['GATEWAY_A', 'Gateway A'],
                // ['GATEWAY_B', 'Gateway B'],
                // ['GATEWAY_D', 'Gateway D'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              >
                <input
                  type="radio"
                  name="gw"
                  checked={gateway === value}
                  onChange={() => setGateway(value)}
                />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Transfer account</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Each option is a company Approved Bank Account set by Admin. You will receive a unique narration to include in your
            transfer.
          </p>
          <div className="mt-3 space-y-2">
            {methods.data?.map((m) => (
              <label
                key={m.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              >
                <input
                  type="radio"
                  name="dep"
                  checked={depositMethodId === m.id}
                  onChange={() => setDepositMethodId(m.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {m.label} <span className="text-slate-400">({m.code})</span>
                  </p>
                  {/* <p className="text-xs text-slate-500 dark:text-slate-400">
                    {m.bankName} · {m.accountName} · {m.accountNumber}
                  </p> */}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={submit.isPending || (mode === 'transfer' && !depositMethodId)}
        onClick={() => submit.mutate()}
        className="mt-8 w-full rounded-xl bg-slate-800 py-4 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {submit.isPending ? 'Processing…' : 'Create recharge'}
      </button>

      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-semibold">Recharge instructions</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Minimum recharge is ₦3,000.</li>
          <li>For bank transfer, send the exact amount and include the narration we give you.</li>
          <li>After Admin confirms your payment, your balance will be updated.</li>
          <li>Unpaid transfer orders expire when the countdown reaches zero.</li>
        </ol>
      </div>
    </div>
  );
}