let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);
const { responses } = openApiDoc.apiDoc.paths['/tags/'].post;
jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('POST /tags', () => {
  const { components } = openApiDoc.args.apiDoc;
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
  it('should return a 401 with the right response', async () => {
    const response = await request.post('/v1/tags');

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it('should have the right response if the user is invalid', async () => {
    const response = await readUserAgent.post('/v1/tags');
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(403, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(403);
  });

  it('should return 400 if there is no post body', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json');

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it('should return 400 if there is no name in post body body', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json')
      .send({});

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it('should return a 201 with the right response shape', async () => {
    const response = await writeUserAgent
      .post('/v1/tags')
      .set('Content-Type', 'application/json')
      .send({ name: 'whatt ' });

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(201, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(201);
  });
});
