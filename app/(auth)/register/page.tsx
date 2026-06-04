import { Suspense } from 'react';
import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
          Loading…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
