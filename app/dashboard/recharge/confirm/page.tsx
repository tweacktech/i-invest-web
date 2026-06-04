'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { toast, toastApiError } from '@/lib/toast';
import Link from 'next/link';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, CopyIcon } from 'lucide-react';

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

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const end = new Date(expiresAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  if (left <= 0)
    return (
      <span className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">Expired</span>
    );

  return (
    <span className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-300">
      {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      <CopyIcon className="h-3 w-3" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function ConfirmPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { format } = useMoney();
  const id = searchParams.get('id');

  const recharge = useQuery({
    queryKey: ['recharge', id],
    queryFn: async () => (await api.get<RechargeRow>(`/recharge/requests/${id}`)).data,
    enabled: !!id,
    // Poll every 10 seconds to pick up status changes from staff
    refetchInterval: 10_000,
  });

  const markPaid = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/recharge/requests/${id}/notify-paid`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recharges'] });
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });
      toast.success('Payment notification sent. Your balance will be updated once confirmed by staff.');
      router.push('/dashboard/recharge/history');
    },
    onError: (err) => toastApiError(err),
  });

  const data = recharge.data;

  if (!id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        No recharge ID found.{' '}
        <Link href="/dashboard/recharge" className="ml-2 text-blue-600 underline">
          Go back
        </Link>
      </div>
    );
  }

  if (recharge.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Already completed / confirmed
  if (data?.status === 'COMPLETED') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Payment Confirmed!</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {format(data.amount)} has been added to your wallet.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-xl bg-slate-800 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  // Expired
  const isExpired = data?.expiresAt ? new Date(data.expiresAt).getTime() < Date.now() : false;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      {/* Back */}
      <Link
        href="/dashboard/recharge"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to recharge
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Complete your transfer</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Send the exact amount using the details below. Include the reference in your transfer narration.
      </p>

      {/* Timer card */}
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
          <ClockIcon className="h-4 w-4" />
          Time remaining to pay
        </div>
        <div className="mt-2">
          {data?.expiresAt ? (
            <Countdown expiresAt={data.expiresAt} />
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>
        {isExpired && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            This order has expired. Please create a new recharge request.
          </p>
        )}
      </div>

      {/* Payment details */}
      <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-900">
        <DetailRow label="Amount to send">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {data ? format(data.amount) : '—'}
          </span>
        </DetailRow>

        <DetailRow label="Reference / narration">
          <div className="flex items-center">
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {data?.transferNarration ?? '—'}
            </span>
            {data?.transferNarration && <CopyButton value={data.transferNarration} />}
          </div>
        </DetailRow>

        {data?.depositMethod && (
          <>
            <DetailRow label="Bank">
              <span className="text-slate-800 dark:text-slate-200">{data.depositMethod.bankName}</span>
            </DetailRow>
            <DetailRow label="Account name">
              <span className="text-slate-800 dark:text-slate-200">{data.depositMethod.accountName}</span>
            </DetailRow>
            <DetailRow label="Account number">
              <div className="flex items-center">
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {data.depositMethod.accountNumber}
                </span>
                <CopyButton value={data.depositMethod.accountNumber} />
              </div>
            </DetailRow>
          </>
        )}
      </div>

      {/* Important note */}
      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
        ⚠️ Always include the reference exactly as shown. Transfers without the correct narration cannot be
        automatically matched to your account.
      </div>

      {/* CTA */}
      {!isExpired && (
        <button
          type="button"
          disabled={markPaid.isPending}
          onClick={() => markPaid.mutate()}
          className="mt-8 w-full rounded-xl bg-green-600 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
        >
          {markPaid.isPending ? 'Notifying…' : '✓ I have paid'}
        </button>
      )}

      {isExpired && (
        <Link
          href="/dashboard/recharge"
          className="mt-8 block w-full rounded-xl bg-slate-800 py-4 text-center text-sm font-semibold text-white hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900"
        >
          Create new recharge
        </Link>
      )}

      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        Your balance will be updated after staff confirms receipt of your payment.
      </p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm">{children}</dd>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmPageInner />
    </Suspense>
  );
}