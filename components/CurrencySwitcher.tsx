'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

const currencies = [
  {
    code: 'NGN',
    label: '₦ NGN',
  },
  {
    code: 'USD',
    label: '$ USD',
  },
  {
    code: 'EUR',
    label: '€ EUR',
  },
];

export function CurrencySwitcher() {
  const { currency, setCurrency } =
    useCurrency();

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) =>
          setCurrency(
            e.target.value as
              | 'NGN'
              | 'USD'
              | 'EUR'
          )
        }
        className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur transition focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
      >
        {currencies.map((c) => (
          <option
            key={c.code}
            value={c.code}
          >
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}