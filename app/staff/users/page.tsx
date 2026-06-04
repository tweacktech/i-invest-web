'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { AccountStatusBadge, KycStatusBadge } from '@/components/staff/StatusBadge';
import { formatNgn } from '@/lib/format';

type StaffUserRow = {
  id: string;
  phoneNumber: string;
  referralCode: string;
  vipTier: number;
  kycStatus: string;
  accountStatus: string;
  createdAt: string;
  wallet: { available: string; frozen: string; reserved: string } | null;
  _count: { investments: number; rechargeRequests: number; withdrawals: number };
};

export default function StaffUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [kyc, setKyc] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPin, setEditPin] = useState('');
  const [editVip, setEditVip] = useState('0');

  const queryKey = useMemo(() => ['staff-users', search, status, kyc], [search, status, kyc]);

  const users = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (status) params.set('status', status);
      if (kyc) params.set('kyc', kyc);
      const q = params.toString();
      const { data } = await adminApi.get<StaffUserRow[]>(`/staff/users${q ? `?${q}` : ''}`);
      return data;
    },
  });

  const detail = useQuery({
    queryKey: ['staff-user', selectedId],
    queryFn: async () => (await adminApi.get(`/staff/users/${selectedId}`)).data,
    enabled: Boolean(selectedId),
  });

  const action = useMutation({
    mutationFn: async ({ id, path }: { id: string; path: string }) => {
      await adminApi.post(`/staff/users/${id}/${path}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-users'] });
      if (selectedId) qc.invalidateQueries({ queryKey: ['staff-user', selectedId] });
    },
  });

  const saveProfile = useMutation({
    mutationFn: async (id: string) => {
      const body: Record<string, string | number> = {};
      if (editName.trim()) body.displayName = editName.trim();
      if (editPhone.trim()) body.phoneNumber = editPhone.trim();
      if (editPassword) body.password = editPassword;
      if (editPin) body.withdrawalPin = editPin;
      body.vipTier = Number(editVip);
      await adminApi.put(`/staff/users/${id}`, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-users'] });
      if (selectedId) qc.invalidateQueries({ queryKey: ['staff-user', selectedId] });
      setEditPassword('');
      setEditPin('');
    },
  });

  const selected = users.data?.find((u) => u.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Search, filter, verify KYC, and manage account status.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Phone, referral code, or user ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
        <select
          value={kyc}
          onChange={(e) => setKyc(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All KYC</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">KYC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Loading…
                    </td>
                  </tr>
                ) : users.data?.length ? (
                  users.data.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-t border-slate-100 dark:border-slate-800 ${
                        selectedId === u.id ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{u.phoneNumber}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {formatNgn(u.wallet?.available ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <KycStatusBadge status={u.kycStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <AccountStatusBadge status={u.accountStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="text-amber-700 hover:underline dark:text-amber-400"
                          onClick={() => {
                            setSelectedId(u.id);
                            setEditPhone(u.phoneNumber);
                            setEditVip(String(u.vipTier));
                            setEditName('');
                            setEditPassword('');
                            setEditPin('');
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No users match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          {!selectedId || !selected ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a user to view details and actions.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">{selected.phoneNumber}</h2>
                <p className="mt-1 text-xs text-slate-500">Ref: {selected.referralCode} · VIP {selected.vipTier}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <KycStatusBadge status={selected.kycStatus} />
                  <AccountStatusBadge status={selected.accountStatus} />
                </div>
              </div>

              {detail.data && (
                <dl className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <dt>Available</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">
                      {formatNgn(detail.data.wallet?.available ?? 0)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Investments</dt>
                    <dd>{detail.data._count?.investments ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Referrals</dt>
                    <dd>{detail.data._count?.referrals ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                  <dt>Registered</dt>
                  <dd>{detail.data.createdAt ? new Date(detail.data.createdAt).toLocaleDateString() : 'N/A'}</dd>
                </div>
                </dl>
              )}

              <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-xs font-medium uppercase text-slate-500">Edit profile</p>
                <input
                  placeholder="Display name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <input
                  placeholder="Phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <input
                  type="password"
                  placeholder="New login password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <input
                  type="password"
                  placeholder="New withdrawal PIN"
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <select
                  value={editVip}
                  onChange={(e) => setEditVip(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {Array.from({ length: 9 }, (_, i) => (
                    <option key={i} value={i}>
                      VIP {i}
                    </option>
                  ))}
                </select>
                {detail.data?.hasWithdrawalPin === false ? (
                  <p className="text-xs text-amber-700 dark:text-amber-400">No withdrawal PIN set</p>
                ) : null}
                <button
                  type="button"
                  disabled={saveProfile.isPending}
                  onClick={() => saveProfile.mutate(selected.id)}
                  className="w-full rounded-lg bg-amber-700 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Save changes
                </button>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-xs font-medium uppercase text-slate-500">KYC</p>
                <div className="flex flex-wrap gap-2">
                  <ActionBtn
                    label="Verify KYC"
                    disabled={action.isPending || selected.kycStatus === 'VERIFIED'}
                    onClick={() => action.mutate({ id: selected.id, path: 'verify-kyc' })}
                  />
                  <ActionBtn
                    label="Reject KYC"
                    variant="muted"
                    disabled={action.isPending || selected.kycStatus === 'REJECTED'}
                    onClick={() => action.mutate({ id: selected.id, path: 'reject-kyc' })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-slate-500">Account</p>
                <div className="flex flex-wrap gap-2">
                  {selected.accountStatus !== 'ACTIVE' && (
                    <ActionBtn
                      label="Activate"
                      disabled={action.isPending}
                      onClick={() => action.mutate({ id: selected.id, path: 'activate' })}
                    />
                  )}
                  {selected.accountStatus !== 'SUSPENDED' && (
                    <ActionBtn
                      label="Suspend"
                      variant="warn"
                      disabled={action.isPending}
                      onClick={() => {
                        if (window.confirm('Suspend this user? They will not be able to log in.')) {
                          action.mutate({ id: selected.id, path: 'suspend' });
                        }
                      }}
                    />
                  )}
                  {selected.accountStatus !== 'BANNED' && (
                    <ActionBtn
                      label="Ban"
                      variant="danger"
                      disabled={action.isPending}
                      onClick={() => {
                        if (window.confirm('Ban this user permanently?')) {
                          action.mutate({ id: selected.id, path: 'ban' });
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {action.isError && (
                <p className="text-xs text-red-600 dark:text-red-400">Action failed. Try again.</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'muted' | 'warn' | 'danger';
}) {
  const styles = {
    primary: 'bg-amber-700 text-white hover:bg-amber-800',
    muted: 'border border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-300',
    warn: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
