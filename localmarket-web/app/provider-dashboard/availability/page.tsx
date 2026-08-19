'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useMyAvailability, useUpdateAvailabilitySlots, useUpdatePreferences } from '@/hooks/useAvailability';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

function AvailabilityContent() {
  const { data, isLoading } = useMyAvailability();
  const updateSlots = useUpdateAvailabilitySlots();
  const updatePrefs = useUpdatePreferences();

  const [slots, setSlots] = useState<any[]>([]);
  const [prefs, setPrefs] = useState({ acceptingBookings: true, advanceBookingDays: 7, bufferTimeMins: 30 });

  useEffect(() => {
    if (data) {
      setSlots(data.slots);
      setPrefs(data.preferences);
    }
  }, [data]);

  const updateSlot = (day: string, field: string, value: any) => {
    setSlots((prev) => prev.map((s) => (s.day === day ? { ...s, [field]: value } : s)));
  };

  const handleSaveSlots = () => {
    updateSlots.mutate(slots, {
      onSuccess: () => toast.success('Weekly schedule updated'),
      onError: () => toast.error('Failed to update schedule'),
    });
  };

  const handleSavePrefs = () => {
    updatePrefs.mutate(prefs, {
      onSuccess: () => toast.success('Preferences updated'),
      onError: () => toast.error('Failed to update preferences'),
    });
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Availability</h1>
        <p className="text-sm text-neutral-400 mb-4">Manage your working hours and availability</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Weekly schedule */}
            <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Weekly Schedule</h3>
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const slot = slots.find((s: any) => s.day === day.key);
                  if (!slot) return null;
                  return (
                    <div key={day.key} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-neutral-900 shrink-0">{day.label}</span>
                      <input
                        type="time"
                        value={slot.startTime}
                        disabled={!slot.isAvailable}
                        onChange={(e) => updateSlot(day.key, 'startTime', e.target.value)}
                        className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm disabled:opacity-40 disabled:bg-neutral-50"
                      />
                      <span className="text-neutral-400 text-xs">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        disabled={!slot.isAvailable}
                        onChange={(e) => updateSlot(day.key, 'endTime', e.target.value)}
                        className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm disabled:opacity-40 disabled:bg-neutral-50"
                      />
                      <label className="ml-auto flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-neutral-400">{slot.isAvailable ? 'Available' : 'Off'}</span>
                        <button
                          type="button"
                          onClick={() => updateSlot(day.key, 'isAvailable', !slot.isAvailable)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${
                            slot.isAvailable ? 'bg-brand-700' : 'bg-neutral-200'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              slot.isAvailable ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </label>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleSaveSlots}
                disabled={updateSlots.isPending}
                className="mt-5 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                {updateSlots.isPending ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>

            {/* Quick settings */}
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Accept New Bookings</p>
                    <p className="text-xs text-neutral-400">Toggle off to pause new requests</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, acceptingBookings: !p.acceptingBookings }))}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      prefs.acceptingBookings ? 'bg-brand-700' : 'bg-neutral-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        prefs.acceptingBookings ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-900">Advance Booking (days)</label>
                  <input
                    type="number"
                    min={1}
                    value={prefs.advanceBookingDays}
                    onChange={(e) => setPrefs((p) => ({ ...p, advanceBookingDays: Number(e.target.value) }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-xs text-neutral-400 mt-1">How far ahead customers can book</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-900">Buffer Time (mins)</label>
                  <input
                    type="number"
                    min={0}
                    value={prefs.bufferTimeMins}
                    onChange={(e) => setPrefs((p) => ({ ...p, bufferTimeMins: Number(e.target.value) }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-xs text-neutral-400 mt-1">Time between bookings</p>
                </div>

                <button
                  onClick={handleSavePrefs}
                  disabled={updatePrefs.isPending}
                  className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
                >
                  {updatePrefs.isPending ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <AvailabilityContent />
    </ProtectedRoute>
  );
}