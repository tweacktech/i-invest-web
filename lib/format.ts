export function formatNgn(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '₦0.00';
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return '₦0.00';
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
