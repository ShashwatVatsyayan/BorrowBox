import React, { useState } from 'react';
import { CATEGORIES, CONDITIONS, LISTING_TYPES, LENDING_DURATIONS } from '../../utils/constants';
import { validateItemForm } from '../../utils/validators';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ImageUploader } from './ImageUploader';
import { ArrowLeftRight, Clock, HelpCircle, PackagePlus } from 'lucide-react';

export const ItemForm = ({ initialValues, onSubmit, submitLabel = 'Publish Listing', loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    category: initialValues?.category || CATEGORIES[0],
    condition: initialValues?.condition || CONDITIONS[0],
    location_label: initialValues?.location_label || '',
    images: initialValues?.images || [],
    listing_type: initialValues?.listing_type || 'borrow',
    lending_duration: initialValues?.lending_duration || LENDING_DURATIONS[1],
    trade_preference: initialValues?.trade_preference || '',
    needed_by: initialValues?.needed_by || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateItemForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-surface-card p-5 sm:p-6 rounded-2xl border border-surface-border shadow-xs">
      {/* Listing Purpose Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Listing Intent / Purpose <span className="text-state-danger">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {LISTING_TYPES.map((type) => {
            const isSelected = formData.listing_type === type.id;
            return (
              <button
                type="button"
                key={type.id}
                onClick={() => handleChange('listing_type', type.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-950/30 ring-1 ring-brand-600'
                    : 'border-surface-border bg-surface-card hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-ink-primary">{type.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-brand-600"></span>}
                  </div>
                  <p className="text-[11px] text-ink-muted leading-tight">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <Input
        label="Item Title"
        id="title"
        placeholder={
          formData.listing_type === 'wanted'
            ? 'e.g. Looking for Formal Blazer Size 40 for Campus Placement'
            : 'e.g. Casio fx-991EX ClassWiz Calculator or Zara Formal Shoes'
        }
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        helperText="Include brand, size, model, or edition"
      />

      {/* Duration or Trade Details based on Listing Type */}
      {formData.listing_type === 'borrow' && (
        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <label htmlFor="lending_duration" className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
            <Clock size={14} />
            <span>Allowed Borrowing Duration (Lending Time)</span>
          </label>
          <select
            id="lending_duration"
            value={formData.lending_duration}
            onChange={(e) => handleChange('lending_duration', e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-surface-card text-ink-primary text-sm outline-none focus:border-emerald-600"
          >
            {LENDING_DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
            Borrowers will be prompted to select return dates within this maximum lending period.
          </p>
        </div>
      )}

      {formData.listing_type === 'trade' && (
        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <label htmlFor="trade_preference" className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <ArrowLeftRight size={14} />
            <span>Trade / Barter Preference <span className="text-state-danger">*</span></span>
          </label>
          <input
            id="trade_preference"
            type="text"
            placeholder="e.g. Willing to trade formal shoes (UK 9) for interview blazer (size 40) or kettle"
            value={formData.trade_preference}
            onChange={(e) => handleChange('trade_preference', e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-surface-card text-ink-primary text-sm outline-none focus:border-amber-600"
          />
          {errors.trade_preference && (
            <span className="text-xs text-state-danger font-medium">{errors.trade_preference}</span>
          )}
          <p className="text-[11px] text-amber-700 dark:text-amber-300">
            Specify what items, clothes, or appliances you would accept in barter. All peer trades are direct student agreements.
          </p>
        </div>
      )}

      {formData.listing_type === 'wanted' && (
        <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
          <label htmlFor="needed_by" className="text-xs font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-1.5">
            <HelpCircle size={14} />
            <span>Needed By Date / Context</span>
          </label>
          <input
            id="needed_by"
            type="text"
            placeholder="e.g. Needed by Friday for TCS placement interview or Chemistry lab on Monday"
            value={formData.needed_by}
            onChange={(e) => handleChange('needed_by', e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-surface-card text-ink-primary text-sm outline-none focus:border-indigo-600"
          />
          <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
            Let campus students know the urgency or reason for your request.
          </p>
        </div>
      )}

      {/* Category & Condition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Category <span className="text-state-danger">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-surface-border bg-surface-card text-ink-primary text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-state-danger font-medium">{errors.category}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="condition" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Physical Condition <span className="text-state-danger">*</span>
          </label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-surface-border bg-surface-card text-ink-primary text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.condition && <span className="text-xs text-state-danger font-medium">{errors.condition}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Item Description <span className="text-state-danger">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe physical condition, size, included cables/accessories, textbook edition, or any usage instructions..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-card text-ink-primary placeholder:text-ink-light text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-y ${
            errors.description ? 'border-state-danger' : 'border-surface-border'
          }`}
        />
        {errors.description && <span className="text-xs text-state-danger font-medium">{errors.description}</span>}
      </div>

      {/* Location */}
      <Input
        label="Designated Campus Meeting Area"
        id="location_label"
        placeholder="e.g. Academic Block B3, Central Library Gate, or Student Center"
        value={formData.location_label}
        onChange={(e) => handleChange('location_label', e.target.value)}
        error={errors.location_label}
        required
        helperText="Specify public campus landmarks only. Never share private hostel room numbers."
      />

      {/* 4-Angle Photos (Top, Bottom, Sides) */}
      <ImageUploader
        images={formData.images}
        onChange={(imgs) => handleChange('images', imgs)}
        error={errors.images}
      />

      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
