'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { formatNgn } from '@/lib/format';

type Package = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  dailyYieldPercent: string;
  maturityDays: number;
  minAmount: string;
  maxAmount: string;
  price: string;
  firstTimeBonus: string;
  isActive: boolean;
};

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  dailyYieldPercent: '1',
  maturityDays: '90',
  minAmount: '1000',
  maxAmount: '1000000',
  price: '10000',
  firstTimeBonus: '0',
  isActive: true,
};

export default function StaffManagePackagePage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const packages = useQuery({
    queryKey: ['staff-packages'],
    queryFn: async () => (await adminApi.get<Package[]>('/staff/investment-packages')).data,
  });

  const save = useMutation({
    mutationFn: async () => {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: form.description.trim() || undefined,
        dailyYieldPercent: form.dailyYieldPercent,
        maturityDays: Number(form.maturityDays),
        minAmount: form.minAmount,
        maxAmount: form.maxAmount,
        price: form.price,
        firstTimeBonus: form.firstTimeBonus,
        isActive: form.isActive,
      };
      if (editing) {
        await adminApi.put(`/staff/investment-packages/${editing.id}`, body);
      } else {
        await adminApi.post('/staff/investment-packages', body);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-packages'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deactivate = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/staff/investment-packages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff-packages'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Package) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      dailyYieldPercent: p.dailyYieldPercent,
      maturityDays: String(p.maturityDays),
      minAmount: p.minAmount,
      maxAmount: p.maxAmount,
      price: p.price,
      firstTimeBonus: p.firstTimeBonus,
      isActive: p.isActive,
    });
    setShowForm(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Investment packages</h1>
          <p className="mt-1 text-sm text-slate-500">Products shown on the customer Products page.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Add package
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{editing ? 'Edit package' : 'New package'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
            <Field
              label="Daily yield %"
              value={form.dailyYieldPercent}
              onChange={(v) => setForm({ ...form, dailyYieldPercent: v })}
              type="number"
              step="0.01"
            />
            <Field
              label="Maturity (days)"
              value={form.maturityDays}
              onChange={(v) => setForm({ ...form, maturityDays: v })}
              type="number"
            />
            <Field label="Price (NGN)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Field label="Min amount" value={form.minAmount} onChange={(v) => setForm({ ...form, minAmount: v })} />
            <Field label="Max amount" value={form.maxAmount} onChange={(v) => setForm({ ...form, maxAmount: v })} />
            <Field label="First-time bonus" value={form.firstTimeBonus} onChange={(v) => setForm({ ...form, firstTimeBonus: v })} />
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500">Description</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active (visible to customers)
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {packages.isLoading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading…</p>
        ) : packages.data?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {packages.data.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</p>
                    {!p.isActive ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800">Inactive</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatNgn(p.price)} · {p.dailyYieldPercent}% daily · {p.maturityDays} days
                  </p>
                  <p className="text-xs text-slate-400">{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="text-sm text-amber-700 hover:underline" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  {p.isActive && (
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => {
                        if (window.confirm('Deactivate this package?')) deactivate.mutate(p.id);
                      }}
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">No packages yet.</p>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input
        type={type}
        step={step}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
