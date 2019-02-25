export default {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/PostWithTags',
      },
    },
    meta: {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
        },
        page: {
          type: 'integer',
        },
        pages: {
          type: 'integer',
        },
      },
    },
  },
};
