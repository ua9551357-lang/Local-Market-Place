'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useMyProviderProfile, useUpdateNotificationPrefs, useChangePassword } from '@/hooks/useProviderOnboarding';

function SettingsContent() {
  const { data: profile } = useMyProviderProfile();
  const updatePrefs = useUpdateNotificationPrefs();
  const changePassword = useChangePassword();

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const handleSavePrefs = () => {
    updatePrefs.mutate({ notifyEmail, notifySms }, {
      onSuccess: () => toast.success('Notification preferences saved'),
      onError: () => toast.error('Failed to save preferences'),
    });
  };

  const handleChangePassword = () => {
    if (passwords.next !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.next.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    changePassword.mutate(
      { currentPassword: passwords.current, newPassword: passwords.next },
      {
        onSuccess: () => {
          toast.success('Password updated successfully');
          setPasswords({ current: '', next: '', confirm: '' });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update password'),
      },
    );
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Settings</h1>
        <p className="text-sm text-neutral-400 mb-4">Manage your account settings</p>

        <div className="grid lg:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-900">Email Notifications</p>
                <button
                  onClick={() => setNotifyEmail((v) => !v)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${notifyEmail ? 'bg-brand-700' : 'bg-neutral-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifyEmail ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-900">SMS Notifications</p>
                <button
                  onClick={() => setNotifySms((v) => !v)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${notifySms ? 'bg-brand-700' : 'bg-neutral-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifySms ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <button
                onClick={handleSavePrefs}
                disabled={updatePrefs.isPending}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                {updatePrefs.isPending ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Change Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="password"
                placeholder="New password"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleChangePassword}
                disabled={changePassword.isPending}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                {changePassword.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProviderSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <SettingsContent />
    </ProtectedRoute>
  );
}