'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useCategories } from '@/hooks/useProviders';
import { useMyProviderProfile, useCreateService } from '@/hooks/useProviderOnboarding';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

function ServicesContent() {
  const { data: profile, isLoading } = useMyProviderProfile();
  const { data: categories } = useCategories();
  const createMutation = useCreateService();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ title: '', categoryId: '', price: '', durationMins: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.categoryId || !form.price || !form.durationMins) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(
      {
        categoryId: form.categoryId,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        durationMins: Number(form.durationMins),
      },
      {
        onSuccess: () => {
          toast.success('Service added');
          setForm({ title: '', categoryId: '', price: '', durationMins: '', description: '' });
        },
        onError: () => toast.error('Failed to add service'),
      },
    );
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/providers/me/services/${serviceId}`);
      queryClient.invalidateQueries({ queryKey: ['myProviderProfile'] });
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Services</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Manage your services and pricing</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden mb-4">
          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-neutral-400 text-left border-b border-neutral-100">
                  <th className="p-4">Service</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile?.services?.map((s: any) => (
                  <tr key={s.id} className="border-b border-neutral-50 last:border-0">
                    <td className="p-4 text-neutral-900 font-medium">{s.title}</td>
                    <td className="p-4 text-brand-700 font-semibold">PKR {s.price}</td>
                    <td className="p-4 text-neutral-600">{s.durationMins} mins</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(s.id)} className="text-danger-500 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {profile?.services?.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No services added yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Plus size={16} /> Add New Service
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-900">Service Name</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Kitchen Sink Repair"
                className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-900">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select category</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-900">Price (PKR)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 1200"
                className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-900">Duration (minutes)</label>
              <select
                value={form.durationMins}
                onChange={(e) => setForm({ ...form, durationMins: e.target.value })}
                className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select duration</option>
                <option value="30">30 mins</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-neutral-900">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your service..."
                className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ProviderServicesPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <ServicesContent />
    </ProtectedRoute>
  );
}