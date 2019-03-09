import { commonErrors } from '../../../refs/error';

const status = 200;

export default function(posts) {
  const patch = async function(req, res, next) {
    const { body } = req;
    try {
      const response = await posts.update(body, req.params.id);
      res.status(status).json(response);
    } catch (e) {
      next(e);
    }
  };

  patch.apiDoc = {
    description: 'Patch Posts',
    operationId: 'patchPost',
    tags: ['posts', 'write'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Post',
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Users were successfully deleted.',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return patch;
}
