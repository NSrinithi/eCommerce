import { appConfig } from '../config/app.js';
export class ApiError extends Error {
  constructor(message, status = 0, code = 'NETWORK_ERROR', fields, requestId) {
    super(message);
    this.name = 'ApiError';
    Object.assign(this, {
      status,
      code,
      fields,
      requestId
    });
  }
}

// All HTTP calls go through this file. No tokens or passwords in localStorage.
export function createApiClient({ baseUrl = appConfig.apiBaseUrl, onUnauthorized = () => { } } = {}) {
  return async function request(path, { method = 'GET', data, signal, timeout = 15000 } = {}) {
    if (!path.startsWith('/') || path.startsWith('//')) throw new ApiError('Use a relative API path starting with /.');
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener('abort', abort, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
    const headers = new Headers({ Accept: 'application/json' });
    if (!['GET', 'HEAD'].includes(method)) headers.set('X-App-Request', 'mern-base');
    const isFormData = data instanceof FormData;

    if (data !== undefined && !isFormData) {
      headers.set('Content-Type', 'application/json');
    }
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        credentials: 'include',
        signal: controller.signal,
        ...(data !== undefined
          ? { body: isFormData ? data : JSON.stringify(data) }
          : {}),
      });
      if (response.status === 204) return null;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new ApiError('API returned a non-JSON response. Check the API URL or proxy.', response.status, 'INVALID_RESPONSE');
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401 && !['/auth/login', '/auth/register'].includes(path)) onUnauthorized();
        throw new ApiError(payload.error?.message || 'Request failed.', response.status, payload.error?.code, payload.error?.fields, payload.requestId);
      }
      return payload.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof SyntaxError) throw new ApiError('API response is not valid JSON.', 0, 'INVALID_RESPONSE');
      if (controller.signal.aborted && !timedOut) throw error;
      throw new ApiError(timedOut ? 'Request timed out. Check the API and try again.' : 'Cannot reach the API. Check that the backend is running.');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  };
}
export const api = createApiClient({
  onUnauthorized: () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:expired'));
  }
});
