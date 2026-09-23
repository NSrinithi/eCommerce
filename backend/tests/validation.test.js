import test from 'node:test';
import assert from 'node:assert/strict';
import { registerBody, loginBody, profileBody } from '../src/validators/auth.validators.js';
import { createBody, updateBody } from '../src/validators/example.validators.js';
const valid = {
  name: 'Test Student',
  email: 'STUDENT@example.com ',
  password: 'my practice password'
};
test('registration normalizes name/email and preserves the exact password', () => {
  assert.deepEqual(registerBody({ ...valid, name: ' Test Student ' }), { ...valid, email: 'student@example.com' });
});
test('registration drops client-supplied admin roles and unknown fields', () => {
  assert.equal('role' in registerBody({ ...valid, role: 'admin' }), false);
});
test('registration rejects short passwords', () => {
  assert.throws(() => registerBody({ ...valid, password: '1234' }), /Password/);
});
test('bcrypt 72-byte limit also covers multi-byte text', () => {
  assert.throws(() => registerBody({ ...valid, password: '😀'.repeat(20) }), /72 UTF-8 bytes/);
});
test('email rejects Mongo query objects', () => {
  assert.throws(() => loginBody({ email: { $ne: null }, password: valid.password }));
});
test('non-object request bodies are rejected', () => {
  assert.throws(() => registerBody(null));
  assert.throws(() => createBody([]));
});
test('profile updates whitelist the display name', () => {
  assert.deepEqual(profileBody({
    name: 'New Name',
    email: 'other@example.com',
    role: 'admin'
  }), { name: 'New Name' });
});
test('sample records trim text and reject blank titles', () => {
  assert.deepEqual(createBody({ title: ' One ' }), { title: 'One', description: '' });
  assert.throws(() => createBody({ title: ' ' }));
});
test('owner cannot be overwritten by request body', () => {
  assert.deepEqual(updateBody({ title: 'Two', owner: 'attacker' }), { title: 'Two' });
});
test('PATCH requires a supported field and enforces length', () => {
  assert.throws(() => updateBody({}));
  assert.throws(() => updateBody({ description: 'a'.repeat(501) }));
  assert.deepEqual(updateBody({ description: '' }), { description: '' });
});
