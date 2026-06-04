'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { MaintenanceGate } from '@/components/maintenance-gate';
import { ToastInterceptor } from '@/components/toast-interceptor';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastInterceptor />
        <Toaster richColors position="top-right" closeButton />
        <MaintenanceGate>{children}</MaintenanceGate>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
