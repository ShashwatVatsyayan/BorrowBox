import { CATEGORIES, CONDITIONS, DEFAULT_ALLOWED_DOMAINS } from './constants';

export const validateEmail = (email, allowedDomains = DEFAULT_ALLOWED_DOMAINS) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (allowedDomains && allowedDomains.length > 0) {
    const isAllowed = allowedDomains.some((d) => domain === d.toLowerCase() || domain.endsWith(`.${d.toLowerCase()}`));
    if (!isAllowed) {
      return {
        valid: false,
        error: `Please use your official university email (e.g. @${allowedDomains[0]}).`
      };
    }
  }

  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  return { valid: true };
};

export const validateItemForm = (values) => {
  const errors = {};
  if (!values.title || values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (values.title.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  } else if (values.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters.';
  }

  if (!values.category || !CATEGORIES.includes(values.category)) {
    errors.category = 'Please select a valid category.';
  }

  if (!values.condition || !CONDITIONS.includes(values.condition)) {
    errors.condition = 'Please select a valid condition.';
  }

  if (!values.location_label || values.location_label.trim().length < 2) {
    errors.location_label = 'Please specify a general campus pickup area.';
  }

  if (!values.images || values.images.length < 4) {
    errors.images = 'Please provide at least 4 photos showing the top, bottom, left side, and right side views of the item.';
  }

  if (values.listing_type === 'trade' && (!values.trade_preference || values.trade_preference.trim().length < 3)) {
    errors.trade_preference = 'Please specify what items or gear you are looking to trade or swap for.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBorrowDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Start date and end date are both required.' };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, error: 'Start date cannot be in the past.' };
  }

  if (start > end) {
    return { valid: false, error: 'Start date must be on or before end date.' };
  }

  // Maximum borrowing duration: 60 days
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (diffDays > 60) {
    return { valid: false, error: 'Borrowing duration cannot exceed 60 days.' };
  }

  return { valid: true };
};

