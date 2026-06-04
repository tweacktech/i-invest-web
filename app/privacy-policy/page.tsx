'use client';

import Link from "next/link";
import { Shield, ChevronRight, Home } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-500">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
          <section>
            <h2 className="text-xl font-bold">1. Information We Collect</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We collect information you provide directly to us, including:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Financial information for investment purposes (bank account details, transaction history)</li>
              <li>Government-issued ID for KYC verification</li>
              <li>Transaction history and wallet activity</li>
              <li>Device and usage data through cookies and similar technologies</li>
              <li>Communication preferences and support inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We use your information to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Process your investment transactions and manage your account</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Communicate important updates about your account and investments</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze usage patterns to enhance our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Information Sharing</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Service providers who assist with payment processing and KYC verification</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Financial institutions for processing transactions</li>
              <li>Analytics providers to improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Data Security</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication protocols</li>
              <li>Secure data centers with 24/7 monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Your Rights</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You have the right to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Cookies and Tracking</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We use cookies and similar technologies to enhance your experience. For more details, please see our <Link href="/cookie-policy" className="text-emerald-500 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Children's Privacy</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Changes to This Policy</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We may update this Privacy Policy periodically. We will notify you of significant changes through email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Contact Us</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Email: privacy@i-invest.com</li>
              <li>Phone: +1 (234) 567-8900</li>
              <li>Address: 123 Investment Street, Financial District, NY 10001</li>
            </ul>
          </section>

          <div className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            <p className="font-semibold">📌 Effective Date:</p>
            <p>This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </main>
  );
}