import React, { useRef, useState } from 'react';
import { Camera, Upload, Link as LinkIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

const REQUIRED_ANGLES = [
  { id: 0, label: 'Top / Front View', hint: 'Clear overall angle showing item front or top' },
  { id: 1, label: 'Bottom / Base View', hint: 'Underside, soles, base plate, or model serial' },
  { id: 2, label: 'Left Side View', hint: 'Left profile, seams, buttons, or ports' },
  { id: 3, label: 'Right Side / Detail View', hint: 'Right profile, accessories, or condition close-up' }
];

export const ImageUploader = ({ images = [], onChange, error = null }) => {
  const fileInputRefs = useRef([]);
  const [processingIndex, setProcessingIndex] = useState(null);

  const handleFileSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    setProcessingIndex(index);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.78);
      const newImages = [...(images || [])];
      while (newImages.length <= index) {
        newImages.push('');
      }
      newImages[index] = compressedDataUrl;
      onChange(newImages);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Failed to process image: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingIndex(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleUrlAdd = (index) => {
    const url = window.prompt(`Enter direct image URL for ${REQUIRED_ANGLES[index].label}:`);
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'))) {
      const newImages = [...(images || [])];
      while (newImages.length <= index) {
        newImages.push('');
      }
      newImages[index] = url.trim();
      onChange(newImages);
    }
  };

  const handleRemove = (index) => {
    const newImages = [...(images || [])];
    if (newImages[index]) {
      newImages[index] = '';
      onChange(newImages);
    }
  };

  const handleFillDemoAngles = () => {
    onChange([
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ]);
  };

  const validImages = (images || []).filter((img) => typeof img === 'string' && img.trim().length > 0);
  const count = validImages.length;
  const isComplete = count >= 4;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Required Item Photos ({count} / 4 Angles) <span className="text-state-danger">*</span>
        </label>
        <button
          type="button"
          onClick={handleFillDemoAngles}
          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 underline"
        >
          Insert 4 Sample Campus Photos
        </button>
      </div>

      <p className="text-xs text-ink-muted">
        To protect both listers and borrowers, upload at least 4 clear photos showing the <b>top, bottom, and both side angles</b> of the physical item. Photos are automatically compressed to ensure instant loading.
      </p>

      {/* 4 Angle Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REQUIRED_ANGLES.map((angle, idx) => {
          const imgUrl = images?.[idx];
          const hasImage = typeof imgUrl === 'string' && imgUrl.trim().length > 0;
          const isCurrentProcessing = processingIndex === idx;

          return (
            <div
              key={angle.id}
              className={`relative flex flex-col rounded-xl border overflow-hidden bg-surface-card transition-all ${
                hasImage
                  ? 'border-emerald-300 dark:border-emerald-800'
                  : 'border-dashed border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {isCurrentProcessing ? (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Loader2 size={24} className="animate-spin text-brand-600 mb-1" />
                    <span className="text-[11px] font-bold text-ink-primary">Optimizing...</span>
                    <span className="text-[9px] text-ink-muted mt-0.5">Compressing photo</span>
                  </div>
                ) : hasImage ? (
                  <>
                    <img src={imgUrl} alt={angle.label} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-ink-primary/70 text-white hover:bg-state-danger transition-colors shadow-xs"
                      title="Remove angle"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                      <CheckCircle2 size={10} />
                      <span>Saved</span>
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Camera size={24} className="text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-ink-primary">{angle.label}</span>
                    <span className="text-[9px] text-ink-muted mt-0.5 leading-tight">{angle.hint}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for slot */}
              {!hasImage && !isCurrentProcessing && (
                <div className="p-1.5 flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border-t border-surface-border">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    onChange={(e) => handleFileSelect(idx, e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    className="flex-1 py-1 px-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1"
                  >
                    <Upload size={10} />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUrlAdd(idx)}
                    className="py-1 px-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1"
                  >
                    <LinkIcon size={10} />
                    <span>URL</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-state-danger font-medium mt-1">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isComplete ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-0.5">
          <CheckCircle2 size={14} />
          <span>All 4 physical angles (top, bottom, left, right) verified.</span>
        </div>
      ) : (
        <span className="text-[11px] text-ink-muted">
          Missing {4 - count} required angle photo{4 - count !== 1 ? 's' : ''}.
        </span>
      )}
    </div>
  );
};

export default ImageUploader;
