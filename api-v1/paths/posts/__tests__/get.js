import { DESCRIPTION, KEY } from '../../../../shared/constants';

let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /posts', () => {
  const { components } = openApiDoc.args.apiDoc;
  beforeAll(async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should return a 401 with the right response', async () => {
    const response = await request.get('/v1/posts');

    const instance = new OpenApiResponseValidator({
      responses: openApiDoc.apiDoc.paths['/posts/'].get.responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });
  it('should get the isPenbding posts', async () => {
    const response = await readUserAgent.get('/v1/posts?isPending=true');

    const instance = new OpenApiResponseValidator({
      responses: openApiDoc.apiDoc.paths['/posts/'].get.responses,
      components,
    });
    const validation = instance.validateResponse(200, response);
    expect(validation).toBeUndefined();
    const isPendingFalse = response.body.data.filter(
      ({ isPending }) => !isPending,
    );
    expect(isPendingFalse.length).toBe(0);
    expect(response.status).toBe(200);
  });
  it('should have the right response', async () => {
    const response = await readUserAgent.get('/v1/posts?page=1');
    const instance = new OpenApiResponseValidator({
      responses: openApiDoc.apiDoc.paths['/posts/'].get.responses,
      components,
    });

    const validation = instance.validateResponse(200, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
  });

  it('should return the fields specified', async () => {
    const response = await readUserAgent.get(
      `/v1/posts?page=1&fields[]=${KEY}`,
    );
    const instance = new OpenApiResponseValidator({
      responses: openApiDoc.apiDoc.paths['/posts/'].get.responses,
      components,
    });

    const validation = instance.validateResponse(200, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);

    expect(response.body.data[0]).toHaveProperty(KEY);
    expect(response.body.data[0]).not.toHaveProperty(DESCRIPTION);
  });

  it('it should return the right order', async () => {
    const response = await readUserAgent.get(`/v1/posts?page=1`);

    const instance = new OpenApiResponseValidator({
      responses: openApiDoc.apiDoc.paths['/posts/'].get.responses,
      components,
    });
    const validation = instance.validateResponse(200, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);

    if (!response.body.data[0].timestamp) return true;
    expect(response.body.data[0].timestamp).toBeGreaterThan(
      response.body.data[1].timestamp,
    );
    return true;
  });
});
