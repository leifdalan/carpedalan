module.exports = {
  presets: [
    [
      '@babel/env',
      {
        // modules: false,
        useBuiltIns: 'usage',
        targets: {
          browsers: ['last 2 versions', 'safari > 8', 'not ie < 11'],
        },
      },
    ],
    '@babel/react',
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    [
      'styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
    [
      'transform-imports',
      {
        'react-router': {
          // eslint-disable-next-line
          transform: 'react-router/${member}',
          preventFullImport: true,
        },
        'react-virtualized': {
          // eslint-disable-next-line
          transform: 'react-virtualized/dist/es/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
  env: {
    test: {
      plugins: ['babel-plugin-dynamic-import-node'],
    },
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
            'react-virtualized': {
              // eslint-disable-next-line
                    transform: 'react-virtualized/dist/es/${member}',
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
