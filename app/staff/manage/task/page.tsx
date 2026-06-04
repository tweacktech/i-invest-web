'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { formatNgn } from '@/lib/format';

type DailyTask = {
  id: string;
  title: string;
  youtubeUrl: string;
  watchSeconds: number;
  rewardAmount: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = {
  title: '',
  youtubeUrl: '',
  watchSeconds: '60',
  rewardAmount: '100',
  sortOrder: '0',
  isActive: true,
};

export default function StaffManageTaskPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<DailyTask | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const tasks = useQuery({
    queryKey: ['staff-tasks'],
    queryFn: async () => (await adminApi.get<DailyTask[]>('/staff/daily-tasks')).data,
  });

  const save = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.title.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
        watchSeconds: Number(form.watchSeconds),
        rewardAmount: form.rewardAmount,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };
      if (editing) {
        await adminApi.put(`/staff/daily-tasks/${editing.id}`, body);
      } else {
        await adminApi.post('/staff/daily-tasks', body);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-tasks'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (t: DailyTask) => {
    setEditing(t);
    setForm({
      title: t.title,
      youtubeUrl: t.youtubeUrl,
      watchSeconds: String(t.watchSeconds),
      rewardAmount: t.rewardAmount,
      sortOrder: String(t.sortOrder),
      isActive: t.isActive,
    });
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Daily tasks</h1>
          <p className="mt-1 text-sm text-slate-500">YouTube watch tasks on the customer Activities page.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Add task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            save.mutate();
          }}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{editing ? 'Edit task' : 'New task'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500">Title</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500">YouTube URL</label>
              <input
                required
                type="url"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Watch seconds</label>
              <input
                type="number"
                min={10}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.watchSeconds}
                onChange={(e) => setForm({ ...form, watchSeconds: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Reward (NGN)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.rewardAmount}
                onChange={(e) => setForm({ ...form, rewardAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Sort order</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
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
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {tasks.isLoading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading…</p>
        ) : tasks.data?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.data.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                    {!t.isActive ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">Inactive</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500">
                    {t.watchSeconds}s watch · {formatNgn(t.rewardAmount)} reward
                  </p>
                  <p className="max-w-md truncate text-xs text-slate-400">{t.youtubeUrl}</p>
                </div>
                <button type="button" className="text-sm text-amber-700 hover:underline" onClick={() => openEdit(t)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">No tasks yet.</p>
        )}
      </section>
    </div>
  );
}
