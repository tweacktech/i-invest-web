'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Users,
  Moon,
  Sun,
  Award,
  Globe,
  Lock,
  BarChart3,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { CurrencySwitcher } from '@/components/CurrencySwitcher';

export default function Home() {
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

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Theme Toggle */}
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
        <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-base font-bold text-white shadow-lg sm:h-11 sm:w-11 sm:rounded-2xl sm:text-lg">
            I
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">I-Invest</h1>
            <p className="text-[10px] text-muted-foreground text-slate-500 dark:text-slate-400 sm:text-xs">
              Smart Investment Platform
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          <a href="#features" className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300">
            How It Works
          </a>
          <a href="#security" className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300">
            Security
          </a>
          <a href="#about" className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300">
            About
          </a>
          <a href="#contact" className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CurrencySwitcher />
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:scale-105 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="animate-[fadeInUp_1s_ease]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            Trusted investment growth platform
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Invest Smarter.
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Grow Faster.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            I-Invest helps users manage investment cycles, track wallet balances,
            earn referral rewards, and securely grow their financial future with
            complete transparency.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-xs font-semibold text-white shadow-2xl transition hover:scale-105 sm:rounded-2xl sm:px-7 sm:py-4 sm:text-sm"
            >
              Create Account
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1 sm:h-4 sm:w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-semibold shadow-sm transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl sm:px-7 sm:py-4 sm:text-sm"
            >
              Login
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-4 sm:mt-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Instant Withdrawals</span>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative animate-[float_5s_ease-in-out_infinite]">
          <div className="rounded-2xl border border-white/10 bg-white/70 p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-900/70 sm:rounded-3xl sm:p-6">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <div>
                <p className="text-xs text-slate-500 sm:text-sm">Portfolio Balance</p>
                <h2 className="mt-1 text-2xl font-black sm:text-4xl">$124,540</h2>
              </div>
              <div className="rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
                +18.4%
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { title: "90-Day Investment", subtitle: "Active Growth Cycle", amount: "+$5,420", color: "text-emerald-500" },
                { title: "Referral Earnings", subtitle: "24 successful invites", amount: "$1,200", color: "text-cyan-500" },
                { title: "Wallet Balance", subtitle: "Available for withdrawal", amount: "$9,430", color: "text-slate-900 dark:text-white" }
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-background p-3 dark:border-slate-800 sm:rounded-2xl sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold sm:text-sm">{item.title}</p>
                      <p className="text-[10px] text-slate-500 sm:text-xs">{item.subtitle}</p>
                    </div>
                    <p className={`text-xs font-bold sm:text-sm ${item.color}`}>{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Important for AdSense */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-black sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base">
            Start your investment journey in three simple steps
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "01", title: "Create Account", desc: "Sign up with your phone number and complete KYC verification" },
            { step: "02", title: "Deposit Funds", desc: "Add funds to your wallet via bank transfer or other methods" },
            { step: "03", title: "Start Investing", desc: "Choose your investment plan and watch your money grow" }
          ].map((item, idx) => (
            <div key={idx} className="relative rounded-2xl border border-slate-200 bg-white/60 p-6 text-center shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
              <div className="absolute -top-4 left-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-3 mt-4 text-xl font-bold sm:text-2xl">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-black sm:text-4xl">Why Choose I-Invest?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base">
            Built with modern financial infrastructure for seamless investment experiences
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Wallet, title: "Smart Wallet", desc: "Track deposits, earnings, and withdrawals with real-time wallet management." },
            { icon: TrendingUp, title: "Growth Cycles", desc: "Automated 90-day investment cycles with transparent returns." },
            { icon: Users, title: "Referral Rewards", desc: "Invite friends and earn bonuses directly into your investment wallet." },
            { icon: ShieldCheck, title: "Secure Platform", desc: "Bank-grade security with encrypted transactions and data protection." },
            { icon: BarChart3, title: "Real Analytics", desc: "Monitor your portfolio performance with detailed analytics and reports." },
            { icon: Award, title: "Rewards Program", desc: "Earn loyalty bonuses and exclusive perks as you grow your investments." }
          ].map((item, index) => (
            <div key={index} className="group rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:mt-3 sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-2xl sm:rounded-3xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <ShieldCheck className="h-3 w-3 text-emerald-400 sm:h-4 sm:w-4" />
                Enterprise Grade Security
              </div>
              <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                Your investments are protected with modern infrastructure.
              </h2>
              <p className="mt-4 text-sm text-slate-300 sm:mt-5 sm:text-base">
                Built with encrypted authentication, secure wallet systems,
                transaction validation, and admin-controlled investment workflows.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {["Secure Authentication", "Protected Wallet Transactions", "Transparent Investment Tracking", "Real-Time Dashboard Updates"].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm sm:rounded-2xl sm:p-4">
                  <span className="mr-2">🔒</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Required for AdSense */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">About I-Invest</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              I-Invest is a leading investment platform dedicated to democratizing access to wealth-building opportunities. Founded with a vision to make smart investing accessible to everyone, we provide transparent, secure, and user-friendly investment solutions.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Our mission is to help individuals achieve financial independence through innovative investment products, real-time portfolio tracking, and educational resources. With thousands of satisfied users and millions in successful transactions, we're committed to your financial success.
            </p>
            <div className="mt-6 flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">5K+</div>
                <div className="text-xs text-slate-500 sm:text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">$5M+</div>
                <div className="text-xs text-slate-500 sm:text-sm">Investments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">98%</div>
                <div className="text-xs text-slate-500 sm:text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
            <h3 className="text-xl font-bold">Our Values</h3>
            <div className="mt-4 space-y-3">
              {[
                { title: "Transparency", desc: "Clear terms and no hidden fees" },
                { title: "Security", desc: "Bank-grade protection for your funds" },
                { title: "Innovation", desc: "Cutting-edge investment technology" },
                { title: "Support", desc: "Dedicated customer service team" }
              ].map((value, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-semibold">{value.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Required for AdSense */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
          <div className="text-center">
            <h2 className="text-3xl font-black sm:text-4xl">Contact Us</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Have questions? We're here to help. Reach out to our support team
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <Mail className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold">Email</p>
              <a href="mailto:support@i-invest.com" className="text-sm text-slate-600 hover:text-emerald-500 dark:text-slate-400">
                support@i-invest.com
              </a>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <Phone className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold">Phone</p>
              <a href="tel:+1234567890" className="text-sm text-slate-600 hover:text-emerald-500 dark:text-slate-400">
                +1 (234) 567-890
              </a>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-semibold">Live Chat</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">24/7 Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-2xl border border-slate-200 bg-white/60 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-12">
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
            Start Building Wealth Today
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:mt-5 sm:text-base">
            Join thousands of users already investing smarter with I-Invest.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
            <Link href="/register" className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105 sm:rounded-2xl sm:px-8 sm:py-4">
              Get Started
            </Link>
            <Link href="/login" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700 sm:rounded-2xl sm:px-8 sm:py-4">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Required for AdSense */}
      <footer className="border-t border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
                  I
                </div>
                <span className="font-bold">I-Invest</span>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Smart Investment Platform for modern investors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#features" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">How It Works</a></li>
                <li><a href="#security" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">Security</a></li>
                <li><a href="#about" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-slate-600 hover:text-emerald-500 dark:text-slate-400">Cookie Policy</Link></li>
              </ul>
            </div>
           {/* <div>
               <h3 className="font-semibold">Connect</h3>
              <div className="mt-3 flex gap-3">
                {/* <a href="#" className="text-slate-500 hover:text-emerald-500"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-500"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-500"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-500"><Instagram className="h-5 w-5" /></a> 
              </div> 
            </div>*/}
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800">
            <p>&copy; {new Date().getFullYear()} I-Invest. All rights reserved.</p>
            <p className="mt-1">Secure investment platform | Empowering financial growth</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-\\[fadeInUp_1s_ease\\] { animation: fadeInUp 1s ease; }
        .animate-\\[float_5s_ease-in-out_infinite\\] { animation: float 5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}