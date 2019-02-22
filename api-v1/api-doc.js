// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.

import PostSchema, { PostWithTags } from './refs/post';
import Tag from './refs/tag';
import Error from './refs/error';

export default {
  openapi: '3.0.0',

  servers: [
    {
      url: 'https://local.carpedalan.com/v1',
      description: 'local',
    },
    {
      url: 'https://carpedalan.com/v1',
      description: 'production',
    },
  ],

  info: {
    title: 'Carpe Dalan dot com API',
    version: '1.0.0',
  },

  components: {
    schemas: {
      Post: PostSchema,
      PostWithTags,
      Tag,
      Error,
    },
    securitySchemes: {
      sessionAuthentication: {
        type: 'apiKey',
        in: 'cookie',
        name: 'user_sid',
      },
    },
  },

  paths: {},

  // tags is optional, and is generated / sorted by the tags defined in your path
  // docs.  This API also defines 2 tags in operations: "creating" and "fooey".
  tags: [
    // {name: 'creating'} will be inserted by ./api-routes/users.js
    // {name: 'fooey'} will be inserted by ./api-routes/users/{id}.js
    { description: 'Everything users', name: 'users' },
  ],
  security: [
    {
      sessionAuthentication: ['read', 'write'],
    },
  ],
};
