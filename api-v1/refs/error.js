const error = {
  type: 'object',

  properties: {
    status: {
      type: 'integer',
    },
    message: {
      type: 'string',
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const commonErrors = {
  400: {
    description: 'Bad requestBody or malformed request parameters.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  401: {
    description: 'User was unauthenticated.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  403: {
    description: 'User was unauthorized to perform this operation.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  422: {
    description: 'Request was not processable in the service handler.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  500: {
    description: 'Request failed due to an unkown error.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
};

export default error;
