import { CATEGORIES, CONDITIONS, DEFAULT_ALLOWED_DOMAINS } from './constants.js';

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

/**
 * Evaluates individual password complexity criteria.
 * Rules:
 * 1. Minimum 8 characters long
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one lowercase letter (a-z)
 * 4. At least one number (0-9)
 * 5. At least one special character (!@#$%^&*...)
 */
export const getPasswordCriteria = (password = '') => {
  const p = typeof password === 'string' ? password : '';
  return {
    minLength: p.length >= 8,
    hasUpper: /[A-Z]/.test(p),
    hasLower: /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`';]/.test(p)
  };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      error: 'Password is required.',
      criteria: {
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false
      }
    };
  }

  const criteria = getPasswordCriteria(password);

  if (!criteria.minLength) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long.',
      criteria
    };
  }
  if (!criteria.hasUpper) {
    return {
      valid: false,
      error: 'Password must contain at least one capital letter (A-Z).',
      criteria
    };
  }
  if (!criteria.hasLower) {
    return {
      valid: false,
      error: 'Password must contain at least one small letter (a-z).',
      criteria
    };
  }
  if (!criteria.hasNumber) {
    return {
      valid: false,
      error: 'Password must contain at least one number (0-9).',
      criteria
    };
  }
  if (!criteria.hasSpecial) {
    return {
      valid: false,
      error: 'Password must contain at least one special character (e.g. !@#$%^&*).',
      criteria
    };
  }

  return { valid: true, criteria };
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

