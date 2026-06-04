'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

type RegisterInput = { phoneNumber: string; password: string; referralCode?: string };
type LoginInput = { phoneNumber: string; password: string };

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await api.post('/auth/register', payload);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('accessToken', data.accessToken);
        window.localStorage.setItem('refreshToken', data.refreshToken);
      }
      return data;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await api.post('/auth/login', payload);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('accessToken', data.accessToken);
        window.localStorage.setItem('refreshToken', data.refreshToken);
      }
      return data;
    },
  });
}
