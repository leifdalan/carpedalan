let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

describe('GET /upload', () => {
  const { components } = openApiDoc.args.apiDoc;
  const { responses } = openApiDoc.apiDoc.paths['/upload/'].get;
  const responseValidator = { components, responses };
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
    const response = await request.get('/v1/upload');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it('should return a 403 if the user is a read user', async () => {
    const response = await readUserAgent.get('/v1/upload');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(403, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(403);
  });

  it("should return a return a 400 if the name insn't present", async () => {
    const response = await writeUserAgent.get('/v1/upload');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(400, response);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);

    expect(response.body.errors[0].message).toMatch(
      "should have required property 'name'",
    );
  });

  it("should return a return a 400 the content type isn't specified", async () => {
    const response = await writeUserAgent.get('/v1/upload?name=something.jpg');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(201, response);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(201);
  });
});
