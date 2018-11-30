let request = require('supertest');

const { setup } = require('../../server/server');

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

describe('Basic routes webapp routes', () => {
  beforeAll(async () => {
    await readUserAgent.post('/api/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/api/login').send({ password: 'testadmin' });
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should redirect if not logged in', async () => {
    const { status } = await request.get('/');
    expect(status).toBe(301);
  });

  it('should return a 401 for a bad login', async () => {
    const { status } = await request
      .post('/api/login')
      .send({ password: 'farts' });
    expect(status).toBe(401);
  });

  it('should return a set-cookie header', async () => {
    const { header, status, body } = await request
      .post('/api/login')
      .send({ password: 'testpublic' });
    expect(header['set-cookie']).toBeTruthy();
    expect(status).toBe(200);
    expect(body).toMatchObject({ user: 'read' });
  });

  it('should be able to make an authenticated request', async () => {
    const { status } = await readUserAgent.get('/api/posts');
    expect(status).toBe(200);
  });

  it('should not be able to make a post to posts', async () => {
    const { status } = await readUserAgent
      .post('/api/posts')
      .send({ some: 'body' });
    expect(status).toBe(401);
  });
});