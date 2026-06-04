'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';

type VipLevel = {
  level: number;
  levelName: string;
  minInvestmentRequired: string;
  minTeamMembers: number;
  minCommissionEarned: string;
  maxWithdrawalPercent: string;
  dividendRate: string;
  weeklySalary: string;
  isActive: boolean;
};

export default function StaffVipLevelsPage() {
  const qc = useQueryClient();
  const levels = useQuery({
    queryKey: ['staff-vip-levels'],
    queryFn: async () => (await adminApi.get<VipLevel[]>('/staff/vip-levels')).data,
  });

  const save = useMutation({
    mutationFn: async (row: VipLevel) => {
      await adminApi.put(`/staff/vip-levels/${row.level}`, {
        levelName: row.levelName,
        minInvestmentRequired: row.minInvestmentRequired,
        minTeamMembers: row.minTeamMembers,
        minCommissionEarned: row.minCommissionEarned,
        maxWithdrawalPercent: row.maxWithdrawalPercent,
        dividendRate: row.dividendRate,
        weeklySalary: row.weeklySalary,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff-vip-levels'] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">VIP levels</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Configure promotion requirements and withdrawal percentage caps per tier.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950">
            <tr>
              <th className="px-3 py-2">Lvl</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Min invest</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">Commission</th>
              <th className="px-3 py-2">Withdraw %</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {levels.data?.map((row) => (
              <tr key={row.level} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium">{row.level}</td>
                <td className="px-3 py-2">{row.levelName}</td>
                <td className="px-3 py-2">{row.minInvestmentRequired}</td>
                <td className="px-3 py-2">{row.minTeamMembers}</td>
                <td className="px-3 py-2">{row.minCommissionEarned}</td>
                <td className="px-3 py-2">{row.maxWithdrawalPercent}%</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="text-xs text-amber-700 hover:underline dark:text-amber-400"
                    onClick={() => {
                      const maxWithdrawalPercent = window.prompt(
                        `Withdraw % for VIP ${row.level}`,
                        row.maxWithdrawalPercent,
                      );
                      if (maxWithdrawalPercent == null) return;
                      save.mutate({ ...row, maxWithdrawalPercent });
                    }}
                  >
                    Edit withdraw %
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
