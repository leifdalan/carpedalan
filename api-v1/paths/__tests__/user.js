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
  const { responses } = openApiDoc.apiDoc.paths['/user/'].post;
  const responseValidator = { components, responses };
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
    const response = await request.get('/v1/upload');

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it("should return a return a 400 if the name insn't present", async () => {
    const response = await writeUserAgent
      .post('/v1/user')
      .send({ hello: 'there' });

    const instance = new OpenApiResponseValidator(responseValidator);
    const validation = instance.validateResponse(400, response);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);

    expect(response.body.errors[0].message).toMatch(
      'should NOT have additional properties',
    );
  });

  it("should return a return a 200 the content type isn't specified", async () => {
    const response = await writeUserAgent
      .post('/v1/user')
      .send({ requests: 3 });

    const instance = new OpenApiResponseValidator(responseValidator);

    const validation = instance.validateResponse(200, response);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
  });
});
