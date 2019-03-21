import isEmpty from 'lodash/isEmpty';

let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('.../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /logout', () => {
  const { components } = openApiDoc.args.apiDoc;
  const { responses } = openApiDoc.apiDoc.paths['/logout/'].post;
  const responseValidator = { components, responses };
  beforeEach(async () => {
    await readUserAgent.post('/api/login').send({ password: 'testpublic' });
    1;
  });

  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
  });
  it('should return a 400 with the right response', async () => {
    const response = await request.post('/v1/logout');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(400, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it('should logout successfully', async () => {
    const response = await readUserAgent.post('/v1/logout');
    const authRoute = await readUserAgent.get('/v1/posts');
    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(
      200,
      isEmpty(response.body) ? null : response.body,
    );
    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
    expect(authRoute.status).toBe(401);
  });
});
