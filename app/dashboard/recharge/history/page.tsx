'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

type RechargeRow = {
  id: string;
  amount: string;
  status: string;
  channel: string;
  transferNarration?: string | null;
  createdAt?: string;
};

export default function RechargeHistoryPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [search, setSearch] = useState('');
const { format } = useMoney();
  const history = useQuery({
    queryKey: ['recharges'],
    queryFn: async () =>
      (await api.get<RechargeRow[]>('/recharge/requests')).data,
  });

  const filteredData = useMemo(() => {
    return (
      history.data?.filter((r) => {
        const matchesStatus =
          statusFilter === 'ALL' || r.status === statusFilter;

        const matchesChannel =
          channelFilter === 'ALL' || r.channel === channelFilter;

        const matchesSearch =
          !search ||
          r.transferNarration
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          r.amount.toString().includes(search);

        return matchesStatus && matchesChannel && matchesSearch;
      }) ?? []
    );
  }, [history.data, statusFilter, channelFilter, search]);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Recharge History
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View and filter all recharge transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Search
          </label>

          <input
            type="text"
            placeholder="Search amount or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Channel
          </label>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="ALL">All Channels</option>
            <option value="MANUAL">Manual</option>
            <option value="GATEWAY_A">Gateway A</option>
            <option value="GATEWAY_B">Gateway B</option>
            <option value="GATEWAY_D">Gateway D</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Channel
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Reference
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Loading recharge history...
                  </td>
                </tr>
              ) : filteredData.length ? (
                filteredData.map((r) => (
                  <tr
                    key={r.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    {/* Amount */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {format(r.amount)}
                    </td>

                    {/* Channel */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {r.channel}
                    </td>

                    {/* Reference */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {r.transferNarration ? (
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
                          {r.transferNarration}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : r.status === 'EXPIRED'
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
                            : r.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : r.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No recharge history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}