'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAdminSettings, useUpdateSettings } from '@/hooks/useAdmin';

const tabs = ['General'];

function SettingsContent() {
  const [activeTab, setActiveTab] = useState('General');
  const { data: settings, isLoading } = useAdminSettings();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState({
    platformName: '',
    supportEmail: '',
    contactNumber: '',
    timezone: '',
    currency: '',
  });

  // populate form once settings load from DB
  useEffect(() => {
    if (settings) {
      setForm({
        platformName: settings.platformName || '',
        supportEmail: settings.supportEmail || '',
        contactNumber: settings.contactNumber || '',
        timezone: settings.timezone || '',
        currency: settings.currency || '',
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => toast.success('Settings updated successfully'),
      onError: () => toast.error('Failed to update settings'),
    });
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Settings</h1>
        <p className="text-sm text-neutral-400 mb-6">Manage system settings</p>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden flex">
          {/* Tabs sidebar */}
          <div className="w-48 border-r border-neutral-100 p-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-brand-700 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'General' && (
              <>
                {isLoading ? (
                  <p className="text-sm text-neutral-400">Loading settings...</p>
                ) : (
                  <div className="max-w-md space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900">General Settings</h3>

                    <div>
                      <label className="text-xs font-medium text-neutral-900">Platform Name</label>
                      <input
                        value={form.platformName}
                        onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                        className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-900">Support Email</label>
                      <input
                        type="email"
                        value={form.supportEmail}
                        onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                        className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-900">Contact Number</label>
                      <input
                        value={form.contactNumber}
                        onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                        className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-900">Timezone</label>
                      <input
                        value={form.timezone}
                        onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                        className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-900">Currency</label>
                      <input
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SettingsContent />
    </ProtectedRoute>
  );
}