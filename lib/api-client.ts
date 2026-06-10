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
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      'Session expired. Please login again.';

    if (
      typeof window !== 'undefined' &&
      (status === 401 || status === 403)
    ) {
      localStorage.removeItem('accessToken');

      // show error before redirect
      alert(Array.isArray(message) ? message[0] : message);

      // avoid redirect loop
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);