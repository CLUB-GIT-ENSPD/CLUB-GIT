// Runtime validation coverage for API authentication and error handling.
import assert from 'node:assert/strict';
import test from 'node:test';
import { apiRequest, setStoredToken } from './api.ts';

const storage = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  },
});

test('sends the stored bearer token with API requests', async t => {
  setStoredToken('local-test-token');
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/projects');
    assert.equal(options.headers.Authorization, 'Bearer local-test-token');
    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  assert.deepEqual(await apiRequest('/projects'), { data: [] });
});

test('preserves the server message and status for failed API requests', async t => {
  setStoredToken(null);
  t.mock.method(globalThis, 'fetch', async () => new Response(
    JSON.stringify({ message: 'Session invalide' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } },
  ));

  await assert.rejects(apiRequest('/private'), error => {
    assert.equal(error.message, 'Session invalide');
    assert.equal(error.status, 401);
    return true;
  });
});
