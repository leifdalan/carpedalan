let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../server/server');
const getPath = require('../get').default;

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

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
  // it('should redirect if not logged in', async () => {
  //   const response = await request.get('/v1/posts');
  //   const responses = getPath().apiDoc;
  //   console.error(responses);

  //   const instance = new OpenApiResponseValidator(responses);
  //   const validation = instance.validateResponse(401, response);
  //   console.error('validation', validation);

  //   expect(response.status).toBe(401);
  // });
  it('should have the right response', async () => {
    const response = await readUserAgent.get('/v1/posts?page=1');
    const responses = getPath().apiDoc;

    const instance = new OpenApiResponseValidator(responses);
    const validation = instance.validateResponse(200, response.body);
    console.error('validation', validation);

    expect(response.status).toBe(200);
  });
});
