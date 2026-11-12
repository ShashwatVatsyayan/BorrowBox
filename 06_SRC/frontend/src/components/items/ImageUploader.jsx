import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

export const ImageUploader = ({ images = [], onChange }) => {
  const handleUrlAdd = () => {
    const url = window.prompt('Enter image URL (Unsplash or direct image link):');
    if (url && url.startsWith('http')) {
      onChange([...images, url]);
    }
  };

  const handleRemove = (index) => {
    const filtered = images.filter((_, i) => i !== index);
    onChange(filtered);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Item Photos
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg border border-surface-border overflow-hidden group bg-slate-100">
            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 p-1 rounded-full bg-ink-primary/70 text-white hover:bg-state-danger transition-colors"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <button
            type="button"
            onClick={handleUrlAdd}
            className="flex flex-col items-center justify-center aspect-square rounded-lg border border-dashed border-slate-300 hover:border-brand-600 bg-slate-50 hover:bg-brand-50/30 text-ink-muted hover:text-brand-600 transition-colors p-2 text-center"
          >
            <ImageIcon size={20} className="mb-1" />
            <span className="text-[11px] font-medium">+ Add Photo</span>
          </button>
        )}
      </div>
      <p className="text-[11px] text-ink-muted">Add up to 4 photos. Provide clear images of the actual item.</p>
    </div>
  );
};

