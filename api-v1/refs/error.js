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
    description: 'Users were successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  401: {
    description: 'Users were successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  403: {
    description: 'Users were successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  422: {
    description: 'Users were successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
  500: {
    description: 'Users were successfully deleted.',
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
