'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast, toastApiError } from '@/lib/toast';// or import { toast } from 'sonner';
import { api } from '@/lib/api-client';

type Tab = 'bank' | 'pin' | 'password';

export default function SettingsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('bank');
  
  const profile = useQuery({
    queryKey: ['settings-profile'],
    queryFn: async () => (await api.get('/settings/profile')).data,
  });

  const banks = useQuery({
    queryKey: ['catalog-banks'],
    queryFn: async () => (await api.get<{ id: string; name: string }[]>('/public/catalog-banks')).data,
  });

  // Bank account states
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // PIN states
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveBank = useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/settings/bank', {
        accountName,
        bankName,
        accountNumber,
        isDefault: true,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setAccountName('');
      setBankName('');
      setAccountNumber('');
      toast.success('Bank details saved successfully! 🏦');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save bank details');
    },
  });

  const savePin = useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/settings/withdrawal-pin', { pin });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setPin('');
      setConfirmPin('');
      toast.success('Withdrawal PIN set successfully! 🔒');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to set withdrawal PIN');
    },
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/settings/password', {
        currentPassword,
        newPassword,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully! 🔑');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });

  const tabs = [
    { id: 'bank', label: 'Bank Account', icon: '🏦' },
    { id: 'pin', label: 'Withdrawal PIN', icon: '🔒' },
    { id: 'password', label: 'Change Password', icon: '🔑' },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings & security</p>

      {/* Tabs */}
      <div className="mt-6 border-b border-slate-200 dark:border-slate-800">
        <nav className="flex flex-wrap gap-2 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Bank Account Tab */}
        {activeTab === 'bank' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Bank account</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Used for withdrawals after admin approval</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Account name</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="As shown on your bank account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Bank</label>
                {banks.data?.length ? (
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="">Select bank…</option>
                    {banks.data.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500"
                    placeholder="Bank name (catalog loading…)"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Account number</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="10-digit NUBAN"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <button
                type="button"
                disabled={saveBank.isPending}
                onClick={() => saveBank.mutate()}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500"
              >
                {saveBank.isPending ? 'Saving...' : 'Save bank details'}
              </button>
            </div>
            {profile.data?.bankAccounts?.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                {profile.data.bankAccounts.map(
                  (b: { id: string; bankName: string; accountNumber: string; accountName: string }) => (
                    <li key={b.id} className="text-slate-600 dark:text-slate-400">
                      {b.bankName} — {b.accountName} ({b.accountNumber})
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>
        )}

        {/* Withdrawal PIN Tab */}
        {activeTab === 'pin' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Withdrawal PIN</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">4–12 digits · required to submit withdrawals</p>
            
            {profile.data?.hasWithdrawalPin ? (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">PIN is set and secured</p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-400">Your withdrawal PIN is active. Contact support if you need to change it.</p>
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">New PIN</label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                      placeholder="Enter a secure PIN (4-12 digits)"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={12}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Confirm PIN</label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                      placeholder="Confirm your PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      maxLength={12}
                    />
                  </div>
                  {pin && confirmPin && pin !== confirmPin && (
                    <p className="text-sm text-red-600 dark:text-red-400">PINs do not match</p>
                  )}
                  <button
                    type="button"
                    disabled={savePin.isPending || pin.length < 4 || pin !== confirmPin}
                    onClick={() => savePin.mutate()}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500"
                  >
                    {savePin.isPending ? 'Setting PIN...' : 'Set Withdrawal PIN'}
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Change Password</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Current Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">New Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="Enter a strong new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">Passwords do not match</p>
              )}
              {newPassword && newPassword.length < 8 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">Password must be at least 8 characters</p>
              )}
              <button
                type="button"
                disabled={
                  changePassword.isPending || 
                  !currentPassword || 
                  !newPassword || 
                  !confirmPassword || 
                  newPassword !== confirmPassword ||
                  newPassword.length < 8
                }
                onClick={() => changePassword.mutate()}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500"
              >
                {changePassword.isPending ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password Requirements:</h4>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  {newPassword.length >= 8 ? '✅' : '❌'} At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  {/[A-Z]/.test(newPassword) ? '✅' : '❌'} At least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  {/[a-z]/.test(newPassword) ? '✅' : '❌'} At least one lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  {/\d/.test(newPassword) ? '✅' : '❌'} At least one number
                </li>
                <li className="flex items-center gap-2">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✅' : '❌'} At least one special character
                </li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}