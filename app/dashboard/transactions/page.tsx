'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

const TX_TYPES = [
  'ALL',
  'DEPOSIT',
  'WITHDRAWAL',
  'INTEREST_ACCRUAL',
  'INVESTMENT_PURCHASE',
  // 'INVESTMENT_MATURITY',
  'COMMISSION',
  'WELFARE_FEE',
  'TASK_REWARD',
  // 'RESERVE_FOR_WITHDRAWAL',
  // 'RELEASE_WITHDRAWAL_RESERVE',
];

export default function Transactions() {
  const { format } = useMoney();

  const [typeFilter, setTypeFilter] = useState('ALL');

  const [dateRange, setDateRange] =
    useState<'7' | '30' | '90' | 'all'>('30');

  const { data, isLoading } = useQuery({
    queryKey: [
      'wallet-transactions',
      typeFilter,
      dateRange,
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (typeFilter !== 'ALL') {
        params.append('type', typeFilter);
      }

      if (dateRange !== 'all') {
        params.append('days', dateRange);
      }

      const { data } =
      await api.get(
        `/wallet/transactions?${params}`
      );
    
    return data;
      
    },
  });

  const transactions = data?.data ?? [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-NG');

  const prettify = (text: string) =>
    text
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, c =>
        c.toUpperCase()
      );

  const getAmountColor = (
    type: string
  ) => {
    const debit = [
      'WITHDRAWAL',
      'INVESTMENT_PURCHASE',
      'WELFARE_FEE',
      'RESERVE_FOR_WITHDRAWAL',
    ];

    return debit.includes(type)
      ? 'text-red-600'
      : 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8">

        <h1 className="text-2xl font-bold">
          Account Statement
        </h1>

        <p className="text-slate-500">
          View all wallet activity
        </p>

      </div>

      {/* Type Tabs */}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">

        {TX_TYPES.map(type => (
          <button
            key={type}
            onClick={() =>
              setTypeFilter(type)
            }
            className={`
              rounded-lg
              whitespace-nowrap
              px-4
              py-2
              text-sm
              transition
              
              ${
              typeFilter === type
              ? `
              bg-slate-900
              text-white
              
              dark:bg-slate-100
              dark:text-slate-900
              `
              : `
              bg-slate-100
              text-slate-700
              
              hover:bg-slate-200
              
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:bg-slate-700
              `
              }
              `}
          >
            {prettify(type)}
          </button>
        ))}

      </div>

      {/* Date Filter */}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">

        {['7', '30', '90', 'all'].map(
          days => (
            <button
              key={days}
              onClick={() =>
                setDateRange(
                  days as any
                )
              }
              className={`
                rounded-lg
                px-4
                py-2
                whitespace-nowrap
                transition
                
                ${
                dateRange === days
                ? `
                bg-slate-900
                text-white
                
                dark:bg-slate-100
                dark:text-slate-900
                `
                : `
                bg-slate-100
                text-slate-700
                
                hover:bg-slate-200
                
                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:bg-slate-700
                `
                }
                `}
            >
              {days === 'all'
                ? 'All'
                : `${days} Days`}
            </button>
          )
        )}

      </div>

      {/* Summary */}

      {transactions.length > 0 && (
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <Card
            label="Transactions"
            value={transactions.length}
          />

          <Card
            label="Credits"
            value={format(
              transactions
                .filter(
                  (x: any) =>
                    Number(
                      x.balanceAfter
                    ) >
                    Number(
                      x.balanceBefore
                    )
                )
                .reduce(
                  (
                    a: number,
                    b: any
                  ) =>
                    a +
                    Number(
                      b.amount
                    ),
                  0
                )
            )}
          />

          <Card
            label="Debits"
            value={format(
              transactions
                .filter(
                  (x: any) =>
                    Number(
                      x.balanceAfter
                    ) <
                    Number(
                      x.balanceBefore
                    )
                )
                .reduce(
                  (
                    a: number,
                    b: any
                  ) =>
                    a +
                    Number(
                      b.amount
                    ),
                  0
                )
            )}
          />

        </div>
      )}

      {/* Table */}

     
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ">

{/* Mobile */}

<div className="block md:hidden">

{transactions.length ? (

<div className="divide-y">

{transactions.map((tx:any)=>(

<div
key={tx.id}
className="p-4"
>

<div className="flex justify-between">

<div className="text-sm text-slate-500">
{formatDate(tx.createdAt)}
</div>

<span
className="rounded bg-slate-100 px-2 py-1 text-xs"
>
{prettify(tx.type)}
</span>

</div>

<div className="mt-3">

<div className="font-medium">
{tx.description || '-'}
</div>

<div
className={`mt-2 text-lg font-bold ${getAmountColor(
tx.type
)}`}
>
{format(tx.amount)}
</div>

<div className="mt-2 text-sm">

<div>
Before:
{' '}
{format(tx.balanceBefore)}
</div>

<div>
After:
{' '}
{format(tx.balanceAfter)}
</div>

</div>

</div>

</div>

))}

</div>

) : (
<div className="p-8 text-center">
No transactions
</div>
)}

</div>


{/* Desktop */}

  <div className="hidden md:block overflow-x-auto">

    <table className="w-full">

    <thead>

    <tr className="bg-slate-50 dark:bg-slate-800">

    <th className="p-4 text-left">
    Date
    </th>

    <th className="p-4 text-left">
    Type
    </th>

    <th className="p-4 text-left">
    Description
    </th>

    <th className="p-4 text-left">
    Amount
    </th>

    <th className="p-4 text-left">
    Balance
    </th>

    </tr>

    </thead>

    <tbody>

    {transactions.map(
    (tx:any)=>(

    <tr
    key={tx.id}
    className="border-t"
    >

    <td className="p-4">
    {formatDate(tx.createdAt)}
    </td>

    <td className="p-4">
    <span className="rounded  px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-white">
      {prettify(tx.type)}
    </span>
    </td>

    <td className="p-4">
    {tx.description || '-'}
    </td>

    <td
    className={`p-4 font-semibold ${getAmountColor(
    tx.type
    )}`}
    >
    {format(tx.amount)}
    </td>

    <td className="p-4">

    <div>
    <div>
    Before:
    {' '}
    {format(tx.balanceBefore)}
    </div>

    <div>
    After:
    {' '}
    {format(tx.balanceAfter)}
    </div>
    </div>

    </td>

    </tr>

    )

    )}

    </tbody>

    </table>

    </div>

  </div>

</div>
  );
}

function Card({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-lg border p-5">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}