'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

type Props = {
  href: string;
  label: string;
  icon: string;
  onNavigate?: () => void;
  linkClass: (active: boolean) => string;
};

export function NotificationNavLink({ href, label, icon, onNavigate, linkClass }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  const { data } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => (await api.get<{ count: number }>('/notifications/unread-count')).data,
    refetchInterval: 60_000,
  });

  const count = data?.count ?? 0;

  return (
    <Link href={href} onClick={onNavigate} className={linkClass(active)}>
      <span className="text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      {count > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </Link>
  );
}
