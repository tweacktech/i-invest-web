import { useCurrency } from '@/contexts/CurrencyContext';

export function useMoney() {
  const { convert, symbol } =
    useCurrency();

  const format = (
    amount?: string | number
  ) => {
    const num = Number(amount || 0);

    const converted = convert(num);

    return `${symbol}${converted.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return {
    format,
  };
}