let request = require('supertest');

const { setup } = require('../server');

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

describe('Webapp Routes', () => {
  beforeAll(async () => {
    await readUserAgent.post('/api/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/api/login').send({ password: 'testadmin' });
  });

  afterAll(async () => {
    await readUserAgent.app.close();
    await writeUserAgent.app.close();
    await pool.end();
    await store.close();
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect the user to login', async () => {
    const { status } = await request.get('/');
    expect(status).toBe(200);
  });

  it('it should redirect from admin', async () => {
    const { status } = await readUserAgent.get('/admin/');
    expect(status).toBe(301);
  });

  it('it should redirect from admin if not logged in', async () => {
    const { status } = await request.get('/admin/');
    expect(status).toBe(301);
  });
});
