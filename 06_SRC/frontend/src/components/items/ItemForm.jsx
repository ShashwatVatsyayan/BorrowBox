import React, { useState } from 'react';
import { CATEGORIES, CONDITIONS } from '../../utils/constants';
import { validateItemForm } from '../../utils/validators';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ImageUploader } from './ImageUploader';

export const ItemForm = ({ initialValues, onSubmit, submitLabel = 'Publish Listing', loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    category: initialValues?.category || CATEGORIES[0],
    condition: initialValues?.condition || CONDITIONS[0],
    location_label: initialValues?.location_label || '',
    images: initialValues?.images || []
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
      {/* Title */}
      <Input
        label="Item Title"
        id="title"
        placeholder="e.g. Casio fx-991EX ClassWiz Calculator"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        helperText="Include model number, brand, or edition"
      />

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
            Condition <span className="text-state-danger">*</span>
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
          Description <span className="text-state-danger">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe condition, included accessories, battery status, textbook highlights, or specific lending expectations..."
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
        label="Campus Pickup Area"
        id="location_label"
        placeholder="e.g. Block B-3, Academic Block or North Library Ground Floor"
        value={formData.location_label}
        onChange={(e) => handleChange('location_label', e.target.value)}
        error={errors.location_label}
        required
        helperText="Specify general campus area only. Do not share room numbers or private hostel rooms publicly."
      />

      {/* Image Uploader */}
      <ImageUploader
        images={formData.images}
        onChange={(imgs) => handleChange('images', imgs)}
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

