const accountStyles: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  SUSPENDED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  BANNED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const kycStyles: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  VERIFIED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export function AccountStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${accountStyles[status] ?? accountStyles.ACTIVE}`}>
      {status}
    </span>
  );
}

export function KycStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${kycStyles[status] ?? kycStyles.PENDING}`}>
      KYC {status}
    </span>
  );
}
