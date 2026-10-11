const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { startServer } = require('../src/server');
const { db, initDb } = require('../src/db');
const { seed } = require('../src/seeds/seed');

let server;
let baseUrl;

test.before(async () => {
  // Ensure database has tables and seeds
  await initDb();
  await seed(false);
  server = await startServer(5001);
  baseUrl = 'http://localhost:5001/api';
});

test.after(async () => {
  if (server) {
    server.close();
  }
  await db.destroy();
});

test('1. Health check returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.product, 'Form & Function');
});

test('2. Registration succeeds with valid input and hashes password', async () => {
  const email = `testuser_${Date.now()}@example.com`;
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Elena Rostova',
      email,
      password: 'password123'
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.equal(data.user.name, 'Elena Rostova');
  assert.equal(data.user.email, email.toLowerCase());

  // Verify password in DB is hashed and not plaintext
  const userInDb = await db('users').where({ email: email.toLowerCase() }).first();
  assert.notEqual(userInDb.password, 'password123');
  assert.ok(userInDb.password.startsWith('$2')); // bcrypt prefix
});

test('3. Registration rejects invalid inputs', async () => {
  // Missing name
  const resNoName = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'noname@example.com', password: 'password123' })
  });
  assert.equal(resNoName.status, 400);

  // Short password (< 6 chars)
  const resShortPass = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Short', email: 'short@example.com', password: '123' })
  });
  assert.equal(resShortPass.status, 400);

  // Invalid email format
  const resBadEmail = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bad', email: 'not-an-email', password: 'password123' })
  });
  assert.equal(resBadEmail.status, 400);
});

test('4. Duplicate registration email returns 409 conflict', async () => {
  const email = `dup_${Date.now()}@example.com`;
  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'First User', email, password: 'password123' })
  });

  const dupRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Second User', email, password: 'password123' })
  });

  assert.equal(dupRes.status, 409);
  const data = await dupRes.json();
  assert.equal(data.success, false);
});

test('5. Login succeeds with valid credentials and fails on wrong password', async () => {
  const email = `login_${Date.now()}@example.com`;
  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Login Test', email, password: 'correctpassword' })
  });

  // Successful login
  const okRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'correctpassword' })
  });
  assert.equal(okRes.status, 200);
  const okData = await okRes.json();
  assert.equal(okData.success, true);
  assert.ok(okData.token);

  // Wrong password
  const failRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'wrongpassword' })
  });
  assert.equal(failRes.status, 401);
});

test('6. Unauthenticated requests to protected endpoints return 401', async () => {
  const resMe = await fetch(`${baseUrl}/auth/me`);
  assert.equal(resMe.status, 401);

  const resFav = await fetch(`${baseUrl}/favorites`);
  assert.equal(resFav.status, 401);

  const resAddFav = await fetch(`${baseUrl}/favorites/1`, { method: 'POST' });
  assert.equal(resAddFav.status, 401);
});

test('7. Templates endpoint returns seeded list and supports category & search query filters', async () => {
  // All templates
  const allRes = await fetch(`${baseUrl}/templates`);
  assert.equal(allRes.status, 200);
  const allData = await allRes.json();
  assert.ok(allData.templates.length >= 6);

  // Filter by category: "Landing Page"
  const catRes = await fetch(`${baseUrl}/templates?category=Landing%20Page`);
  assert.equal(catRes.status, 200);
  const catData = await catRes.json();
  assert.ok(catData.templates.length > 0);
  assert.ok(catData.templates.every(t => t.category === 'Landing Page'));

  // Search query
  const searchRes = await fetch(`${baseUrl}/templates?search=Vespera`);
  assert.equal(searchRes.status, 200);
  const searchData = await searchRes.json();
  assert.ok(searchData.templates.length >= 1);
  assert.ok(searchData.templates[0].name.includes('Vespera'));
});

test('8. Template details by ID returns 200 or 404', async () => {
  const allRes = await fetch(`${baseUrl}/templates`);
  const allData = await allRes.json();
  const firstId = allData.templates[0].id;

  const detailRes = await fetch(`${baseUrl}/templates/${firstId}`);
  assert.equal(detailRes.status, 200);
  const detailData = await detailRes.json();
  assert.equal(detailData.template.id, firstId);

  // Non-existent template
  const notFoundRes = await fetch(`${baseUrl}/templates/999999`);
  assert.equal(notFoundRes.status, 404);
});

test('9. User favorites: adding, duplicate handling, listing, and user isolation', async () => {
  // Create User A
  const emailA = `usera_${Date.now()}@example.com`;
  const regARes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User A', email: emailA, password: 'password123' })
  });
  const userA = await regARes.json();

  // Create User B
  const emailB = `userb_${Date.now()}@example.com`;
  const regBRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User B', email: emailB, password: 'password123' })
  });
  const userB = await regBRes.json();

  const allRes = await fetch(`${baseUrl}/templates`);
  const allData = await allRes.json();
  const templateId = allData.templates[0].id;

  // User A adds templateId
  const addRes = await fetch(`${baseUrl}/favorites/${templateId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userA.token}` }
  });
  assert.equal(addRes.status, 201);

  // Duplicate add returns 200 without duplicate rows
  const dupAddRes = await fetch(`${baseUrl}/favorites/${templateId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userA.token}` }
  });
  assert.equal(dupAddRes.status, 200);

  // User A sees 1 favorite
  const favARes = await fetch(`${baseUrl}/favorites`, {
    headers: { 'Authorization': `Bearer ${userA.token}` }
  });
  const favAData = await favARes.json();
  assert.equal(favAData.count, 1);
  assert.equal(favAData.favorites[0].id, templateId);

  // User B sees 0 favorites (User isolation)
  const favBRes = await fetch(`${baseUrl}/favorites`, {
    headers: { 'Authorization': `Bearer ${userB.token}` }
  });
  const favBData = await favBRes.json();
  assert.equal(favBData.count, 0);

  // User A removes favorite
  const delRes = await fetch(`${baseUrl}/favorites/${templateId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${userA.token}` }
  });
  assert.equal(delRes.status, 200);

  // Removing again returns 404
  const delAgainRes = await fetch(`${baseUrl}/favorites/${templateId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${userA.token}` }
  });
  assert.equal(delAgainRes.status, 404);
});
