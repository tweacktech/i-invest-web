'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { toast } from '@/lib/toast';

type Announcement = {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyForm = { title: '', body: '', isActive: true };

export default function StaffAnnouncementsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const list = useQuery({
    queryKey: ['staff-announcements'],
    queryFn: async () => (await adminApi.get<Announcement[]>('/staff/announcements')).data,
  });

  const save = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.title.trim(),
        body: form.body.trim(),
        ...(editing ? { isActive: form.isActive } : {}),
      };
      if (editing) {
        await adminApi.put(`/staff/announcements/${editing.id}`, body);
      } else {
        await adminApi.post('/staff/announcements', body);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-announcements'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      toast.success('Announcement saved');
    },
    onError: () => toast.error('Could not save announcement'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/staff/announcements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-announcements'] });
      toast.success('Announcement deleted');
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.put(`/staff/announcements/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff-announcements'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, body: a.body, isActive: a.isActive });
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Published items appear in the customer app under Notifications. Inactive items are hidden.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          New announcement
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
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            {editing ? 'Edit announcement' : 'Create announcement'}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Title</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Message</label>
              <textarea
                required
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            {editing && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active (visible to users)
              </label>
            )}
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
        {list.isLoading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading…</p>
        ) : list.data?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.data.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          a.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {a.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">{a.body}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      className="text-sm text-amber-700 hover:underline dark:text-amber-400"
                      onClick={() => openEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm text-slate-600 hover:underline dark:text-slate-400"
                      onClick={() => toggleActive.mutate({ id: a.id, isActive: !a.isActive })}
                    >
                      {a.isActive ? 'Hide' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => {
                        if (window.confirm('Delete this announcement permanently?')) remove.mutate(a.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">No announcements yet.</p>
        )}
      </section>
    </div>
  );
}
