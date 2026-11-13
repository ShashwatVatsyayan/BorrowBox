/**
 * BorrowBox Privacy-First Local & Campus Telemetry
 *
 * Designed exclusively for Chandigarh University campus audit & performance monitoring.
 * - Zero third-party tracker scripts (No Google Analytics, Meta Pixel, or marketing cookies)
 * - Zero personally identifiable commercial surveillance
 * - Respects student cookie/analytics consent preferences
 */

const STORAGE_CONSENT_KEY = 'borrowbox_cookie_consent';
const STORAGE_LOG_KEY = 'borrowbox_telemetry_events';
const MAX_LOCAL_EVENTS = 100;

export const CONSENT_STATUS = {
  ACCEPTED: 'all',
  ESSENTIAL: 'essential',
  UNDECIDED: 'undecided'
};

export const getConsent = () => {
  if (typeof window === 'undefined') return CONSENT_STATUS.ESSENTIAL;
  try {
    const saved = localStorage.getItem(STORAGE_CONSENT_KEY);
    if (saved === 'all' || saved === 'essential') return saved;
  } catch {
    // Ignore storage errors
  }
  return CONSENT_STATUS.UNDECIDED;
};

export const setConsent = (status) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CONSENT_KEY, status);
  } catch {
    // Ignore storage errors
  }
};

export const trackPageView = (path) => {
  if (typeof window === 'undefined') return;
  const consent = getConsent();
  if (consent === CONSENT_STATUS.ESSENTIAL) return;

  const event = {
    type: 'PAGE_VIEW',
    path: path || window.location.pathname,
    timestamp: new Date().toISOString()
  };

  recordLocalEvent(event);
};

export const trackEvent = (category, action, label = null, metadata = {}) => {
  if (typeof window === 'undefined') return;
  const consent = getConsent();
  if (consent === CONSENT_STATUS.ESSENTIAL) return;

  const event = {
    type: 'ACTION',
    category,
    action,
    label,
    metadata,
    timestamp: new Date().toISOString()
  };

  recordLocalEvent(event);
};

const recordLocalEvent = (event) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_LOG_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(event);
    if (events.length > MAX_LOCAL_EVENTS) {
      events.shift();
    }
    sessionStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(events));
  } catch {
    // Storage access may be restricted
  }
};

export default {
  getConsent,
  setConsent,
  trackPageView,
  trackEvent,
  CONSENT_STATUS
};
