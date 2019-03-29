import AWS from 'aws-sdk';

import createTag from '../../../../services/tags/createTag';

let request = require('supertest');
const OpenApiResponseValidator = require('openapi-response-validator').default;

const { setup } = require('../../../../../server/server');

const { app, store, pool, openApiDoc } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

jest.mock('aws-sdk', () => {
  const mockAWS = {};
  mockAWS.copyObject = jest.fn().mockReturnThis();

  mockAWS.s3Promise = jest.fn(() => Promise.resolve({}));
  mockAWS.sendEmailMock = jest.fn().mockReturnThis();

  mockAWS.sesPromise = jest.fn(() => Promise.resolve({}));

  mockAWS.S3 = function() {};

  mockAWS.S3.prototype = {
    ...mockAWS.S3.prototype,
    copyObject: mockAWS.copyObject,
    promise: mockAWS.s3Promise,
  };
  mockAWS.SES = function() {};

  mockAWS.SES.prototype = {
    ...mockAWS.SES.prototype,
    sendEmail: mockAWS.sendEmailMock,
    promise: mockAWS.sesPromise,
  };
  return mockAWS;
});

const path = '/posts/{id}';
let responses;
describe('PATCH /posts/{id}', () => {
  const { components } = openApiDoc.args.apiDoc;
  let id;
  beforeAll(async () => {
    await readUserAgent.post('/v1/login').send({ password: 'testpublic' });
    await writeUserAgent.post('/v1/login').send({ password: 'testadmin' });
    ({ responses } = openApiDoc.apiDoc.paths[path].patch);
  });
  afterAll(async () => {
    await pool.end();
    await store.close();
    await app.close();
    readUserAgent.app.close();
    writeUserAgent.app.close();
  });
  it('should return a 401 with the right response', async () => {
    const response = await request
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json');

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(401, response);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(401);
  });
  it('should have the right response for read user agent', async () => {
    const response = await readUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json');

    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(403, response.body);
    expect(validation).toBeUndefined();
    expect(response.status).toBe(403);
  });

  it('it should return a 400 the uuid is bad', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/farts`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toMatchObject({
      path: 'id',
      errorCode: 'format.openapi.validation',
      message: 'should match format "uuid"',
      location: 'path',
    });
  });

  it('it should return a 404 if there is no record', async () => {
    const response = await writeUserAgent
      .patch(`/v1/posts/f7bbd0d4-4508-11e9-b851-bf22de2ec42d`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(404, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(404);
  });

  it('should return a 200 if the post was patched', async () => {
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    ({ id } = body);

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo' });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(200, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
  });

  it('should call copy object if rotate is supplied', async () => {
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    ({ id } = body);

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', rotate: 90 });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(200, response.body);

    expect(AWS.S3.prototype.copyObject).toHaveBeenCalledTimes(1);
    expect(AWS.S3.prototype.copyObject).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: 'raw/something.jpg',
        Metadata: {
          rotate: '90',
        },
      }),
    );
    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
  });
  it('should throw if the rotate angle is weird', async () => {
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg' });

    ({ id } = body);

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', rotate: 91 });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });

    const validation = instance.validateResponse(400, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(400);
  });

  it('can update tags', async () => {
    const { id: tag1Id } = await createTag('tag1');
    const { id: tag2Id } = await createTag('tag2');
    const { id: tag3Id } = await createTag('tag3');
    const { id: tag4Id } = await createTag('tag4');
    const { body } = await writeUserAgent
      .post('/v1/posts')
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', tags: [tag1Id, tag2Id] });

    ({ id } = body);

    const response = await writeUserAgent
      .patch(`/v1/posts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ key: 'something.jpg', etag: 'hallo', tags: [tag3Id, tag4Id] });
    const instance = new OpenApiResponseValidator({
      responses,
      components,
    });
    const validation = instance.validateResponse(200, response.body);

    expect(validation).toBeUndefined();
    expect(response.status).toBe(200);
    expect(response.body.tags[0].id).toBe(tag3Id);
    expect(response.body.tags[1].id).toBe(tag4Id);
  });
});
