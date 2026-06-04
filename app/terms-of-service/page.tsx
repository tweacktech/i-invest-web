'use client';

import Link from "next/link";
import { FileText, ChevronRight, Home } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-500">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Terms of Service</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black sm:text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
          <section>
            <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              By accessing or using I-Invest's investment platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Eligibility</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              To use our platform, you must:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Be at least 18 years of age</li>
              <li>Have legal capacity to enter into binding contracts</li>
              <li>Provide accurate and complete registration information</li>
              <li>Complete KYC verification as required</li>
              <li>Not be located in a restricted jurisdiction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Account Registration</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You are responsible for maintaining the security of your account credentials. You agree to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Provide accurate and current information</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Investment Terms</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              By investing through our platform, you acknowledge:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Investments carry risk and past performance doesn't guarantee future results</li>
              <li>Returns are not guaranteed and may vary</li>
              <li>Minimum investment amounts apply as displayed on the platform</li>
              <li>Investment cycles are typically 90 days with automatic renewal options</li>
              <li>Early withdrawal may be subject to penalties or restrictions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Fees and Charges</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Our fee structure is transparent and includes:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Management fees as disclosed on the investment product pages</li>
              <li>Withdrawal fees may apply for certain transaction types</li>
              <li>No hidden charges or surprise fees</li>
              <li>Referral bonuses as outlined in the referral program terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Prohibited Activities</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              You agree not to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Use the platform for illegal activities or money laundering</li>
              <li>Create multiple accounts for fraudulent purposes</li>
              <li>Attempt to manipulate investment returns</li>
              <li>Share your account credentials with others</li>
              <li>Interfere with the platform's operation or security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Withdrawals and Payments</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Withdrawal requests are processed subject to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Verification of identity and account ownership</li>
              <li>Minimum withdrawal amounts as specified</li>
              <li>Processing times of 1-3 business days</li>
              <li>Bank fees that may be deducted from the withdrawal amount</li>
              <li>Withdrawal limits based on your verification level</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Termination</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We reserve the right to suspend or terminate accounts for:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Violation of these terms</li>
              <li>Suspicious or fraudulent activity</li>
              <li>Failure to complete KYC verification</li>
              <li>Extended periods of inactivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Limitation of Liability</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              To the maximum extent permitted by law, I-Invest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">10. Changes to Terms</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">11. Governing Law</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction where I-Invest is registered, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">12. Contact Information</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              For questions about these Terms, contact us at:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
              <li>Email: tweacktech@gmail.com</li>
              <li>Support: tweacktech@gmail.com</li>
            </ul>
          </section>

          <div className="mt-6 rounded-xl bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            <p className="font-semibold">⚠️ Important Notice:</p>
            <p>Investment involves risk. Please read these terms carefully before investing.</p>
          </div>
        </div>
      </div>
    </main>
  );
}