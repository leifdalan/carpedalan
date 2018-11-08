module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        targets: {
          browsers: ['last 2 versions', 'safari > 8', 'not ie < 11'],
        },
      },
    ],
    '@babel/react',
  ],
  plugins: [
    [
      'styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
  ],
  env: {
    development: {
      plugins: ['react-hot-loader/babel'],
    },
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        [
          'transform-imports',
          {
            'react-router': {
              // eslint-disable-next-line
              transform: 'react-router/${member}',
              preventFullImport: true,
            },
          },
        ],
        [
          'styled-components',
          {
            displayName: false,
            preprocess: true,
            pure: true,
            minify: true,
          },
        ],
      ],
    },
  },
};
