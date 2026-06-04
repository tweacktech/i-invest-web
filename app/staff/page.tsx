'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';
import { toast } from '@/lib/toast';

async function downloadCsv(path: string, filename: string) {
  const res = await adminApi.get(path, { responseType: 'blob' });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StaffDashboardPage() {
  const qc = useQueryClient();
  const settings = useQuery({
    queryKey: ['staff-platform'],
    queryFn: async () => (await adminApi.get('/staff/platform/settings')).data,
  });

  const stats = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => (await adminApi.get('/staff/stats/overview')).data,
  });

  const save = useMutation({
    mutationFn: async (body: {
      maintenanceMode: boolean;
      maintenanceMessage?: string;
      rechargeTimeoutMinutes?: number;
      welfareEnabled?: boolean;
      welfareWeeklyPrice?: string;
      welfareHolidayDates?: string[];
      welcomeMessage?: string | null;
      urgentAdminNote?: string | null;
    }) => {
      await adminApi.put('/staff/platform/settings', body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-platform'] });
      toast.success('Platform settings saved.');
    },
  });

  const s = settings.data;
  const st = stats.data;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Staff overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Platform control centre</p>
      </div>

      {st && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickStat label="Users" value={st.users.total} href="/staff/users" />
          <QuickStat label="Pending recharges" value={st.recharges.pending} href="/staff/recharges" warn />
          <QuickStat label="Pending withdrawals" value={st.withdrawals.pending} href="/staff/withdrawals" warn />
          <QuickStat label="New users today" value={st.users.newToday} href="/staff/stats" />
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/staff/stats" className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
            View statistics
          </Link>
          <Link href="/staff/users" className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Manage users
          </Link>
          <Link href="/staff/manage/package" className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Packages
          </Link>
          <Link href="/staff/manage/task" className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Daily tasks
          </Link>
          <Link href="/staff/announcements" className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Announcements
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Site & maintenance</h2>
        {s && (
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const maintenanceMode = (form.elements.namedItem('maintenanceMode') as HTMLInputElement).checked;
              const maintenanceMessage = (form.elements.namedItem('maintenanceMessage') as HTMLTextAreaElement).value;
              const rechargeTimeoutMinutes = Number(
                (form.elements.namedItem('rechargeTimeoutMinutes') as HTMLInputElement).value || 30,
              );
              const welfareEnabled = (form.elements.namedItem('welfareEnabled') as HTMLInputElement).checked;
              const welfareWeeklyPrice = (form.elements.namedItem('welfareWeeklyPrice') as HTMLInputElement).value;
              const welfareHolidayDates = (form.elements.namedItem('welfareHolidayDates') as HTMLTextAreaElement).value
                .split(/[\n,]+/)
                .map((d) => d.trim())
                .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
              const welcomeMessage = (form.elements.namedItem('welcomeMessage') as HTMLTextAreaElement).value;
              const urgentAdminNote = (form.elements.namedItem('urgentAdminNote') as HTMLTextAreaElement).value;
              save.mutate({
                maintenanceMode,
                maintenanceMessage: maintenanceMessage.trim() || undefined,
                rechargeTimeoutMinutes,
                welfareEnabled,
                welfareWeeklyPrice,
                welfareHolidayDates,
                welcomeMessage: welcomeMessage.trim() || null,
                urgentAdminNote: urgentAdminNote.trim() || null,
              });
            }}
          >
            <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
              <input type="checkbox" name="maintenanceMode" defaultChecked={s.maintenanceMode} />
              Maintenance mode
            </label>
            <div>
              <label className="text-xs font-medium text-slate-500">Public message</label>
              <textarea
                name="maintenanceMessage"
                defaultValue={s.maintenanceMessage ?? ''}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Bank transfer countdown (minutes)</label>
              <input
                type="number"
                name="rechargeTimeoutMinutes"
                min={5}
                max={180}
                defaultValue={s.rechargeTimeoutMinutes ?? 30}
                className="mt-1 w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">User dashboard banner</h3>
              <p className="mt-1 text-xs text-slate-500">
                Shown at the top of every customer dashboard page. Use urgent note for critical alerts.
              </p>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500">Welcome message</label>
                <textarea
                  name="welcomeMessage"
                  defaultValue={s.welcomeMessage ?? ''}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  rows={2}
                  placeholder="Welcome to I-Invest…"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500">Urgent admin note (optional)</label>
                <textarea
                  name="urgentAdminNote"
                  defaultValue={s.urgentAdminNote ?? ''}
                  className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm dark:border-amber-900 dark:bg-amber-950/30 dark:text-slate-100"
                  rows={3}
                  placeholder="e.g. Bank maintenance today 2–4pm…"
                />
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly welfare</h3>
              <p className="mt-1 text-xs text-slate-500">
                When enabled, investment returns pause on weekends and holidays. Users must pay welfare each Monday (UTC week) for accrual to continue.
              </p>
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                <input type="checkbox" name="welfareEnabled" defaultChecked={s.welfareEnabled ?? false} />
                Welfare active
              </label>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500">Weekly price (NGN)</label>
                <input
                  type="number"
                  name="welfareWeeklyPrice"
                  min={0}
                  step="100"
                  defaultValue={s.welfareWeeklyPrice ?? '0'}
                  className="mt-1 w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500">Holiday dates (YYYY-MM-DD, one per line)</label>
                <textarea
                  name="welfareHolidayDates"
                  defaultValue={(s.welfareHolidayDates ?? []).join('\n')}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  rows={4}
                  placeholder={'2026-12-25\n2026-01-01'}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Save settings
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">CSV exports</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700" onClick={() => downloadCsv('/staff/export/users', 'users.csv')}>
            Users
          </button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700" onClick={() => downloadCsv('/staff/export/recharges', 'recharges.csv')}>
            Recharges
          </button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700" onClick={() => downloadCsv('/staff/export/withdrawals', 'withdrawals.csv')}>
            Withdrawals
          </button>
        </div>
      </section>
    </div>
  );
}

function QuickStat({
  label,
  value,
  href,
  warn,
}: {
  label: string;
  value: number;
  href: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-900 ${
        warn && value > 0
          ? 'border-amber-300 dark:border-amber-800'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-black ${warn && value > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
        {value}
      </p>
    </Link>
  );
}
