'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { toast, toastApiError } from '@/lib/toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  BanknoteIcon,
} from 'lucide-react';

type DepositMethod = {
  id: string;
  code: string;
  label: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
};

type FormState = {
  id?: string;
  code: string;
  label: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isEnabled: boolean;
  sortOrder: number;
};

const EMPTY_FORM: FormState = {
  code: '',
  label: '',
  bankName: '',
  accountName: '',
  accountNumber: '',
  isEnabled: true,
  sortOrder: 0,
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function MethodModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: FormState;
  onClose: () => void;
  onSave: (data: FormState) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = (k: keyof FormState, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.code.trim() &&
    form.label.trim() &&
    form.bankName.trim() &&
    form.accountName.trim() &&
    form.accountNumber.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {initial.id ? 'Edit Deposit Method' : 'Add Deposit Method'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Code" required>
              <input
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="e.g. GTB-A"
                className={inputCls}
              />
            </Field>
            <Field label="Label" required>
              <input
                value={form.label}
                onChange={(e) => set('label', e.target.value)}
                placeholder="e.g. GTBank Account A"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Bank Name" required>
            <input
              value={form.bankName}
              onChange={(e) => set('bankName', e.target.value)}
              placeholder="e.g. Guaranty Trust Bank"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Account Name" required>
              <input
                value={form.accountName}
                onChange={(e) => set('accountName', e.target.value)}
                placeholder="e.g. Company Ltd"
                className={inputCls}
              />
            </Field>
            <Field label="Account Number" required>
              <input
                value={form.accountNumber}
                onChange={(e) => set('accountNumber', e.target.value)}
                placeholder="e.g. 0123456789"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <div className="flex h-[42px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
                <Toggle
                  enabled={form.isEnabled}
                  onChange={() => set('isEnabled', !form.isEnabled)}
                />
                <span className={`text-sm font-medium ${form.isEnabled ? 'text-green-700 dark:text-green-400' : 'text-slate-500'}`}>
                  {form.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !isValid}
            onClick={() => onSave(form)}
            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            {saving ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-slate-900 dark:border-t-transparent" />
            ) : (
              <span className="inline-flex items-center gap-2">
                <CheckIcon className="h-4 w-4" />
                {initial.id ? 'Save Changes' : 'Add Method'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DepositMethodsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<FormState | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // FIXED: Updated API path to match backend
  const methods = useQuery({
    queryKey: ['deposit-methods'],
    queryFn: async () => (await adminApi.get<DepositMethod[]>('/staff/deposit-methods')).data,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['deposit-methods'] });

  const save = useMutation({
    mutationFn: async (data: FormState) => {
      const payload = {
        code: data.code,
        label: data.label,
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        isEnabled: data.isEnabled,
        sortOrder: data.sortOrder,
      };
      return data.id
        ? adminApi.patch(`/staff/deposit-methods/${data.id}`, payload)
        : adminApi.post('/staff/deposit-methods', payload);
    },
    onSuccess: () => { 
      invalidate(); 
      setModal(null); 
      toast.success('Deposit method saved successfully!');
    },
    onError: toastApiError,
  });

  const toggle = useMutation({
    mutationFn: async (id: string) => {
      setTogglingIds((s) => new Set(s).add(id));
      qc.setQueryData<DepositMethod[]>(['deposit-methods'], (old) =>
        old?.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)),
      );
      return adminApi.patch(`/staff/deposit-methods/${id}/toggle`);
    },
    onSettled: (_, __, id) => {
      setTogglingIds((s) => { const n = new Set(s); n.delete(id); return n; });
      invalidate();
    },
    onError: (err, id) => {
      qc.setQueryData<DepositMethod[]>(['deposit-methods'], (old) =>
        old?.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)),
      );
      toastApiError(err);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/staff/deposit-methods/${id}`),
    onSuccess: () => { 
      invalidate(); 
      toast.success('Deposit method deleted successfully!');
    },
    onError: toastApiError,
  });

  const moveOrder = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const list = sorted;
      const idx = list.findIndex((m) => m.id === id);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return;
      return adminApi.post('/staff/deposit-methods/reorder', [
        { id: list[idx].id, sortOrder: list[swapIdx].sortOrder },
        { id: list[swapIdx].id, sortOrder: list[idx].sortOrder },
      ]);
    },
    onSuccess: invalidate,
    onError: toastApiError,
  });

  const sorted = [...(methods.data ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100">
            <BanknoteIcon className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Deposit Methods</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sorted.length} method{sorted.length !== 1 ? 's' : ''} ·{' '}
              {sorted.filter((m) => m.isEnabled).length} enabled
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModal({ ...EMPTY_FORM, sortOrder: sorted.length })}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          <PlusIcon className="h-4 w-4" />
          Add Method
        </button>
      </div>

      {/* List - Responsive Card Layout for Mobile */}
      {methods.isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
          <BanknoteIcon className="h-8 w-8" />
          <p className="text-sm">No deposit methods yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-[2rem_1fr_1fr_1fr_7rem_7rem] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50">
              <span>#</span>
              <span>Label / Code</span>
              <span>Bank</span>
              <span>Account</span>
              <span className="text-center">Enabled</span>
              <span className="text-right">Actions</span>
            </div>

            {sorted.map((m, idx) => (
              <div
                key={m.id}
                className={`grid grid-cols-[2rem_1fr_1fr_1fr_7rem_7rem] items-center gap-4 px-4 py-4 text-sm transition-colors ${
                  idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-800/30'
                }`}
              >
                {/* Order controls */}
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0 || moveOrder.isPending}
                    onClick={() => moveOrder.mutate({ id: m.id, direction: 'up' })}
                    className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 dark:text-slate-600 dark:hover:text-slate-300"
                  >
                    <ChevronUpIcon className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs text-slate-400">{idx + 1}</span>
                  <button
                    type="button"
                    disabled={idx === sorted.length - 1 || moveOrder.isPending}
                    onClick={() => moveOrder.mutate({ id: m.id, direction: 'down' })}
                    className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 dark:text-slate-600 dark:hover:text-slate-300"
                  >
                    <ChevronDownIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Label + Code */}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{m.label}</p>
                  <span className="mt-0.5 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {m.code}
                  </span>
                </div>

                {/* Bank */}
                <p className="text-slate-700 dark:text-slate-300">{m.bankName}</p>

                {/* Account */}
                <div>
                  <p className="text-slate-800 dark:text-slate-200">{m.accountName}</p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{m.accountNumber}</p>
                </div>

                {/* Toggle */}
                <div className="flex flex-col items-center gap-1">
                  <Toggle
                    enabled={m.isEnabled}
                    onChange={() => toggle.mutate(m.id)}
                    disabled={togglingIds.has(m.id)}
                  />
                  <span className={`text-xs font-medium ${m.isEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                    {m.isEnabled ? 'On' : 'Off'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setModal({
                        id: m.id,
                        code: m.code,
                        label: m.label,
                        bankName: m.bankName,
                        accountName: m.accountName,
                        accountNumber: m.accountNumber,
                        isEnabled: m.isEnabled,
                        sortOrder: m.sortOrder,
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${m.label}"?`)) {
                        remove.mutate(m.id);
                      }
                    }}
                    disabled={remove.isPending}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {sorted.map((m, idx) => (
              <div
                key={m.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{m.label}</h3>
                    <span className="mt-0.5 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {m.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle
                      enabled={m.isEnabled}
                      onChange={() => toggle.mutate(m.id)}
                      disabled={togglingIds.has(m.id)}
                    />
                    <span className={`text-xs font-medium ${m.isEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                      {m.isEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Bank:</span>
                    <span className="ml-2 text-slate-900 dark:text-slate-100">{m.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Account:</span>
                    <span className="ml-2 text-slate-900 dark:text-slate-100">{m.accountName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Number:</span>
                    <span className="ml-2 font-mono text-slate-900 dark:text-slate-100">{m.accountNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Order: {m.sortOrder}</span>
                    <span>•</span>
                    <span>#{idx + 1}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0 || moveOrder.isPending}
                      onClick={() => moveOrder.mutate({ id: m.id, direction: 'up' })}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-800"
                    >
                      <ChevronUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sorted.length - 1 || moveOrder.isPending}
                      onClick={() => moveOrder.mutate({ id: m.id, direction: 'down' })}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-800"
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() =>
                      setModal({
                        id: m.id,
                        code: m.code,
                        label: m.label,
                        bankName: m.bankName,
                        accountName: m.accountName,
                        accountNumber: m.accountNumber,
                        isEnabled: m.isEnabled,
                        sortOrder: m.sortOrder,
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${m.label}"?`)) {
                        remove.mutate(m.id);
                      }
                    }}
                    disabled={remove.isPending}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <MethodModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={(data) => save.mutate(data)}
          saving={save.isPending}
        />
      )}
    </div>
  );
}