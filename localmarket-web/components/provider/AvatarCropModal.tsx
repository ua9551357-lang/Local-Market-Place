'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { X, ZoomIn } from 'lucide-react';

interface AvatarCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (file: File) => void;
}

// Crops the image on a canvas and returns a File
async function getCroppedImageFile(imageSrc: string, cropArea: Area, fileName: string): Promise<File> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Failed to crop image'));
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  });
}

export function AvatarCropModal({ imageSrc, onCancel, onSave }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, 'avatar.jpg');
      onSave(file);
    } catch (err) {
      console.error('Crop failed:', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-card w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900">Adjust Photo</h3>
          <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-72 bg-neutral-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <ZoomIn className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-brand-700"
          />
        </div>

        <div className="flex gap-3 px-4 pb-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium py-2.5 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}