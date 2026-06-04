'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { toastApiError, toast } from '@/lib/toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  MarsStrokeIcon,
  Building,
} from 'lucide-react';

type CatalogBank = {
  id: string;
  name: string;
  bankCode: string | null;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
};

type FormState = {
  name: string;
  bankCode: string;
  isEnabled: boolean;
  sortOrder: number;
};

const EMPTY_FORM: FormState = { name: '', bankCode: '', isEnabled: true, sortOrder: 0 };

// ── Modal ─────────────────────────────────────────────────────────────────────
function BankModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: FormState & { id?: string };
  onClose: () => void;
  onSave: (data: FormState & { id?: string }) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>({
    name: initial.name,
    bankCode: initial.bankCode,
    isEnabled: initial.isEnabled,
    sortOrder: initial.sortOrder,
  });

  const set = (k: keyof FormState, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {initial.id ? 'Edit Bank' : 'Add Bank'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <MarsStrokeIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. First Bank of Nigeria"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Bank Code
            </label>
            <input
              value={form.bankCode}
              onChange={(e) => set('bankCode', e.target.value)}
              placeholder="e.g. 011"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Sort Order
            </label>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div
              onClick={() => set('isEnabled', !form.isEnabled)}
              className={`relative h-5 w-9 rounded-full transition-colors ${form.isEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </div>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {form.isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !form.name.trim()}
            onClick={() => onSave({ ...form, id: initial.id })}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-slate-900 dark:border-t-transparent" />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
            {initial.id ? 'Save Changes' : 'Add Bank'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CatalogBanksPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<(FormState & { id?: string }) | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const banks = useQuery({
    queryKey: ['catalog-banks'],
    queryFn: async () => (await api.get<CatalogBank[]>('/catalog-banks')).data,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['catalog-banks'] });

  const save = useMutation({
    mutationFn: async (data: FormState & { id?: string }) => {
      const payload = {
        name: data.name,
        bankCode: data.bankCode || null,
        isEnabled: data.isEnabled,
        sortOrder: data.sortOrder,
      };
      if (data.id) {
        return api.patch(`/catalog-banks/${data.id}`, payload);
      }
      return api.post('/catalog-banks', payload);
    },
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast.success('Bank saved.');
    },
    onError: toastApiError,
  });

  const toggle = useMutation({
    mutationFn: (id: string) => api.patch(`/catalog-banks/${id}/toggle`),
    onSuccess: invalidate,
    onError: toastApiError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/catalog-banks/${id}`),
    onSuccess: () => {
      invalidate();
      setDeletingId(null);
      toast.success('Bank removed.');
    },
    onError: toastApiError,
  });

  const moveOrder = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const list = banks.data ?? [];
      const idx = list.findIndex((b) => b.id === id);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return;

      const items = [
        { id: list[idx].id, sortOrder: list[swapIdx].sortOrder },
        { id: list[swapIdx].id, sortOrder: list[idx].sortOrder },
      ];
      return api.post('/catalog-banks/reorder', items);
    },
    onSuccess: invalidate,
    onError: toastApiError,
  });

  const sorted = [...(banks.data ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100">
            <BuildingLibraryIcon className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Bank Catalog</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sorted.length} bank{sorted.length !== 1 ? 's' : ''} ·{' '}
              {sorted.filter((b) => b.isEnabled).length} enabled
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModal({ ...EMPTY_FORM, sortOrder: sorted.length })}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <PlusIcon className="h-4 w-4" />
          Add Bank
        </button>
      </div>

      {/* Table */}
      {banks.isLoading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
          <Building className="h-8 w-8" />
          <p className="text-sm">No banks yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_6rem_6rem_7rem] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
            <span>#</span>
            <span>Bank</span>
            <span className="text-center">Code</span>
            <span className="text-center">Status</span>
            <span className="text-right">Actions</span>
          </div>

          {sorted.map((bank, idx) => (
            <div
              key={bank.id}
              className={`grid grid-cols-[2rem_1fr_6rem_6rem_7rem] items-center gap-4 px-4 py-3.5 text-sm transition-colors ${
                idx % 2 === 0
                  ? 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50/60 dark:bg-slate-800/30'
              } ${deletingId === bank.id ? 'opacity-40' : ''}`}
            >
              {/* Sort order */}
              <div className="flex flex-col items-center gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0 || moveOrder.isPending}
                  onClick={() => moveOrder.mutate({ id: bank.id, direction: 'up' })}
                  className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 dark:text-slate-600 dark:hover:text-slate-300"
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-slate-400">{idx + 1}</span>
                <button
                  type="button"
                  disabled={idx === sorted.length - 1 || moveOrder.isPending}
                  onClick={() => moveOrder.mutate({ id: bank.id, direction: 'down' })}
                  className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 dark:text-slate-600 dark:hover:text-slate-300"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Name */}
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{bank.name}</p>
              </div>

              {/* Code */}
              <div className="text-center">
                {bank.bankCode ? (
                  <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {bank.bankCode}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                )}
              </div>

              {/* Status toggle */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => toggle.mutate(bank.id)}
                  disabled={toggle.isPending}
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    bank.isEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      bank.isEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      id: bank.id,
                      name: bank.name,
                      bankCode: bank.bankCode ?? '',
                      isEnabled: bank.isEnabled,
                      sortOrder: bank.sortOrder,
                    })
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(bank.id);
                    if (confirm(`Delete "${bank.name}"? This cannot be undone.`)) {
                      remove.mutate(bank.id);
                    } else {
                      setDeletingId(null);
                    }
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <BankModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={(data) => save.mutate(data)}
          saving={save.isPending}
        />
      )}
    </div>
  );
}
