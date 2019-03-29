import createTag from '../../../../../services/tags/createTag';

let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));
const { responses } = openApiDoc.apiDoc.paths['/tags/{tagId}/posts'].get;
describe('GET /tags/{tagId}/posts', () => {
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
  let id;
  beforeEach(async () => {
    ({ id } = await createTag('myTag'));
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', tags: [id] });

    await writeUserAgent
      .patch(`/v1/posts/${body.id}`)
      .set('Content-Type', 'application/json')
      .send({
        status: 'active',
        tags: [id],
        isPending: false,
        key: 'something.jpg',
      });
  });
  it('should return a 401 with the right response', async () => {
    const response = await request.get(`/v1/tags/${id}/posts`);

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });

  it('should return one record and a 200', async () => {
    const response = await readUserAgent.get(`/v1/tags/${id}/posts`);
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(200, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].tags.length).toBe(1);
    expect(response.body.data[0].tags[0].id).toBe(id);
  });
});
