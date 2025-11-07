//
// PUBLIC_INTERFACE
// Centralized configuration utilities for environment variables and feature flags.
//
// Exposes helpers for reading API base URL, environment, log level, feature flags,
// and healthcheck path with safe defaults and parsing.
//
// Environment variables (expected in CRA prefixed with REACT_APP_):
// - REACT_APP_API_BASE
// - REACT_APP_BACKEND_URL
// - REACT_APP_FEATURE_FLAGS (JSON object or comma-separated key[=true|false] list)
// - REACT_APP_LOG_LEVEL (debug|info|warn|error)
// - REACT_APP_NODE_ENV (development|production|test)
// - REACT_APP_HEALTHCHECK_PATH (string path)
//
// Parsing notes:
// - FEATURE_FLAGS supports:
//     * JSON: {"enableBulkActions": true, "xyz": false}
//     * CSV: "enableBulkActions,otherFlag=false" (booleans parsed; no value -> true)
// - getApiBase() resolves REACT_APP_API_BASE first, then REACT_APP_BACKEND_URL, else ''.

const raw = {
  API_BASE: process.env.REACT_APP_API_BASE?.trim() || '',
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL?.trim() || '',
  FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS || '',
  LOG_LEVEL: (process.env.REACT_APP_LOG_LEVEL || 'info').toLowerCase(),
  NODE_ENV: (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development').toLowerCase(),
  HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH || '/health'
};

// Internal: safely parse feature flags from env string.
function parseFeatureFlags(input) {
  if (!input) return {};
  // Try JSON first
  try {
    const obj = JSON.parse(input);
    if (obj && typeof obj === 'object') return obj;
  } catch (_e) {
    // Not JSON, try CSV "k=v,k2,k3=false"
  }

  const result = {};
  String(input)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(pair => {
      const [k, v] = pair.split('=');
      if (!k) return;
      if (typeof v === 'undefined' || v === '') {
        result[k] = true;
      } else {
        const val = v.trim().toLowerCase();
        if (val === 'true' || val === '1' || val === 'yes' || val === 'on') result[k] = true;
        else if (val === 'false' || val === '0' || val === 'no' || val === 'off') result[k] = false;
        else result[k] = v; // keep as string if not boolean-like
      }
    });
  return result;
}

const featureFlags = parseFeatureFlags(raw.FEATURE_FLAGS);

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns resolved API base URL string from env or empty string if not set. */
  return raw.API_BASE || raw.BACKEND_URL || '';
}

// PUBLIC_INTERFACE
export function isProd() {
  /** Returns true if environment is production. */
  return raw.NODE_ENV === 'production';
}

// PUBLIC_INTERFACE
export function getLogLevel() {
  /** Returns configured log level string (debug|info|warn|error). Defaults to 'info'. */
  const allowed = new Set(['debug', 'info', 'warn', 'error']);
  return allowed.has(raw.LOG_LEVEL) ? raw.LOG_LEVEL : 'info';
}

// PUBLIC_INTERFACE
export function getFeatureFlag(name, defaultValue = false) {
  /**
   * Returns the value of a named feature flag from REACT_APP_FEATURE_FLAGS.
   * Accepts boolean or string values; if undefined returns provided defaultValue.
   */
  if (Object.prototype.hasOwnProperty.call(featureFlags, name)) {
    return featureFlags[name];
  }
  return defaultValue;
}

// PUBLIC_INTERFACE
export function getHealthcheckPath() {
  /** Returns the configured healthcheck path string. Defaults to '/health'. */
  const path = String(raw.HEALTHCHECK_PATH || '/health').trim();
  if (!path) return '/health';
  return path.startsWith('/') ? path : `/${path}`;
}

// PUBLIC_INTERFACE
export function getEnvSummary() {
  /**
   * Returns a summarized config for diagnostics and debugging.
   * Do not log secrets here; only high-level configuration.
   */
  return {
    apiBase: getApiBase(),
    nodeEnv: raw.NODE_ENV,
    logLevel: getLogLevel(),
    healthcheckPath: getHealthcheckPath(),
    featureFlags
  };
}

export default {
  getApiBase,
  isProd,
  getLogLevel,
  getFeatureFlag,
  getHealthcheckPath,
  getEnvSummary
};
