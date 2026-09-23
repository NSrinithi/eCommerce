// Uses a REAL dedicated MongoDB test database. This suite is intentionally not run by npm test.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { connectDB, closeDB } from '../src/config/db.js';
const uri = process.env.TEST_MONGO_URI;
if (uri && !/\/[^/?]+_test(?:\?|$)/.test(uri)) throw new Error('Use a dedicated database whose name ends in _test.');
const config = {
  origins: ['http://localhost:5173'],
  jwtSecret: randomBytes(48).toString('hex'),
  cookieName: 'mern_test',
  sessionDays: 1,
  production: false,
  trustProxy: false,
  serveClient: false
};
const app = createApp(config);
const owner = request.agent(app);
const other = request.agent(app);
const safety = req => req.set('Origin', config.origins[0]).set('X-App-Request', 'mern-base');
const sample = {
  name: 'Test Student',
  email: `test-${Date.now()}@example.com`,
  password: 'integration-test-password'
};
let recordId;
let cookie;
describe('MERN API with real MongoDB', { skip: !uri }, () => {
  before(async () => {
    await connectDB(uri);
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await closeDB();
  });
  it('health and readiness', async () => {
    await request(app).get('/api/health').expect(200);
    await request(app).get('/api/ready').expect(200);
  });
  it('private APIs reject anonymous requests', async () => {
    await request(app).get('/api/examples').expect(401);
  });
  it('mutation rejects missing custom header', async () => {
    await request(app).post('/api/auth/register').send(sample).expect(403);
  });
  it('untrusted origins are rejected', async () => {
    await request(app).post('/api/auth/login').set('Origin', 'https://evil.test').send(sample).expect(403);
  });
  it('register validates, hashes password, and omits secrets', async () => {
    await safety(owner.post('/api/auth/register')).send({ ...sample, password: '1234' }).expect(400);
    const result = await safety(owner.post('/api/auth/register')).send({ ...sample, role: 'admin' }).expect(201);
    assert.equal(result.body.data.user.passwordHash, undefined);
    assert.equal(result.body.data.user.role, undefined);
    await safety(owner.post('/api/auth/register')).send(sample).expect(409);
  });
  it('login rejects bad credentials, then sets an HTTP-only cookie', async () => {
    await safety(owner.post('/api/auth/login')).send({ email: sample.email, password: 'wrong' }).expect(401);
    const result = await safety(owner.post('/api/auth/login')).send(sample).expect(200);
    cookie = result.headers['set-cookie'][0].split(';')[0];
    assert.match(result.headers['set-cookie'][0], /HttpOnly/i);
    assert.equal(result.body.token, undefined);
    await owner.get('/api/auth/me').expect(200);
  });
  it('CRUD creates, reads, patches and replaces an owned record', async () => {
    const created = await safety(owner.post('/api/examples')).send({ title: 'First' }).expect(201);
    recordId = created.body.data.item.id;
    const listed = await owner.get('/api/examples').expect(200);
    assert.equal(listed.body.data.items[0].title, 'First');
    await owner.get(`/api/examples/${recordId}`).expect(200);
    await safety(owner.patch(`/api/examples/${recordId}`)).send({ description: 'Edited' }).expect(200);
    const updated = await safety(owner.put(`/api/examples/${recordId}`)).send({ title: 'Replaced' }).expect(200);
    assert.equal(updated.body.data.item.description, '');
    await owner.get('/api/examples/not-an-id').expect(400);
  });
  it('a second account cannot read or change the first account record', async () => {
    await safety(other.post('/api/auth/register')).send({ ...sample, email: `other-${sample.email}` }).expect(201);
    await safety(other.post('/api/auth/login')).send({ email: `other-${sample.email}`, password: sample.password }).expect(200);
    await other.get(`/api/examples/${recordId}`).expect(404);
    await safety(other.patch(`/api/examples/${recordId}`)).send({ title: 'Attack' }).expect(404);
    await safety(other.delete(`/api/examples/${recordId}`)).expect(404);
  });
  it('profile update cannot change email or role', async () => {
    const response = await safety(owner.patch('/api/auth/me')).send({
      name: 'New Name',
      email: 'bad@test.com',
      role: 'admin'
    }).expect(200);
    assert.equal(response.body.data.user.name, 'New Name');
    assert.equal(response.body.data.user.email, sample.email);
  });
  it('delete and logout revoke the server session', async () => {
    await safety(owner.delete(`/api/examples/${recordId}`)).expect(204);
    await owner.get(`/api/examples/${recordId}`).expect(404);
    await safety(owner.post('/api/auth/logout')).expect(200);
    await owner.get('/api/auth/me').expect(401);
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401);
  });
});
