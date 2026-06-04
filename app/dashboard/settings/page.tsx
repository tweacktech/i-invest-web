'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api-client';


export default function SettingsPage() {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ['settings-profile'],
    queryFn: async () => (await api.get('/settings/profile')).data,
  });

  const banks = useQuery({
    queryKey: ['catalog-banks'],
    queryFn: async () => (await api.get<{ id: string; name: string }[]>('/public/catalog-banks')).data,
  });

  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');

  const saveBank = useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/settings/bank', {
        accountName,
        bankName,
        accountNumber,
        isDefault: true,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setAccountName('');
      setBankName('');
      setAccountNumber('');
    },
  });

  const savePin = useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/settings/withdrawal-pin', { pin });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setPin('');
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Bank details & withdrawal security</p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Bank account</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Used for withdrawals after admin approval</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Account name</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="As shown on your bank account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Bank</label>
            {banks.data?.length ? (
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
                <option value="">Select bank…</option>
                {banks.data.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500"
                placeholder="Bank name (catalog loading…)"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Account number</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500"
              placeholder="10-digit NUBAN"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={saveBank.isPending}
            onClick={() => saveBank.mutate()}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500"
          >
            Save bank details
          </button>
        </div>
        {profile.data?.bankAccounts?.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            {profile.data.bankAccounts.map(
              (b: { id: string; bankName: string; accountNumber: string; accountName: string }) => (
                <li key={b.id} className="text-slate-600 dark:text-slate-400">
                  {b.bankName} — {b.accountName} ({b.accountNumber})
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Withdrawal PIN</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">4–12 digits · required to submit withdrawals</p>
        
        {profile.data?.hasWithdrawalPin ? (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">PIN is set and secured</p>
            <p className="mt-1 text-xs text-green-700 dark:text-green-400">Your withdrawal PIN is active. Contact support if you need to change it.</p>
          </div>
        ) : (
          <>
            <input
              type="password"
              className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Enter a secure PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              type="button"
              disabled={savePin.isPending || pin.length < 4}
              onClick={() => savePin.mutate()}
              className="mt-3 w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Update PIN
            </button>
          </>
        )}
      </section>
    </div>
  );
}