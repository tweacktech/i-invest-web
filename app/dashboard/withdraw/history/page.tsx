'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

export default function WithdrawalHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Withdrawal History</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View all your withdrawal requests and their status
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-yellow-600 text-white dark:bg-yellow-500'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:hover:bg-yellow-950/50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('PROCESSING')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === 'PROCESSING'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === 'APPROVED'
                ? 'bg-green-600 text-white dark:bg-green-500'
                : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === 'REJECTED'
                ? 'bg-red-600 text-white dark:bg-red-500'
                : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
            }`}
          >
            Rejected
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('7d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              dateRange === '7d'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              dateRange === '30d'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              dateRange === '90d'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Last 90 days
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              dateRange === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All time
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {withdrawals && withdrawals.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Withdrawn</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {format(
                withdrawals
                  .filter((w: any) => w.status === 'APPROVED')
                  .reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0)
              )}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Withdrawals</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {format(
                withdrawals
                  .filter((w: any) => w.status === 'PENDING')
                  .reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0)
              )}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{withdrawals.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
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

      {/* History Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bank Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Date Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Approved Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {withdrawals && withdrawals.length > 0 ? (
                withdrawals.map((withdrawal: any) => (
                  <tr key={withdrawal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {format(withdrawal.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>
                        <p className="font-medium">{withdrawal.bankAccount?.bankName}</p>
                        <p className="text-xs">
                          {withdrawal.bankAccount?.accountName} · {withdrawal.bankAccount?.accountNumber}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          withdrawal.status
                        )}`}
                      >
                        {getStatusText(withdrawal.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(withdrawal.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {withdrawal.approvedAt ? formatDate(withdrawal.approvedAt) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-12 w-12 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>No withdrawal requests found</p>
                      <a
                        href="/dashboard/withdraw"
                        className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                      >
                        Make a withdrawal
                      </a>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      {withdrawals && withdrawals.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              // Implement CSV export functionality
              const csv = convertToCSV(withdrawals);
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `withdrawals_${new Date().toISOString()}.csv`;
              a.click();
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
}

function convertToCSV(withdrawals: any[]) {
  const headers = ['ID', 'Amount', 'Status', 'Bank Name', 'Account Name', 'Account Number', 'Created At', 'Approved At'];
  const rows = withdrawals.map(w => [
    w.id,
    w.amount,
    w.status,
    w.bankAccount?.bankName || '',
    w.bankAccount?.accountName || '',
    w.bankAccount?.accountNumber || '',
    new Date(w.createdAt).toLocaleString(),
    w.approvedAt ? new Date(w.approvedAt).toLocaleString() : ''
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csvContent;
}