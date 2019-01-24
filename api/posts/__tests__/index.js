import path from 'path';

import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

let request = require('supertest');

const { setup } = require('../../../server/server');

const { app, store, pool } = setup();
const readUserAgent = request.agent(app);
const writeUserAgent = request.agent(app);
request = request(app);

jest.mock('aws-cloudfront-sign', () => ({
  getSignedCookies: jest.fn(() => ({})),
}));

const photo = process.env.WALLABY
  ? `${process.env.LOCAL_PATH}/api/posts/__tests__/kitty2.jpg`
  : path.resolve(__dirname, 'kitty2.jpg');

jest.mock('aws-sdk', () => {
  const AWS = {};

  AWS.uploadMock = jest.fn().mockReturnThis();

  AWS.s3Promise = jest.fn(() => Promise.resolve({}));
  AWS.sendEmailMock = jest.fn().mockReturnThis();

  AWS.sesPromise = jest.fn(() => Promise.resolve({}));

  AWS.S3 = function() {};

  AWS.S3.prototype = {
    ...AWS.S3.prototype,
    upload: AWS.uploadMock,
    promise: AWS.s3Promise,
  };
  AWS.SES = function() {};

  AWS.SES.prototype = {
    ...AWS.SES.prototype,
    sendEmail: AWS.sendEmailMock,
    promise: AWS.sesPromise,
  };
  return AWS;
});
describe('/posts', () => {
  it('sucks', () => {
    expect(true).toBe(true);
  });
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

  describe('POST', () => {
    it('should not be able to make a post to posts', async () => {
      const { status } = await readUserAgent
        .post('/api/posts')
        .send({ some: 'body' });
      expect(status).toBe(401);
    });

    it('should be able to make a post to posts with the right user', async () => {
      const { status } = await writeUserAgent
        .post('/api/posts')
        .attach('photo', photo);
      expect(status).toBe(200);
    });
  });

  describe('PATCH', () => {
    it('should not be able to make a request without authorization', async () => {
      const { status } = await readUserAgent
        .patch('/api/posts/asdf')
        .send({ some: 'body' });

      expect(status).toBe(401);
    });

    it('should be able to patch', async () => {
      aws.s3Promise.mockImplementation(() => Promise.resolve({}));
      const { status, body } = await writeUserAgent
        .post('/api/posts')
        .attach('photo', photo);
      expect(status).toBe(200);
      expect(body.description).toBeNull();
      const description = 'description';
      const {
        status: patchStatus,
        body: patchBody,
      } = await writeUserAgent.patch(`/api/posts/${body.id}`).send({
        description,
      });

      expect(patchStatus).toBe(200);
      expect(patchBody.description).toBe(description);
    });
  });

  describe('DELETE', () => {
    it('should not be able to make a request without authorization', async () => {
      const { status } = await readUserAgent.delete('/api/posts/asdf');

      expect(status).toBe(401);
    });

    it('should be able to delete', async () => {
      aws.s3Promise.mockImplementation(() => Promise.resolve({}));
      const { status, body } = await writeUserAgent
        .post('/api/posts')
        .attach('photo', photo);
      expect(status).toBe(200);
      const { status: deleteStatus } = await writeUserAgent.delete(
        `/api/posts/${body.id}`,
      );

      expect(deleteStatus).toBe(204);
      const { status: getStatus } = await writeUserAgent.get(
        `/api/posts/${body.id}`,
      );
      expect(getStatus).toBe(404);
    });

    it('should throw a 404 if the record doesnt exist', async () => {
      aws.s3Promise.mockImplementation(() => Promise.resolve({}));
      const { status: deleteStatus } = await writeUserAgent.delete(
        `/api/posts/garbage`,
      );
      expect(deleteStatus).toBe(404);
    });
  });

  describe('GET (single)', () => {
    it('should return a 404 even if a post is successful', async () => {
      aws.s3Promise.mockImplementation(() => Promise.resolve({}));
      const { status, body } = await writeUserAgent.post('/api/posts');
      expect(status).toBe(200);

      const { status: getStatus } = await writeUserAgent.get(
        `/api/posts/${body.id}`,
      );
      expect(getStatus).toBe(404);
    });

    it('should return a 500 if the id is bad exist', async () => {
      const { status: getStatus } = await writeUserAgent.get(
        `/api/posts/farts`,
      );
      expect(getStatus).toBe(500);
    });

    it("should return a 404 if the id doesn't exist", async () => {
      const { status } = await writeUserAgent.get(`/api/posts/${uuid()}`);
      expect(status).toBe(404);
    });
  });
  describe('GET', () => {
    it('should get many records', async () => {
      const { status } = await readUserAgent.get('/api/posts');
      expect(status).toBe(200);
    });
    // it('should associate tags with the records', async () => {
    //   const { body } = await readUserAgent.get('/api/posts');
    //   expect(body[0].tags).toMatchSnapshot();
    // });
  });
});
