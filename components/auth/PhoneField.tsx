'use client';

import { Phone } from 'lucide-react';
import { FieldIcon } from './FieldIcon';

type Props = {
  id: string;
  label: string;
  /** Local number without +234 — we prepend +234 for display and submit full E.164 */
  localValue: string;
  onLocalChange: (digits: string) => void;
  placeholder?: string;
};

export function PhoneField({ id, label, localValue, onLocalChange, placeholder = 'Enter your phone number' }: Props) {
  const icon = Phone;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950">
        <FieldIcon icon={icon} />
        <span className="flex shrink-0 items-center border-r border-slate-200 pr-2 text-sm font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
          +234
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          className="auth-input min-w-0 flex-1 border-0 bg-transparent py-3 pl-3 text-base text-slate-900 outline-none dark:text-slate-100"
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => onLocalChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
          autoComplete="tel-national"
          required
        />
      </div>
    </div>
  );
}

export function toFullNgPhone(local: string): string {
  const d = local.replace(/\D/g, '');
  if (!d) return '';
  return `+234${d}`;
}
