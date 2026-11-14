/**
 * BorrowBox Sliding Window Client-Side Rate Limiter
 * Provides throttling for authentication, email verification, API queries, and marketplace actions.
 * Configurable dynamically from the Admin Command Console.
 */

const DEFAULT_RULES = {
  auth: { maxRequests: 5, windowMs: 60 * 1000, label: 'Authentication Attempts' },
  resend: { maxRequests: 2, windowMs: 60 * 1000, label: 'Email Confirmation Resends' },
  api: { maxRequests: 60, windowMs: 60 * 1000, label: 'General API & Search Calls' },
  action: { maxRequests: 10, windowMs: 60 * 1000, label: 'Item & Request Mutations' }
};

class RateLimiter {
  constructor() {
    this.rules = { ...DEFAULT_RULES };
    this.history = new Map(); // key -> array of timestamps
    this.blockedEvents = [];  // audit log of throttle incidents
    this.enabled = true;
  }

  _getKey(bucket, identifier = 'global') {
    return `${bucket}:${identifier.trim().toLowerCase()}`;
  }

  _cleanOldRequests(key, windowMs) {
    const now = Date.now();
    const timestamps = this.history.get(key) || [];
    const valid = timestamps.filter((time) => now - time < windowMs);
    this.history.set(key, valid);
    return valid;
  }

  check(bucket, identifier = 'global') {
    if (!this.enabled) return { allowed: true, remaining: 999, resetInSeconds: 0 };

    const rule = this.rules[bucket] || this.rules.api;
    const key = this._getKey(bucket, identifier);
    const validTimestamps = this._cleanOldRequests(key, rule.windowMs);

    const remaining = Math.max(0, rule.maxRequests - validTimestamps.length);
    const oldest = validTimestamps[0] || Date.now();
    const resetInSeconds = Math.max(0, Math.ceil((oldest + rule.windowMs - Date.now()) / 1000));

    const allowed = validTimestamps.length < rule.maxRequests;

    return {
      allowed,
      remaining,
      resetInSeconds,
      limit: rule.maxRequests
    };
  }

  consume(bucket, identifier = 'global') {
    if (!this.enabled) return true;

    const checkResult = this.check(bucket, identifier);
    const rule = this.rules[bucket] || this.rules.api;
    const key = this._getKey(bucket, identifier);

    if (!checkResult.allowed) {
      const incident = {
        id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bucket,
        identifier,
        timestamp: new Date().toISOString(),
        resetInSeconds: checkResult.resetInSeconds
      };
      this.blockedEvents.unshift(incident);
      if (this.blockedEvents.length > 50) this.blockedEvents.pop();

      const err = new Error(
        `Rate limit exceeded for ${rule.label}. Please wait ${checkResult.resetInSeconds} second(s) before trying again.`
      );
      err.code = 'RATE_LIMIT_EXCEEDED';
      err.resetInSeconds = checkResult.resetInSeconds;
      throw err;
    }

    const timestamps = this.history.get(key) || [];
    timestamps.push(Date.now());
    this.history.set(key, timestamps);
    return true;
  }

  reset(bucket, identifier) {
    if (bucket && identifier) {
      this.history.delete(this._getKey(bucket, identifier));
    } else if (bucket) {
      for (const k of this.history.keys()) {
        if (k.startsWith(`${bucket}:`)) this.history.delete(k);
      }
    } else {
      this.history.clear();
      this.blockedEvents = [];
    }
  }

  updateRule(bucket, maxRequests, windowMs) {
    if (this.rules[bucket]) {
      this.rules[bucket] = {
        ...this.rules[bucket],
        maxRequests: Number(maxRequests) || this.rules[bucket].maxRequests,
        windowMs: Number(windowMs) || this.rules[bucket].windowMs
      };
    }
  }

  setEnabled(status) {
    this.enabled = Boolean(status);
  }

  getTelemetry() {
    let totalTrackedKeys = 0;
    let activeThrottledCount = 0;

    for (const [key, timestamps] of this.history.entries()) {
      totalTrackedKeys++;
      const [bucket] = key.split(':');
      const rule = this.rules[bucket] || this.rules.api;
      if (timestamps.length >= rule.maxRequests) {
        activeThrottledCount++;
      }
    }

    return {
      enabled: this.enabled,
      rules: this.rules,
      totalTrackedKeys,
      activeThrottledCount,
      recentIncidents: [...this.blockedEvents]
    };
  }
}

export const rateLimiter = new RateLimiter();
export default rateLimiter;

