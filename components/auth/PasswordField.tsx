'use client';

import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldIcon } from './FieldIcon';

type Props = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
};

export function PasswordField({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white ring-offset-2 focus-within:ring-2 focus-within:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-950">
        <FieldIcon icon={icon} />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="auth-input flex-1 border-0 bg-transparent py-3 pr-2 text-base text-slate-900 outline-none dark:text-slate-100"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          tabIndex={-1}
          className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
