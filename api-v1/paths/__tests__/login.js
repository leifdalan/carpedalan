let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('.../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /login', () => {
  const { components } = openApiDoc.args.apiDoc;
  const { responses } = openApiDoc.apiDoc.paths['/login/'].post;
  const responseValidator = { components, responses };

  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
  });
  it('should return a 400 with the right response', async () => {
    const response = await request.post('/v1/login');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(400, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
  });

  it('should return a 401 for the inccorrect password', async () => {
    const response = await readUserAgent
      .post('/v1/login')
      .send({ password: 'asdf' });

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });
});
