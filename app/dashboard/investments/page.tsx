'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';
import { WelfareBanner } from '@/components/dashboard/WelfareBanner';

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'matured'>('active');
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-investments'],
    queryFn: async () => (await api.get('/investments/mine')).data,
  });

  const { format } = useMoney();

  if (isLoading) return <div className="p-10 text-slate-500">Loading…</div>;

  const investments = data?.investments ?? data ?? [];
  const active = investments.filter((i: { status: string }) => i.status === 'ACTIVE');
  const matured = investments.filter((i: { status: string }) => i.status === 'MATURED');
  
  // Calculate total earned from active investments
  const totalEarned = active.reduce(
    (sum: number, inv: { totalInterestAccrued: string }) => 
      sum + (parseFloat(inv.totalInterestAccrued) || 0), 
    0
  );

  const displayedInvestments = activeTab === 'active' ? active : matured;

  return (
    <div className="p-6 lg:p-10">
       <WelfareBanner />
      <h1 className="text-2xl font-bold text-slate-900">My investments</h1>
      
      {/* Stats Card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] px-6 py-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-sm text-blue-100">Active positions</p>
            <p className="mt-2 text-4xl font-bold">{active.length}</p>
          </div>
          <div className="border-t border-blue-400/30 sm:border-t-0 sm:border-l sm:pl-6">
            <p className="text-sm text-blue-100">Total earned (active)</p>
            <p className="mt-2 text-3xl font-bold">{format(totalEarned.toString())}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-slate-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Active ({active.length})
          </button>
          <button
            onClick={() => setActiveTab('matured')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'matured'
                ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Matured ({matured.length})
          </button>
        </nav>
      </div>

      {/* Investments List */}
      <ul className="mt-6 space-y-4">
        {displayedInvestments.length ? (
          displayedInvestments.map(
            (inv: {
              id: string;
              status: string;
              principalAmount: string;
              package: { name: string };
              maturityDate: string;
              totalInterestAccrued: string;
              maturedAt?: string;
            }) => (
              <li key={inv.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-900">{inv.package?.name}</span>
                    <span className={`ml-3 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      inv.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {inv.status === 'ACTIVE' 
                      ? `Matures ${new Date(inv.maturityDate).toLocaleDateString()}`
                      : `Matured ${inv.maturedAt ? new Date(inv.maturedAt).toLocaleDateString() : new Date(inv.maturityDate).toLocaleDateString()}`
                    }
                  </span>
                </div>
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="text-sm text-slate-600">
                    Principal: <span className="font-medium">{format(inv.principalAmount)}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Interest accrued:{' '}
                    <span className={`font-medium ${inv.status === 'ACTIVE' ? 'text-green-600' : 'text-slate-600'}`}>
                      {format(inv.totalInterestAccrued)}
                    </span>
                  </p>
                </div>
                
                {inv.status === 'MATURED' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Total return: {format((parseFloat(inv.principalAmount) + parseFloat(inv.totalInterestAccrued)).toString())}
                    </p>
                  </div>
                )}
              </li>
            ),
          )
        ) : (
          <li className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {activeTab === 'active' 
              ? 'No active investments — browse products to start earning.' 
              : 'No matured investments yet.'}
          </li>
        )}
      </ul>
    </div>
  );
}