let request = require('supertest');

const { setup } = require('../../../server/server');

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

describe('/tags', () => {
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should get all tags', async () => {
      const { status } = await readUserAgent.get('/api/tags');
      expect(status).toBe(200);
    });
  });
  describe('GET (one)', () => {
    it('should get a single tag', async () => {
      const { status } = await readUserAgent.get('/api/tags/uasd');
      expect(status).toBe(200);
    });
  });
});
