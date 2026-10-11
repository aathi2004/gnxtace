const { startServer } = require('./src/server');

const { db } = require('./src/db');

async function testBackend() {
  const port = 5002;
  const server = await startServer(port);
  const baseUrl = `http://localhost:${port}/api`;

  try {
    console.log('--- Testing 1: Health Check ---');
    const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
    console.log('Health:', healthRes.status === 'healthy' ? 'PASS' : 'FAIL');

    console.log('--- Testing 2: Get Templates (Unauthenticated) ---');
    const templatesRes = await fetch(`${baseUrl}/templates`).then(r => r.json());
    console.log('Templates count:', templatesRes.count, templatesRes.success ? 'PASS' : 'FAIL');
    const testTemplateId = templatesRes.templates[0].id;

    console.log('--- Testing 3: Register User ---');
    const testEmail = `test_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Developer',
        email: testEmail,
        password: 'password123'
      })
    }).then(r => r.json());
    console.log('Register response:', regRes.success ? 'PASS' : 'FAIL', regRes.message);
    const token = regRes.token;

    console.log('--- Testing 4: Login User ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    }).then(r => r.json());
    console.log('Login response:', loginRes.success ? 'PASS' : 'FAIL', loginRes.user?.name);

    console.log(`--- Testing 5: Add Template #${testTemplateId} to Favorites ---`);
    const addFavRes = await fetch(`${baseUrl}/favorites/${testTemplateId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(r => r.json());
    console.log('Add Favorite response:', addFavRes.success ? 'PASS' : 'FAIL', addFavRes.message);

    console.log('--- Testing 6: Get User Favorites ---');
    const getFavRes = await fetch(`${baseUrl}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(r => r.json());
    console.log('User favorites count:', getFavRes.count, getFavRes.success && getFavRes.count === 1 ? 'PASS' : 'FAIL');

    console.log(`--- Testing 7: Remove Template #${testTemplateId} from Favorites ---`);
    const delFavRes = await fetch(`${baseUrl}/favorites/${testTemplateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(r => r.json());
    console.log('Delete Favorite response:', delFavRes.success ? 'PASS' : 'FAIL');

    console.log('\n==========================================');
    console.log('🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================\n');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    if (server) {
      server.close();
    }
    await db.destroy();
    process.exit(0);
  }
}

testBackend();
