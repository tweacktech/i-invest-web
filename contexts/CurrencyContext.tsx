'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Currency = 'NGN' | 'USD' | 'EUR';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amount: number) => number;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(
  null
);

const rates: Record<Currency, number> = {
  NGN: 1,
  USD: 0.00062,
  EUR: 0.00057,
};

const symbols: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
};

export function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrency] =
    useState<Currency>('NGN');

  useEffect(() => {
    const saved =
      localStorage.getItem('currency') as Currency;

    if (saved) {
      setCurrency(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const value = useMemo(
    () => ({
      currency,

      setCurrency,

      convert: (amount: number) => {
        return amount * rates[currency];
      },

      symbol: symbols[currency],
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      'useCurrency must be used inside CurrencyProvider'
    );
  }

  return context;
};