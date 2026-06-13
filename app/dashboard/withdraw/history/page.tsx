'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

export default function WithdrawalHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const { format } = useMoney();
  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ['withdrawals', statusFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (dateRange !== 'all') params.append('days', dateRange);
      
      const { data } = await api.get(`/withdrawals?${params.toString()}`);
      return data;
    },
  });

  // Filter withdrawals based on search and status
  const filteredData = useMemo(() => {
    if (!withdrawals) return [];
    
    return withdrawals.filter((withdrawal: any) => {
      const matchesStatus = statusFilter === 'ALL' || withdrawal.status === statusFilter;
      
      const matchesSearch = !search || 
        withdrawal.amount.toString().includes(search) ||
        withdrawal.bankAccount?.bankName?.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.bankAccount?.accountName?.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.bankAccount?.accountNumber?.includes(search);
      
      return matchesStatus && matchesSearch;
    });
  }, [withdrawals, statusFilter, search]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-300"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading withdrawal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Withdrawal History
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View all your withdrawal requests and their status
        </p>
      </div>

      {/* Filters - Matches Recharge style */}
      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Search
          </label>
          <input
            type="text"
            placeholder="Search amount, bank or account..."
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
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards - Optional, can remove if not needed */}
      {withdrawals && withdrawals.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Withdrawn</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {format(
                withdrawals
                  .filter((w: any) => w.status === 'APPROVED')
                  .reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0)
              )}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {format(
                withdrawals
                  .filter((w: any) => w.status === 'PENDING')
                  .reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0)
              )}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{withdrawals.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(
                (withdrawals.filter((w: any) => w.status === 'APPROVED').length / withdrawals.length) * 100
              )}
              %
            </p>
          </div>
        </div>
      )}

      {/* Table - Matching Recharge style */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bank Account
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date Requested
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Approved Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.length > 0 ? (
                filteredData.map((withdrawal: any) => (
                  <tr
                    key={withdrawal.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    {/* Amount */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {format(withdrawal.amount)}
                    </td>

                    {/* Bank Account */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {withdrawal.bankAccount ? (
                        <div>
                          <p className="font-medium">{withdrawal.bankAccount.bankName}</p>
                          <p className="text-xs text-slate-500">
                            {withdrawal.bankAccount.accountName} · {withdrawal.bankAccount.accountNumber}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          withdrawal.status
                        )}`}
                      >
                        {getStatusText(withdrawal.status)}
                      </span>
                    </td>

                    {/* Date Requested */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(withdrawal.createdAt)}
                    </td>

                    {/* Approved Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(withdrawal.approvedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No withdrawal history found.
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