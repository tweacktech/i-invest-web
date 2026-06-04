'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { adminApi } from '@/lib/admin-api';
import { formatNgn } from '@/lib/format';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Banknote, 
  User, 
  Calendar,
  AlertCircle,
  Search,
  ChevronDown,
  X,
  Filter,
  TrendingUp,
  DollarSign,
  Building2,
  CreditCard,
  Crown
} from 'lucide-react';

type WithdrawalRow = {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  user: { id: string; phoneNumber: string; vipTier?: number };
  bankAccount: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
};

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  APPROVED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const statusIcons = {
  PENDING: Clock,
  COMPLETED: CheckCircle,
  REJECTED: XCircle,
  APPROVED: CheckCircle,
  PROCESSING: Clock,
};

export default function StaffWithdrawalsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const pending = useQuery({
    queryKey: ['staff-withdrawals-pending'],
    queryFn: async () => {
      const { data } = await adminApi.get<WithdrawalRow[]>('/staff/withdrawals/pending');
      return data;
    },
    enabled: tab === 'pending',
  });

  const all = useQuery({
    queryKey: ['staff-withdrawals-all', statusFilter],
    queryFn: async () => {
      const q = statusFilter ? `?status=${statusFilter}&take=500` : '?take=500';
      const { data } = await adminApi.get<WithdrawalRow[]>(`/staff/withdrawals${q}`);
      return data;
    },
    enabled: tab === 'all',
  });

  const review = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'reject' }) => {
      await adminApi.post(`/staff/withdrawals/${id}/${action}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-withdrawals-pending'] });
      qc.invalidateQueries({ queryKey: ['staff-withdrawals-all'] });
    },
  });

  // Filter and search data
  const filteredData = useMemo(() => {
    const data = tab === 'pending' ? pending.data : all.data;
    if (!data) return [];
    
    let filtered = [...data];
    
    // Apply search filter (phone number, bank name, account name, or ID)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.user.phoneNumber.toLowerCase().includes(query) ||
        item.bankAccount.bankName.toLowerCase().includes(query) ||
        item.bankAccount.accountName.toLowerCase().includes(query) ||
        item.bankAccount.accountNumber.includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tab, pending.data, all.data, searchQuery]);

  // Calculate total sum
  const totalSum = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  }, [filteredData]);

  // Calculate stats for different statuses
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; sum: number }> = {
      PENDING: { count: 0, sum: 0 },
      COMPLETED: { count: 0, sum: 0 },
      REJECTED: { count: 0, sum: 0 },
      APPROVED: { count: 0, sum: 0 },
      PROCESSING: { count: 0, sum: 0 },
    };
    
    filteredData.forEach(item => {
      const status = item.status;
      if (stats[status]) {
        stats[status].count++;
        stats[status].sum += parseFloat(item.amount);
      }
    });
    
    return stats;
  }, [filteredData]);

  const currentData = filteredData;
  const isLoading = tab === 'pending' ? pending.isLoading : all.isLoading;

  const handleRefresh = () => {
    if (tab === 'pending') {
      pending.refetch();
    } else {
      all.refetch();
    }
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getStatusBadge = (status: string) => {
    const StatusIcon = statusIcons[status as keyof typeof statusIcons] || AlertCircle;
    const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}>
        <StatusIcon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getVipBadge = (tier?: number) => {
    if (!tier) return null;
    const colors = {
      1: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      3: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    const level = tier as keyof typeof colors;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors[level]}`}>
        <Crown className="h-3 w-3" />
        VIP {tier}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Withdrawal Management
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">
                Approve pending payouts or review full withdrawal history
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm disabled:opacity-50 sm:w-auto sm:py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!isLoading && currentData.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90 sm:text-sm">Total Withdrawals</p>
                  <p className="text-2xl font-bold sm:text-3xl">{currentData.length}</p>
                </div>
                <TrendingUp className="h-6 w-6 opacity-80 sm:h-8 sm:w-8" />
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90 sm:text-sm">Total Amount</p>
                  <p className="text-xl font-bold sm:text-2xl">{formatNgn(totalSum.toString())}</p>
                </div>
                <DollarSign className="h-6 w-6 opacity-80 sm:h-8 sm:w-8" />
              </div>
            </div>
            {tab === 'all' && (
              <>
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Completed</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatNgn(statusStats.COMPLETED.sum.toString())}
                  </p>
                  <p className="text-xs text-slate-500">{statusStats.COMPLETED.count} withdrawals</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Pending</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {formatNgn(statusStats.PENDING.sum.toString())}
                  </p>
                  <p className="text-xs text-slate-500">{statusStats.PENDING.count} withdrawals</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tabs, Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTab('pending');
                  setSearchQuery('');
                  setStatusFilter('');
                }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                  tab === 'pending'
                    ? 'bg-white text-amber-700 shadow-sm dark:bg-slate-700 dark:text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>Pending</span>
                {pending.data && pending.data.length > 0 && tab !== 'pending' && (
                  <span className="ml-2 hidden rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 sm:inline-block">
                    {pending.data.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('all');
                  setSearchQuery('');
                }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                  tab === 'all'
                    ? 'bg-white text-amber-700 shadow-sm dark:bg-slate-700 dark:text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                All Withdrawals
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by phone, bank, account or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 sm:py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {tab === 'all' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all sm:py-2 ${
                    showFilters || statusFilter
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {tab === 'all' && showFilters && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="">All statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="PROCESSING">Processing</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setShowFilters(false);
                    }}
                    className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results Summary */}
        {searchQuery && !isLoading && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Found {currentData.length} withdrawal(s) matching "{searchQuery}"
            {currentData.length > 0 && (
              <span className="ml-2 font-semibold">
                | Total: {formatNgn(totalSum.toString())}
              </span>
            )}
          </div>
        )}

        {/* Withdrawals List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600 sm:h-12 sm:w-12"></div>
              <p className="text-sm text-slate-500">Loading withdrawals...</p>
            </div>
          ) : currentData.length ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {currentData.map((w, index) => (
                <div
                  key={w.id}
                  className="group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  {/* Mobile Layout */}
                  <div className="block p-4 sm:hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
                              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {w.user.phoneNumber}
                            </span>
                          </div>
                          {getVipBadge(w.user.vipTier)}
                        </div>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNgn(w.amount)}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{w.bankAccount.bankName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span className="font-mono">{w.bankAccount.accountNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(w.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {w.bankAccount.accountName}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {tab === 'all' ? (
                          getStatusBadge(w.status)
                        ) : (
                          tab === 'pending' && w.status === 'PENDING' && (
                            <div className="flex w-full gap-2">
                              <button
                                type="button"
                                disabled={review.isPending}
                                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                                onClick={() => review.mutate({ id: w.id, action: 'approve' })}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={review.isPending}
                                className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                onClick={() => {
                                  if (window.confirm('Reject and release reserved balance?')) {
                                    review.mutate({ id: w.id, action: 'reject' });
                                  }
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* User and Amount */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
                              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {w.user.phoneNumber}
                            </span>
                          </div>
                          {getVipBadge(w.user.vipTier)}
                          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatNgn(w.amount)}
                          </span>
                        </div>

                        {/* Bank Details */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{w.bankAccount.bankName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <CreditCard className="h-3.5 w-3.5" />
                            <span className="font-mono">{w.bankAccount.accountNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(w.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Account Name */}
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {w.bankAccount.accountName}
                        </div>

                        {/* Status Badge (for all tab) */}
                        {tab === 'all' && (
                          <div className="pt-1">
                            {getStatusBadge(w.status)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {tab === 'pending' && w.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={review.isPending}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-50"
                            onClick={() => review.mutate({ id: w.id, action: 'approve' })}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={review.isPending}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            onClick={() => {
                              if (window.confirm('Reject and release reserved balance?')) {
                                review.mutate({ id: w.id, action: 'reject' });
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center sm:py-16">
              <div className="mb-4 rounded-full bg-slate-100 p-3 sm:p-4 dark:bg-slate-800">
                <AlertCircle className="h-6 w-6 text-slate-400 sm:h-8 sm:w-8" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white sm:text-base">
                {searchQuery ? 'No matching withdrawals found' : (tab === 'pending' ? 'No pending withdrawals' : 'No withdrawals found')}
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {searchQuery 
                  ? `Try a different search term or clear your filters` 
                  : (tab === 'pending' 
                    ? 'All caught up! New withdrawal requests will appear here.' 
                    : 'Try adjusting your filters or check back later.')}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}