import type { LucideIcon } from 'lucide-react';

export function FieldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="pointer-events-none flex h-10 w-10 shrink-0 items-center justify-center text-slate-400 dark:text-slate-500">
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}
