'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api-client';
import { adminApi } from '@/lib/admin-api';
import { toastApiError } from '@/lib/toast';

export function ToastInterceptor() {
  useEffect(() => {
    const a = api.interceptors.response.use(
      (res) => res,
      (err) => {
        toastApiError(err);
        return Promise.reject(err);
      },
    );
    const b = adminApi.interceptors.response.use(
      (res) => res,
      (err) => {
        toastApiError(err);
        return Promise.reject(err);
      },
    );
    return () => {
      api.interceptors.response.eject(a);
      adminApi.interceptors.response.eject(b);
    };
  }, []);
  return null;
}
