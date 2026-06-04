import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (msg: string) => sonnerToast.success(msg),
  error: (msg: string) => sonnerToast.error(msg),
  info: (msg: string) => sonnerToast.message(msg),
};

export function toastApiError(err: unknown): void {
  const ax = err as { response?: { data?: { message?: string | string[] } } };
  const m = ax.response?.data?.message;
  const text = Array.isArray(m) ? m.join(', ') : m ?? (err as Error)?.message ?? 'Request failed';
  sonnerToast.error(String(text));
}
