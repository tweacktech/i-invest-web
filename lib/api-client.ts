import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? '';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
  },
});

api.interceptors.request.use((config) => {
  if (apiKey) config.headers['x-api-key'] = apiKey;
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (typeof window !== 'undefined' && (status === 401 || status === 403)) {
      const msg = err.response?.data?.message;
      if (status === 401 && typeof msg === 'string' && msg.includes('log')) {
        window.localStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(err);
  },
);
