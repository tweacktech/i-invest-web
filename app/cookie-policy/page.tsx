'use client';

import Link from "next/link";
import { Cookie, ChevronRight, Home } from "lucide-react";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-500">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Cookie Policy</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Cookie className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black sm:text-4xl">Cookie Policy</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
          <section>
            <h2 className="text-xl font-bold">1. What Are Cookies</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you interact with our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Types of Cookies We Use</h2>
            
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-semibold">🔐 Essential Cookies</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Required for the platform to function properly. They enable:
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  <li>Secure login and authentication</li>
                  <li>Session management</li>
                  <li>Transaction processing</li>
                  <li>Security features</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-semibold">📊 Analytics Cookies</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Help us understand how users interact with our platform:
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages</li>
                  <li>Feature usage statistics</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-semibold">⚙️ Functional Cookies</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Remember your preferences to enhance your experience:
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  <li>Language and currency preferences</li>
                  <li>Dark/light mode settings</li>
                  <li>Saved dashboard layouts</li>
                  <li>Recent transactions</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-semibold">🎯 Marketing Cookies</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Used to deliver relevant content and offers:
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  <li>Personalized investment recommendations</li>
                  <li>Referral tracking</li>
                  <li>Campaign effectiveness measurement</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Third-Party Cookies</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We use trusted third-party services that may set cookies on our behalf:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Google Analytics - for platform analytics</li>
              <li>Payment processors - for secure transactions</li>
              <li>Security services - for fraud prevention</li>
              <li>Customer support tools - for live chat functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Cookie Duration</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We use both:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li><strong>Session cookies:</strong> Temporary and deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device until they expire or you delete them</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Managing Cookies</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You can control cookies through your browser settings:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Delete all cookies stored on your device</li>
              <li>Block cookies from specific websites</li>
              <li>Set your browser to notify you before accepting cookies</li>
              <li>Use private/incognito browsing mode</li>
            </ul>
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Note: Disabling essential cookies may affect platform functionality and your user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Cookie Consent</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              When you first visit our platform, we display a cookie banner asking for your consent. By continuing to use our platform, you agree to our use of cookies as described in this policy.
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You can withdraw your consent at any time by:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Clearing cookies from your browser</li>
              <li>Adjusting your browser settings</li>
              <li>Contacting our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Updates to This Policy</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We may update this Cookie Policy periodically to reflect changes in technology or regulations. We will notify you of significant changes through our platform or via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Contact Us</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              If you have questions about our use of cookies, please contact:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Email: privacy@i-invest.com</li>
              <li>Data Protection Officer: dpo@i-invest.com</li>
            </ul>
          </section>

          <div className="mt-6 rounded-xl bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold">🍪 Cookie Preferences:</p>
            <p>You can manage your cookie preferences through your browser settings at any time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}