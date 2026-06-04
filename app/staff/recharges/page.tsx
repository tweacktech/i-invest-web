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
  MoreVertical,
  Edit
} from 'lucide-react';

type PendingRecharge = {
  id: string;
  amount: string;
  channel: string;
  status: string;
  transferNarration: string | null;
  createdAt: string;
  user: { id: string; phoneNumber: string };
  depositMethod: { code: string; label: string } | null;
};

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  EXPIRED: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const statusIcons = {
  PENDING: Clock,
  COMPLETED: CheckCircle,
  REJECTED: XCircle,
  EXPIRED: AlertCircle,
};

const availableStatuses = ['PENDING', 'COMPLETED', 'REJECTED', 'EXPIRED'];

export default function StaffRechargesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ id: string; status: string } | null>(null);

  const pending = useQuery({
    queryKey: ['staff-recharges-pending'],
    queryFn: async () => {
      const { data } = await adminApi.get<PendingRecharge[]>('/staff/recharges/pending');
      return data;
    },
    enabled: tab === 'pending',
  });

  const all = useQuery({
    queryKey: ['staff-recharges-all', statusFilter],
    queryFn: async () => {
      const q = statusFilter ? `?status=${statusFilter}&take=500` : '?take=500';
      const { data } = await adminApi.get<PendingRecharge[]>(`/staff/recharges${q}`);
      return data;
    },
    enabled: tab === 'all',
  });

  // Update to use approve/reject endpoints based on action
  const updateStatus = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      if (action === 'COMPLETED') {
        // Use approve endpoint for completed
        await adminApi.post(`/staff/recharges/${id}/approve`);
      } else if (action === 'REJECTED') {
        // Use reject endpoint for rejected
        await adminApi.post(`/staff/recharges/${id}/reject`);
      } else if (action === 'PENDING') {
        // If you have an endpoint to revert to pending, use it
        // Otherwise, you might need to create a general update endpoint
        await adminApi.post(`/staff/recharges/${id}/pending`);
      } else if (action === 'EXPIRED') {
        // If you have an endpoint for expired
        await adminApi.post(`/staff/recharges/${id}/expire`);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-recharges-pending'] });
      qc.invalidateQueries({ queryKey: ['staff-recharges-all'] });
      setSelectedAction(null);
    },
    onError: (error) => {
      console.error('Status update failed:', error);
      alert('Failed to update status. Please try again.');
      setSelectedAction(null);
    },
  });

  // Filter and search data
  const filteredData = useMemo(() => {
    const data = tab === 'pending' ? pending.data : all.data;
    if (!data) return [];
    
    let filtered = [...data];
    
    // Apply search filter (phone number or narration)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.user.phoneNumber.toLowerCase().includes(query) ||
        item.transferNarration?.toLowerCase().includes(query) ||
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
    const stats = {
      PENDING: { count: 0, sum: 0 },
      COMPLETED: { count: 0, sum: 0 },
      REJECTED: { count: 0, sum: 0 },
      EXPIRED: { count: 0, sum: 0 },
    };
    
    filteredData.forEach(item => {
      const status = item.status as keyof typeof stats;
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

  const handleStatusChange = async (id: string, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) {
      return;
    }
    
    const confirmMessage = `Change status from ${currentStatus} to ${newStatus}?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setSelectedAction({ id, status: newStatus });
    await updateStatus.mutateAsync({ id, action: newStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Recharge Management
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">
                Manage and update recharge statuses
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
                  <p className="text-xs opacity-90 sm:text-sm">Total Transactions</p>
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
                  <p className="text-xs text-slate-500">{statusStats.COMPLETED.count} transactions</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Pending</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {formatNgn(statusStats.PENDING.sum.toString())}
                  </p>
                  <p className="text-xs text-slate-500">{statusStats.PENDING.count} transactions</p>
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
                All Transactions
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by phone, narration or ID..."
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
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
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
            Found {currentData.length} transaction(s) matching "{searchQuery}"
            {currentData.length > 0 && (
              <span className="ml-2 font-semibold">
                | Total: {formatNgn(totalSum.toString())}
              </span>
            )}
          </div>
        )}

        {/* Transactions List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600 sm:h-12 sm:w-12"></div>
              <p className="text-sm text-slate-500">Loading transactions...</p>
            </div>
          ) : currentData.length ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {currentData.map((r, index) => (
                <div
                  key={r.id}
                  className="group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  {/* Mobile Layout */}
                  <div className="block p-4 sm:hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
                            <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {r.user.phoneNumber}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNgn(r.amount)}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Banknote className="h-3.5 w-3.5" />
                          <span className="capitalize">{r.channel.toLowerCase()}</span>
                          {r.depositMethod && (
                            <span className="text-slate-500">
                              · {r.depositMethod.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {r.transferNarration && (
                        <div className="rounded-lg bg-slate-50 p-2 text-xs font-mono text-slate-600 break-all dark:bg-slate-800 dark:text-slate-300">
                          <span className="font-semibold">Narration:</span> {r.transferNarration}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        {getStatusBadge(r.status)}
                      </div>

                      {/* Status Update Buttons - Mobile */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          disabled={updateStatus.isPending && selectedAction?.id === r.id}
                          onClick={() => handleStatusChange(r.id, r.status, 'COMPLETED')}
                          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                            r.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={updateStatus.isPending && selectedAction?.id === r.id}
                          onClick={() => handleStatusChange(r.id, r.status, 'REJECTED')}
                          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                            r.status === 'REJECTED'
                              ? 'bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
                              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {r.user.phoneNumber}
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatNgn(r.amount)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Banknote className="h-3.5 w-3.5" />
                            <span className="capitalize">{r.channel.toLowerCase()}</span>
                          </div>
                          {r.depositMethod && (
                            <span className="text-slate-500">
                              {r.depositMethod.label} ({r.depositMethod.code})
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(r.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {r.transferNarration && (
                          <div className="rounded-lg bg-slate-50 p-2 text-xs font-mono text-slate-600 break-all dark:bg-slate-800 dark:text-slate-300">
                            Narration: {r.transferNarration}
                          </div>
                        )}

                        <div className="pt-1">
                          {getStatusBadge(r.status)}
                        </div>
                      </div>

                      {/* Status Update Buttons - Desktop */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={updateStatus.isPending && selectedAction?.id === r.id}
                          onClick={() => handleStatusChange(r.id, r.status, 'COMPLETED')}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                            r.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={updateStatus.isPending && selectedAction?.id === r.id}
                          onClick={() => handleStatusChange(r.id, r.status, 'REJECTED')}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                            r.status === 'REJECTED'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
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
                {searchQuery ? 'No matching transactions found' : (tab === 'pending' ? 'No pending recharges' : 'No recharges found')}
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {searchQuery 
                  ? `Try a different search term or clear your filters` 
                  : (tab === 'pending' 
                    ? 'All caught up! New recharges will appear here.' 
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