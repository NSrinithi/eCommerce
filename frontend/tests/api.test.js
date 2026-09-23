import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, ApiError } from '../src/lib/api.js';
const request = createApiClient({ baseUrl: 'http://localhost:5000/api' });
function withFetch(impl, run) {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  return Promise.resolve().then(run).finally(() => {
    globalThis.fetch = original;
  });
}
test('GET unwraps the data envelope', () => withFetch(async () => Response.json({ success: true, data: { status: 'ok' } }), async () => {
  assert.deepEqual(await request('/health'), { status: 'ok' });
}));
test('POST sends JSON, cookie credentials and the CSRF header', () => withFetch(async (url, options) => {
  assert.equal(url, 'http://localhost:5000/api/auth/login');
  assert.equal(options.credentials, 'include');
  assert.equal(options.headers.get('X-App-Request'), 'mern-base');
  assert.equal(options.headers.get('Content-Type'), 'application/json');
  assert.deepEqual(JSON.parse(options.body), { email: 'a@example.com' });
  return Response.json({ success: true, data: { user: {} } });
}, () => request('/auth/login', { method: 'POST', data: { email: 'a@example.com' } })));
test('DELETE accepts an empty 204 response', () => withFetch(async () => new Response(null, { status: 204 }), async () => {
  assert.equal(await request('/examples/abc', { method: 'DELETE' }), null);
}));
test('non-2xx statuses expose a safe server message', () => withFetch(async () => Response.json({ error: { code: 'VALIDATION_ERROR', message: 'Title is required.' }, requestId: 'request-1' }, { status: 400 }), async () => {
  await assert.rejects(request('/examples'), error => error instanceof ApiError && error.status === 400 && error.requestId === 'request-1');
}));
test('unauthorized protected request signals session expiry', async () => {
  let expired = false;
  const client = createApiClient({
    onUnauthorized: () => {
      expired = true;
    }
  });
  await withFetch(async () => Response.json({ error: { message: 'Sign in.' } }, { status: 401 }), async () => {
    await assert.rejects(client('/examples'));
    assert.equal(expired, true);
  });
});
test('incorrect login does not trigger the global expiry handler', async () => {
  let expired = false;
  const client = createApiClient({
    onUnauthorized: () => {
      expired = true;
    }
  });
  await withFetch(async () => Response.json({ error: { message: 'Invalid login.' } }, { status: 401 }), async () => {
    await assert.rejects(client('/auth/login', { method: 'POST', data: {} }));
    assert.equal(expired, false);
  });
});
test('wrong proxy / HTML response reports an API URL problem', () => withFetch(async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } }), async () => {
  await assert.rejects(request('/health'), /non-JSON/);
}));
test('network failure is distinct from HTTP validation failure', () => withFetch(async () => {
  throw new TypeError('Failed to fetch');
}, async () => {
  await assert.rejects(request('/health'), error => error.status === 0 && error.code === 'NETWORK_ERROR');
}));
test('external URLs cannot be passed to the API wrapper', async () => {
  await assert.rejects(request('//other-site.test'), /relative API path/);
});
test('request times out and provides a useful message', () => withFetch((_url, options) => new Promise((_resolve, reject) => {
  options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
}), async () => {
  await assert.rejects(request('/health', { timeout: 5 }), /timed out/);
}));
test('caller abort is kept as an abort, not a fake network error', () => withFetch((_url, options) => new Promise((_resolve, reject) => {
  if (options.signal.aborted) reject(new DOMException('Aborted', 'AbortError'));
}), async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(request('/health', { signal: controller.signal }), error => error.name === 'AbortError');
}));
