//
// PUBLIC_INTERFACE
// apiClient provides a small fetch wrapper with:
// - Base URL from REACT_APP_API_BASE (fallback REACT_APP_BACKEND_URL)
// - JSON request/response handling
// - AbortController timeouts
// - Normalized error objects
//
// Usage:
//   import apiClient from './client';
//   const data = await apiClient.get('/users');
//

const DEFAULT_TIMEOUT_MS = 10000;

// Resolve base URL from environment
const baseURL =
  process.env.REACT_APP_API_BASE?.trim() ||
  process.env.REACT_APP_BACKEND_URL?.trim() ||
  '';

function buildURL(path) {
  if (!path) return baseURL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = baseURL.replace(/\/+$/, '');
  const suffix = String(path).replace(/^\/+/, '');
  return `${base}/${suffix}`;
}

function isJsonResponse(resp) {
  const ct = resp.headers.get('content-type') || '';
  return ct.includes('application/json');
}

function normalizeError(err, { url, method, status, payload } = {}) {
  const info = {
    message: err?.message || 'Request failed',
    status: status ?? (err?.status || null),
    method: method || null,
    url: url || null,
    payload: payload ?? null,
    cause: err?.cause || undefined
  };
  const error = new Error(info.message);
  Object.assign(error, info);
  return error;
}

async function request(method, path, { data, headers = {}, timeout = DEFAULT_TIMEOUT_MS, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const url = buildURL(path);
  const finalSignal = signal
    ? (function composeSignals(s1, s2) {
        // Compose provided signal with timeout controller.signal
        if (!s1) return s2;
        if (!s2) return s1;
        const ctrl = new AbortController();
        const onAbort = () => ctrl.abort();
        s1.addEventListener('abort', onAbort);
        s2.addEventListener('abort', onAbort);
        if (s1.aborted || s2.aborted) ctrl.abort();
        return ctrl.signal;
      })(signal, controller.signal)
    : controller.signal;

  const isJsonBody = data !== undefined && !(data instanceof FormData) && typeof data !== 'string' && !(data instanceof Blob);

  const reqInit = {
    method: method.toUpperCase(),
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      Accept: 'application/json, text/plain, */*',
      ...headers
    },
    signal: finalSignal
  };

  if (data !== undefined) {
    if (isJsonBody) {
      reqInit.body = JSON.stringify(data);
    } else {
      reqInit.body = data;
    }
  }

  try {
    const resp = await fetch(url, reqInit);
    clearTimeout(timer);

    const ok = resp.ok;
    let body = null;

    if (isJsonResponse(resp)) {
      try {
        body = await resp.json();
      } catch {
        body = null;
      }
    } else {
      // Fallback to text for non-JSON responses
      try {
        body = await resp.text();
      } catch {
        body = null;
      }
    }

    if (!ok) {
      const serverMessage =
        (body && (body.message || body.error || body.detail)) ||
        `${resp.status} ${resp.statusText || 'Error'}`;
      throw normalizeError(
        new Error(serverMessage),
        { url, method, status: resp.status, payload: body }
      );
    }

    return body;
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') {
      throw normalizeError(new Error('Request timed out'), { url, method, status: null });
    }
    throw normalizeError(e, { url, method });
  }
}

// PUBLIC_INTERFACE
const apiClient = {
  /** Perform GET request. */
  get: (path, opts) => request('GET', path, opts),
  /** Perform POST request. */
  post: (path, opts) => request('POST', path, opts),
  /** Perform PUT request. */
  put: (path, opts) => request('PUT', path, opts),
  /** Perform PATCH request. */
  patch: (path, opts) => request('PATCH', path, opts),
  /** Perform DELETE request. */
  delete: (path, opts) => request('DELETE', path, opts),
  /** Expose resolved baseURL for diagnostics. */
  baseURL
};

export default apiClient;
