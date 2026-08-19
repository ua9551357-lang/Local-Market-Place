'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { useMyProviderProfile, useUpdateProviderProfile, useUploadAvatar } from '@/hooks/useProviderOnboarding';
import { useCategories } from '@/hooks/useProviders';
import { getImageUrl } from '@/lib/image';

const CROP_SIZE = 260; // preview circle size (px)
const OUTPUT_SIZE = 400; // exported image size (px)

function AvatarCropModal({
  imageSrc,
  onCancel,
  onSave,
  isSaving,
}: {
  imageSrc: string;
  onCancel: () => void;
  onSave: (blob: Blob) => void;
  isSaving: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, startOffset: { x: 0, y: 0 } });

  const handleImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const { naturalWidth, naturalHeight } = img;
    const coverScale = Math.max(CROP_SIZE / naturalWidth, CROP_SIZE / naturalHeight);
    setImgSize({ width: naturalWidth * coverScale, height: naturalHeight * coverScale });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOffset: { ...offset } };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.startOffset.x + dx, y: dragState.current.startOffset.y + dy });
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img || !imgSize) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Circular clip so exported image matches the round avatar preview
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const ratio = OUTPUT_SIZE / CROP_SIZE;
    const drawWidth = imgSize.width * scale * ratio;
    const drawHeight = imgSize.height * scale * ratio;
    const drawX = OUTPUT_SIZE / 2 - drawWidth / 2 + offset.x * ratio;
    const drawY = OUTPUT_SIZE / 2 - drawHeight / 2 + offset.y * ratio;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    canvas.toBlob(
      (blob) => {
        if (blob) onSave(blob);
      },
      'image/png',
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-card p-5 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Edit photo</h3>
        <p className="text-xs text-neutral-400 mb-3">Drag to reposition, use the slider to zoom</p>

        <div
          className="relative mx-auto rounded-full overflow-hidden bg-neutral-100 cursor-move touch-none select-none"
          style={{ width: CROP_SIZE, height: CROP_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            draggable={false}
            onLoad={handleImgLoad}
            className="absolute top-1/2 left-1/2 max-w-none pointer-events-none"
            style={{
              opacity: imgSize ? 1 : 0,
              width: imgSize ? imgSize.width * scale : CROP_SIZE,
              height: imgSize ? imgSize.height * scale : CROP_SIZE,
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
            }}
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none" />
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-neutral-900">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !imgSize}
            className="flex-1 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { data: profile, isLoading } = useMyProviderProfile();
  const { data: categories } = useCategories();
  const updateMutation = useUpdateProviderProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ bio: '', experienceYears: 0, priceFrom: 0, location: '', categoryId: '' });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio || '',
        experienceYears: profile.experienceYears,
        priceFrom: Number(profile.priceFrom),
        location: profile.location || '',
        categoryId: profile.categoryId,
      });
    }
  }, [profile]);

  // Clean up the object URL when it's no longer needed
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => toast.success('Profile updated'),
      onError: () => toast.error('Failed to update profile'),
    });
  };

  // Step 1: file selected -> just open the crop modal, do NOT upload yet
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setShowCropModal(true);
  };

  const closeCropModal = () => {
    setShowCropModal(false);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  // Step 2: user edits + hits "Save photo" -> upload only now
  const handleCropSave = (blob: Blob) => {
    const croppedFile = new File([blob], 'avatar.png', { type: 'image/png' });
    uploadAvatar.mutate(croppedFile, {
      onSuccess: () => {
        toast.success('Profile photo updated');
        closeCropModal();
      },
      onError: () => toast.error('Failed to upload photo'),
    });
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Profile</h1>
        <p className="text-sm text-neutral-400 mb-4">Manage your business profile and information</p>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : !profile ? (
          <p className="text-sm text-danger-500">Failed to load profile. Please refresh the page.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl overflow-hidden">
                    {profile.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(profile.user.avatarUrl)!}
                        alt={profile.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.user.name.charAt(0)
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatar.isPending}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-700 hover:bg-brand-600 text-white flex items-center justify-center shadow-card disabled:opacity-60"
                  >
                    <Camera size={12} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{profile.user.name}</p>
                  <p className="text-xs text-neutral-400">{profile.user.email}</p>
                  {uploadAvatar.isPending && <p className="text-xs text-brand-700 mt-0.5">Uploading...</p>}
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="text-neutral-600">📞 {profile.user.phone || '—'}</p>
                <p className="text-neutral-600">📍 {profile.location}</p>
                <p className="text-neutral-600">⭐ {profile.rating} ({profile.reviewCount} reviews)</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Business Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-neutral-900">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-900">Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-900">Experience (years)</label>
                    <input
                      type="number"
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                      className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-900">Starting Price (PKR)</label>
                    <input
                      type="number"
                      value={form.priceFrom}
                      onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })}
                      className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-900">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showCropModal && avatarPreview && (
        <AvatarCropModal
          key={avatarPreview}
          imageSrc={avatarPreview}
          onCancel={closeCropModal}
          onSave={handleCropSave}
          isSaving={uploadAvatar.isPending}
        />
      )}
    </div>
  );
}

export default function ProviderProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}