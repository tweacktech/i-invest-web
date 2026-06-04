import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? '';

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
  },
});

adminApi.interceptors.request.use((config) => {
  if (apiKey) config.headers['x-api-key'] = apiKey;
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('adminAccessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
