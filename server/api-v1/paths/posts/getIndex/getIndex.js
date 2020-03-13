// Showing that you don't need to have apiDoc defined on methodHandlers.

import { commonErrors } from '../../../refs/error';
import { BadRequestError } from '../../../../errors';
import {
  CREATEDAT,
  DATE,
  DESCRIPTION,
  ETAG,
  EXIFPROPS,
  ID,
  KEY,
  ORIGINALURL,
  STATUS,
  TIMESTAMP,
  UPDATEDAT,
} from '../../../../../shared/constants';

const status = 200;

export default function(posts) {
  async function get(req, res) {
    const { index } = await posts.getIndex(req.timestamp);
    return res.status(status).json({ index });
  }

  get.apiDoc = {
    description: 'Gets the index of a post by timestamp',
    operationId: 'getPostsIndex',
    tags: ['posts', 'read'],
    parameters: [
      {
        in: 'query',
        name: 'timestamp',
        required: true,
        schema: {
          type: 'string',
          description: 'Timestamp of the desired post',
        },
      },
    ],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Index of the post queried in the chronological list',
        content: {
          'application/json': {
            schema: {
              description: 'Result of getIndex call',
              type: 'object',
              properties: {
                index: {
                  description: 'Index of photo',
                  type: 'integer',
                },
              },
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write', 'read'] }],
  };

  return get;
}
