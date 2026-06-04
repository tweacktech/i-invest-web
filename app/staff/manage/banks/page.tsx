'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/admin-api';

type CatalogBank = {
  id: string;
  name: string;
  bankCode: string | null;
  isEnabled: boolean;
  sortOrder: number;
};

export default function StaffBanksPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [bankCode, setBankCode] = useState('');

  const banks = useQuery({
    queryKey: ['staff-catalog-banks'],
    queryFn: async () => (await adminApi.get<CatalogBank[]>('/staff/catalog-banks')).data,
  });

  const create = useMutation({
    mutationFn: async () => {
      await adminApi.post('/staff/catalog-banks', {
        name: name.trim(),
        bankCode: bankCode.trim() || undefined,
        isEnabled: true,
      });
    },
    onSuccess: () => {
      setName('');
      setBankCode('');
      qc.invalidateQueries({ queryKey: ['staff-catalog-banks'] });
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      await adminApi.put(`/staff/catalog-banks/${id}`, { isEnabled });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff-catalog-banks'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/staff/catalog-banks/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff-catalog-banks'] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Catalog banks</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Banks shown to users when linking payout accounts.
        </p>
      </div>

      <form
        className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) create.mutate();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bank name"
          className="min-w-[160px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <input
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          placeholder="Bank code (optional)"
          className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={create.isPending || !name.trim()}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Add bank
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {banks.isLoading ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">Loading…</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {banks.data?.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{b.name}</p>
                  {b.bankCode ? <p className="text-xs text-slate-500">Code: {b.bankCode}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs dark:border-slate-600"
                    onClick={() => toggle.mutate({ id: b.id, isEnabled: !b.isEnabled })}
                  >
                    {b.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1 text-xs text-red-600"
                    onClick={() => {
                      if (window.confirm(`Remove ${b.name}?`)) remove.mutate(b.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
