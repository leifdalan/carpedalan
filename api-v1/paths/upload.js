import { commonErrors } from '../refs/error';

const status = 201;

export default function(aws) {
  const get = (req, res, next) => {
    const { name } = req.query;
    try {
      const result = aws.getS3Credentials(name);

      res.status(status).json(result);
    } catch (e) {
      next(e);
    }
  };
  get.apiDoc = {
    description: 'Get signed upload url',
    operationId: 'upload',
    tags: ['user', 'write', 'aws'],
    parameters: [
      {
        in: 'query',
        name: 'name',
        schema: {
          type: 'string',
          example: 'somepicture.jpg',
        },
        required: true,
      },
    ],

    //   {
    //     "upload_url": "https://carpedev-west.s3.amazonaws.com",
    //     "params": {
    //         "key": "raw/undefined",
    //         "acl": "public-read",
    //         "success_action_status": "201",
    //         "policy": "eyJleHBpcmF0aW9uIjoiMjAxOS0wMi0yNFQyMTo1MjowOC42MzFaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiY2FycGVkZXYtd2VzdCJ9LHsia2V5IjoicmF3L3VuZGVmaW5lZCJ9LHsiYWNsIjoicHVibGljLXJlYWQifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTAwMDAwMDBdLHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJUDNGUzRJUExQMkhOUkVRLzIwMTkwMjI0L3VzLXdlc3QtMi9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWRhdGUiOiIyMDE5MDIyNFQwMDAwMDBaIn1dfQ==",
    //         "x-amz-algorithm": "AWS4-HMAC-SHA256",
    //         "x-amz-credential": "AKIAIP3FS4IPLP2HNREQ/20190224/us-west-2/s3/aws4_request",
    //         "x-amz-date": "20190224T000000Z",
    //         "x-amz-signature": "810b110d6f89f201dd37fb84d46cc55ae5e21086c922c18dbb598a7c6cca3e80"
    //     }
    // }

    responses: {
      ...commonErrors,
      [status]: {
        description: 'Upload url successfully created.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                upload_url: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://carpedev-west.s3.amazonaws.com',
                },
                params: {
                  type: 'object',
                  properties: {
                    key: {
                      type: 'string',
                    },
                    acl: {
                      type: 'string',
                      example: 'public-read',
                    },
                    success_action_status: {
                      type: 'string',
                      example: '201',
                    },
                    policy: {
                      type: 'string',
                      example:
                        'eyJleHBpcmF0aW9uIjoiMjAxOS0wMi0yNFQyMTo1MjowOC42MzFaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoiY2FycGVkZXYtd2VzdCJ9LHsia2V5IjoicmF3L3VuZGVmaW5lZCJ9LHsiYWNsIjoicHVibGljLXJlYWQifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTAwMDAwMDBdLHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJUDNGUzRJUExQMkhOUkVRLzIwMTkwMjI0L3VzLXdlc3QtMi9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWRhdGUiOiIyMDE5MDIyNFQwMDAwMDBaIn1dfQ==',
                    },
                    'x-amz-algorithm': {
                      type: 'string',
                      example: 'AWS4-HMAC-SHA256',
                    },
                    'x-amz-credential': {
                      type: 'string',
                      example:
                        'AKIAIP3FS4IPLP2HNREQ/20190225/us-west-2/s3/aws4_request',
                    },
                    'x-amz-date': {
                      type: 'string',
                      example: '20190225T000000Z',
                    },
                    'x-amz-signature': {
                      type: 'string',
                      example:
                        '31886490662a565f35c2690a64b469dfa7fdea5985cad6b2bf55cd140981cb04',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return { get };
}
