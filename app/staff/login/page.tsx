'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { ArrowRight, ShieldCheck, Users, Lock, Mail, Briefcase, Building2, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await adminApi.post('/staff/auth/login', { email, password });
      window.localStorage.setItem('adminAccessToken', data.accessToken);
      if (rememberMe) {
        localStorage.setItem('staffEmail', email);
      }
      router.replace('/staff');
    } catch {
      setErr('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Load saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem('staffEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Theme Toggle Button */}
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

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-[250px] w-[250px] rounded-full bg-amber-500/20 blur-3xl animate-pulse sm:h-[320px] sm:w-[320px]" />
        <div className="absolute bottom-[-150px] right-[-100px] h-[280px] w-[280px] rounded-full bg-orange-500/20 blur-3xl animate-pulse sm:h-[350px] sm:w-[350px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-3xl sm:h-[500px] sm:w-[500px]" />
      </div>

      {/* LEFT SIDE - Staff Info (Hidden on mobile, visible on tablet/desktop) */}
      <section className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white lg:flex xl:p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-xl font-black shadow-xl sm:h-14 sm:w-14 sm:text-2xl">
              S
            </div>
            <div>
              <Link href="/">
                <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                  Staff Portal
                </h1>
                <p className="text-xs text-slate-300 sm:text-sm">
                  Admin Management System
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-16 animate-[fadeInUp_1s_ease] xl:mt-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              <ShieldCheck className="h-3 w-3 text-amber-400 sm:h-4 sm:w-4" />
              Secure Staff Access
            </div>

            <h2 className="max-w-lg text-3xl font-black leading-tight sm:text-4xl xl:text-5xl">
              Manage investments & user accounts.
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
              Review withdrawals, approve recharges, monitor user activity,
              and maintain platform integrity with powerful admin tools.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-3xl sm:p-5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
              <div>
                <h3 className="text-sm font-semibold sm:text-base">User Management</h3>
                <p className="text-xs text-slate-400 sm:text-sm">
                  View and manage all platform users
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-3xl sm:p-5">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Transaction Oversight</h3>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Approve and monitor all transactions
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-3xl sm:p-5">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Platform Analytics</h3>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Real-time dashboard and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE - Login Form */}
      <section className="flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2">
        <div className="w-full max-w-md animate-[fadeInUp_0.7s_ease]">
          {/* Mobile Logo */}
          <div className="mb-6 flex flex-col items-center justify-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-2xl font-black text-white shadow-lg">
              S
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight">
                Staff Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Management System
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition-all hover:shadow-3xl dark:border-slate-800 dark:bg-slate-900/70 sm:rounded-3xl sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg sm:h-16 sm:w-16">
                <Lock className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Staff Sign In
              </h1>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:mt-3 sm:text-sm">
                Use your staff credentials to access the admin panel
              </p>
            </div>

            <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300 sm:mb-2 sm:text-sm">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />
                  <input
                    type="email"
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:rounded-2xl sm:pl-12 sm:py-4 sm:text-base"
                    placeholder="staff@i-invest.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300 sm:mb-2 sm:text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:rounded-2xl sm:pl-12 sm:pr-12 sm:py-4 sm:text-base"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 sm:right-4"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  Remember me
                </label>
                {/* <button
                  type="button"
                  className="text-left text-xs font-medium text-amber-600 hover:underline dark:text-amber-400 sm:text-right sm:text-sm"
                  onClick={() => {
                    // Add forgot password logic here
                  }}
                >
                  Forgot password?
                </button> */}
              </div>

              {err && (
                <div className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-600 backdrop-blur dark:text-red-400 sm:rounded-xl sm:p-3 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 sm:h-2 sm:w-2" />
                    {err}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 sm:mt-8 sm:pt-6">
              <div className="text-center text-[10px] text-slate-400 sm:text-xs">
                <p>Secure staff access only</p>
                <p className="mt-1">
                  Unauthorized access is prohibited and monitored
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-4 text-center sm:mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 sm:text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-\[fadeInUp_1s_ease\] {
          animation: fadeInUp 1s ease;
        }
        .animate-\[fadeInUp_0\.7s_ease\] {
          animation: fadeInUp 0.7s ease;
        }
      `}</style>
    </main>
  );
}