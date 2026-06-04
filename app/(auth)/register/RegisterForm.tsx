'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useRegister } from '@/hooks/api/useAuth';
import { ArrowRight, Gift, Moon, Sun, TrendingUp } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };


  const register = useRegister();

  useEffect(() => {
    const ref = searchParams.get('ref')?.trim().toUpperCase();

    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await register.mutateAsync({
      phoneNumber,
      password,
      referralCode: referralCode || undefined,
    });

    router.push('/dashboard');
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background text-foreground">

<button
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-50 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition-all hover:scale-110 dark:bg-slate-800/80 sm:right-6 sm:top-6 sm:p-3"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 sm:h-5 sm:w-5" />
        )}
      </button>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
 {/* Mobile Logo */}
       <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-xl font-black text-white shadow-lg">
              I
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                I-Invest
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Investment Platform
              </p>
            </div>
          </div>

        <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
      </div>
      
      {/* LEFT */}
      <section className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <Link href='/'>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-2xl font-black">
              I
            </div>

            <div>
              <h1 className="text-2xl font-black">I-Invest</h1>
              <p className="text-sm text-slate-300">
                Smart Investment Platform
              </p>
            </div>
            </Link>
          </div>

          <div className="mt-20 animate-[fadeInUp_1s_ease]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Build Your Financial Future
            </div>

            <h2 className="max-w-lg text-5xl font-black leading-tight">
              Start investing with confidence today.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Join thousands of investors earning rewards through secure
              investment cycles and referral bonuses.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-emerald-400" />

            <div>
              <h3 className="font-semibold">Referral Rewards</h3>

              <p className="text-sm text-slate-400">
                Earn bonuses when friends join using your code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT */}
      <section className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md animate-[fadeInUp_0.7s_ease]">
            {/* Mobile Logo */}
           <Link href='/'>
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-xl font-black text-white shadow-lg">
              I
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                I-Invest
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Investment Platform
              </p>
            </div>
           
          </div>
       </Link>
          {/* Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
            <div className="text-center">
              <h1 className="text-3xl font-black">
                Create Account
              </h1>

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Join I-Invest and start growing your wealth
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone Number
                </label>

                <input
                  className="auth-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="+234 801 234 5678"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <input
                  className="auth-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Minimum 6 characters"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Referral Code
                  <span className="ml-1 text-xs text-red-600">
                    (Required)
                  </span>
                </label>

                <input
                  className="auth-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Referral code"
                  value={referralCode}
                  onChange={(e) =>
                    setReferralCode(e.target.value.toUpperCase())
                  }
                  maxLength={16}
                />
              </div>

              <button
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-4 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] disabled:opacity-50"
                disabled={register.isPending}
              >
                {register.isPending
                  ? 'Creating account...'
                  : 'Create Account'}

                {!register.isPending && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                )}
              </button>

              {register.error ? (
                <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
                  Registration failed. Please try again.
                </p>
              ) : null}
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-emerald-500 hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}