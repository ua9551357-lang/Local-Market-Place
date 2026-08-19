'use client';

import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, User, Mail, Lock, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCategories } from '@/hooks/useProviders';
import { VoiceFillButton } from '@/components/voice/VoiceFillButton';
import { AvatarCropModal } from '@/components/provider/AvatarCropModal';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface RegisterProviderForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  categoryId: string;
  bio: string;
  experienceYears: number;
  priceFrom: number;
}

export default function ApplyProviderPage() {
  const { data: categories } = useCategories();
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState<RegisterProviderForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    categoryId: '',
    bio: '',
    experienceYears: 1,
    priceFrom: 500,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterProviderForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'confirmPassword') formData.append(key, String(value));
      });
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data: response } = await api.post('/auth/register-provider', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setSubmitted(true);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawImageSrc(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleCropSave = (croppedFile: File) => {
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedFile));
    setRawImageSrc(null);
  };

  const handleCropCancel = () => {
    setRawImageSrc(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (!form.categoryId) {
      setFormError('Please select a service category');
      return;
    }

    registerMutation.mutate(form);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-4">
            ⏳
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Application Submitted!</h1>
          <p className="text-sm text-neutral-600 mt-2">
            Your account has been created and your provider application is pending review.
            Our admin team will review it shortly — you&apos;ll get a notification once it&apos;s
            approved and you can start receiving bookings.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-full bg-brand-50 items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 text-brand-700" />
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">Join as a Service Provider</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Create your account and apply in one step. Your application will be reviewed by our team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-neutral-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-700 hover:bg-brand-600 text-white flex items-center justify-center shadow-card"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Account details */}
          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-900">Full Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Umair Khan"
                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <VoiceFillButton onResult={(text) => setForm((f) => ({ ...f, name: text }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-900">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-900">Phone Number</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-900">Password</label>
                  <input
                    required
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-900">Confirm Password</label>
                  <input
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-900">Full Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House 12, Street 5, Satellite Town"
                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <VoiceFillButton onResult={(text) => setForm((f) => ({ ...f, address: text }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-900">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Rawalpindi"
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Provider details */}
          <div className="bg-white border border-neutral-200 rounded-card p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Provider Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-900">Service Category</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-900">Bio</label>
                <div className="flex items-start gap-2 mt-1">
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell customers about your experience..."
                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                  <VoiceFillButton onResult={(text) => setForm((f) => ({ ...f, bio: text }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-900">Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-900">Starting Price (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.priceFrom}
                    onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {(formError || registerMutation.isError) && (
            <p className="text-xs text-danger-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError || (registerMutation.error as any)?.response?.data?.message || 'Something went wrong'}
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-brand-700 hover:bg-brand-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {registerMutation.isPending ? 'Submitting...' : 'Create Account & Submit Application'}
          </button>

          <p className="text-xs text-neutral-400 text-center bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5">
            💡 Tip: Tap the mic icon next to Name, Address, or Bio to fill them using your voice instead of typing.
          </p>
        </form>
      </main>
      <Footer />

      {rawImageSrc && (
        <AvatarCropModal
          imageSrc={rawImageSrc}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
      )}
    </>
  );
}