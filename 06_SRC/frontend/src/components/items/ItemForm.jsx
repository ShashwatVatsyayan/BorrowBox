import React, { useState } from 'react';
import {
  CATEGORIES,
  CONDITIONS,
  LISTING_TYPES,
  CATEGORY_PRICE_LIMITS,
  MIN_RENTAL_PRICE,
  RENTAL_DURATIONS
} from '../../utils/constants';
import { validateItemForm, validateRentalPrice, calculateRentalPricing } from '../../utils/validators';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ImageUploader } from './ImageUploader';
import { ArrowLeftRight, Clock, HelpCircle, IndianRupee, Tag, ShieldCheck, AlertCircle } from 'lucide-react';

export const ItemForm = ({ initialValues, onSubmit, submitLabel = 'Publish Rental Listing', loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    category: initialValues?.category || CATEGORIES[0],
    condition: initialValues?.condition || CONDITIONS[0],
    location_label: initialValues?.location_label || '',
    images: initialValues?.images || [],
    listing_type: initialValues?.listing_type || 'rent',
    daily_price: initialValues?.daily_price !== undefined ? initialValues.daily_price : (CATEGORY_PRICE_LIMITS[initialValues?.category || CATEGORIES[0]] || 15),
    budget_per_day: initialValues?.budget_per_day || '',
    preferred_duration_days: initialValues?.preferred_duration_days || 3,
    rental_durations: initialValues?.rental_durations || ['1 day', '3 days', '7 days', '14 days'],
    discount_3d: initialValues?.duration_discounts?.['3'] || 5,
    discount_7d: initialValues?.duration_discounts?.['7'] || 10,
    discount_14d: initialValues?.duration_discounts?.['14'] || 15,
    trade_preference: initialValues?.trade_preference || '',
    trade_item_desired: initialValues?.trade_item_desired || '',
    is_permanent_trade: initialValues?.is_permanent_trade !== undefined ? initialValues.is_permanent_trade : true,
    needed_by: initialValues?.needed_by || ''
  });

  const [errors, setErrors] = useState({});

  const currentCategoryLimit = CATEGORY_PRICE_LIMITS[formData.category] || 50;

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // When category changes, adjust daily_price if it exceeds new category limit
      if (field === 'category') {
        const newMax = CATEGORY_PRICE_LIMITS[value] || 50;
        if (Number(next.daily_price) > newMax) {
          next.daily_price = newMax;
        }
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePriceChange = (val) => {
    const num = Number(val);
    handleChange('daily_price', val);
    const validation = validateRentalPrice(val, formData.category);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, daily_price: validation.error }));
    } else {
      setErrors((prev) => ({ ...prev, daily_price: null }));
    }
  };

  const handleBudgetChange = (val) => {
    handleChange('budget_per_day', val);
    if (val) {
      const validation = validateRentalPrice(val, formData.category);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, budget_per_day: validation.error }));
      } else {
        setErrors((prev) => ({ ...prev, budget_per_day: null }));
      }
    } else {
      setErrors((prev) => ({ ...prev, budget_per_day: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanImages = (formData.images || []).filter((img) => typeof img === 'string' && img.trim().length > 0);
    const dataToValidate = {
      ...formData,
      images: cleanImages
    };

    const result = validateItemForm(dataToValidate);
    if (!result.valid) {
      setErrors(result.errors);
      // Scroll to top of form smoothly to show error banner
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const payload = {
      ...formData,
      images: cleanImages,
      daily_price: Number(formData.daily_price) || 15,
      budget_per_day: formData.budget_per_day ? Number(formData.budget_per_day) : null,
      duration_discounts: {
        '3': Number(formData.discount_3d) || 0,
        '7': Number(formData.discount_7d) || 0,
        '14': Number(formData.discount_14d) || 0
      }
    };

    onSubmit(payload);
  };

  const samplePricing = calculateRentalPricing(formData.daily_price, 3, formData.discount_3d);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-surface-card p-5 sm:p-6 rounded-2xl border border-surface-border shadow-xs">
      {Object.keys(errors).length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-state-danger text-xs flex items-center gap-2.5 shadow-xs">
          <AlertCircle size={18} className="shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold">Please complete all required listing fields:</span>
            <span className="text-[11px] opacity-90">
              {Object.values(errors).filter(Boolean).join(' • ')}
            </span>
          </div>
        </div>
      )}

      {/* Listing Purpose Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Listing Intent / Purpose <span className="text-state-danger">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {LISTING_TYPES.map((type) => {
            const isSelected = formData.listing_type === type.id || (type.id === 'rent' && formData.listing_type === 'borrow');
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
            ? 'e.g. Casio-compatible scientific calculator required for examinations'
            : 'e.g. Casio fx-991EX ClassWiz Calculator or Zara Placement Blazer'
        }
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        helperText="Include brand, size, model, or edition"
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

      {/* RENTAL PRICING & LIMITS SYSTEM */}
      {(formData.listing_type === 'rent' || formData.listing_type === 'borrow') && (
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Tag size={14} className="text-[#D4A853]" />
              <span>Rental Pricing &amp; Category Ceiling</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
              Max for {formData.category}: INR {currentCategoryLimit}/day
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="daily_price" className="text-xs font-semibold text-ink-primary flex items-center justify-between">
                <span>Daily Rental Price (INR / day) <span className="text-state-danger">*</span></span>
                <span className="text-[11px] text-ink-muted">Min: INR {MIN_RENTAL_PRICE}/day</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-ink-muted">INR</span>
                <input
                  id="daily_price"
                  type="number"
                  min={MIN_RENTAL_PRICE}
                  max={currentCategoryLimit}
                  step="1"
                  value={formData.daily_price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={`w-full min-h-[42px] pl-11 pr-3.5 py-2 rounded-lg border bg-surface-card text-ink-primary text-sm font-semibold outline-none focus:ring-1 ${
                    errors.daily_price ? 'border-state-danger focus:border-state-danger' : 'border-emerald-300 dark:border-emerald-700 focus:border-emerald-600'
                  }`}
                  required
                />
              </div>
              {errors.daily_price ? (
                <span className="text-xs text-state-danger font-medium leading-tight">{errors.daily_price}</span>
              ) : (
                <p className="text-[11px] text-ink-muted">
                  Maximum allowed for {formData.category} is INR {currentCategoryLimit}/day.
                </p>
              )}
            </div>

            {/* Split Breakdown Preview */}
            <div className="p-3 rounded-lg bg-surface-card border border-surface-border text-xs flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-ink-muted mb-1">Rental Earnings Split (Default 20% platform commission):</span>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-ink-muted">Owner Receives (80%):</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  INR {Math.round((Number(formData.daily_price) || 0) * 0.8)} / day
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-ink-muted">BorrowBox Platform Fee (20%):</span>
                <span className="font-medium text-ink-muted">
                  INR {Math.round((Number(formData.daily_price) || 0) * 0.2)} / day
                </span>
              </div>
            </div>
          </div>

          {/* Duration Discounts */}
          <div className="pt-2 border-t border-emerald-200/40 dark:border-emerald-800/40">
            <label className="text-xs font-bold text-ink-primary block mb-2">
              Multi-Day Rental Discounts (Encourage longer rentals)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-ink-muted font-medium">3 Days Discount</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formData.discount_3d}
                    onChange={(e) => handleChange('discount_3d', e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-center"
                  />
                  <span className="ml-1 text-xs text-ink-muted">%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-ink-muted font-medium">7 Days Discount</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.discount_7d}
                    onChange={(e) => handleChange('discount_7d', e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-center"
                  />
                  <span className="ml-1 text-xs text-ink-muted">%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-ink-muted font-medium">14 Days Discount</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.discount_14d}
                    onChange={(e) => handleChange('discount_14d', e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-center"
                  />
                  <span className="ml-1 text-xs text-ink-muted">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WANTED REQUEST WORKFLOW */}
      {formData.listing_type === 'wanted' && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#D4A853]" />
              <span>Request an Item — Student Rental Request</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
              Max limit: INR {currentCategoryLimit}/day
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="budget_per_day" className="text-xs font-semibold text-ink-primary">
                Your Maximum Daily Budget (INR / day) <span className="text-state-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-ink-muted">INR</span>
                <input
                  id="budget_per_day"
                  type="number"
                  min={MIN_RENTAL_PRICE}
                  max={currentCategoryLimit}
                  value={formData.budget_per_day}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder={`e.g. ${Math.min(20, currentCategoryLimit)}`}
                  className={`w-full min-h-[42px] pl-11 pr-3.5 py-2 rounded-lg border bg-surface-card text-ink-primary text-sm font-semibold outline-none ${
                    errors.budget_per_day ? 'border-state-danger' : 'border-emerald-300 dark:border-emerald-700'
                  }`}
                  required
                />
              </div>
              {errors.budget_per_day ? (
                <span className="text-xs text-state-danger font-medium leading-tight">{errors.budget_per_day}</span>
              ) : (
                <p className="text-[11px] text-ink-muted">
                  Cannot exceed the category ceiling (INR {currentCategoryLimit}/day).
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="needed_by" className="text-xs font-semibold text-ink-primary">
                Required By Date / Urgency
              </label>
              <input
                id="needed_by"
                type="text"
                placeholder="e.g. Needed by Friday afternoon for exam"
                value={formData.needed_by}
                onChange={(e) => handleChange('needed_by', e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-surface-border bg-surface-card text-ink-primary text-sm outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TRADE / BARTER PROPOSAL */}
      {formData.listing_type === 'trade' && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-950/5 dark:bg-emerald-950/30 border border-[#D4A853]/40">
          <div className="flex items-center justify-between border-b border-[#D4A853]/25 pb-2">
            <span className="text-xs font-bold text-[#916C16] dark:text-[#E8CA7A] flex items-center gap-1.5">
              <ArrowLeftRight size={14} className="text-[#D4A853]" />
              <span>Available for Trade / Barter</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#080C0A] bg-[#D4A853] px-2 py-0.5 rounded">
              Barter Negotiation
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trade_item_desired" className="text-xs font-semibold text-ink-primary">
              What specific item will you trade this for? <span className="text-state-danger">*</span>
            </label>
            <input
              id="trade_item_desired"
              type="text"
              placeholder="e.g. Casio fx-991CW Calculator, Formal Blazer Size 40, or Mini Drafter"
              value={formData.trade_item_desired}
              onChange={(e) => {
                handleChange('trade_item_desired', e.target.value);
                if (!formData.trade_preference) {
                  handleChange('trade_preference', e.target.value);
                }
              }}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D4A853]/40 bg-surface-card text-ink-primary text-sm outline-none focus:border-[#D4A853]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trade_preference" className="text-xs font-semibold text-ink-primary">
              Additional Barter Notes / Alternatives Accepted
            </label>
            <input
              id="trade_preference"
              type="text"
              placeholder="e.g. Also open to electric kettle, lab coat, or course notes"
              value={formData.trade_preference}
              onChange={(e) => handleChange('trade_preference', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-surface-border bg-surface-card text-ink-primary text-sm outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.is_permanent_trade}
              onChange={(e) => handleChange('is_permanent_trade', e.target.checked)}
              className="rounded border-[#D4A853] text-[#0F382A] focus:ring-[#D4A853]"
            />
            <span className="text-xs text-ink-primary font-medium">
              Permanent Ownership Trade (Permanent swap - no return required)
            </span>
          </label>
        </div>
      )}

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Item Description <span className="text-state-danger">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe physical condition, size, accessories, textbook edition, or rental instructions..."
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
