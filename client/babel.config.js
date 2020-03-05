module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    'react-hot-loader/babel',
    'babel-plugin-macros',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
      plugins: [],
    },
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            targets: '> 0.25%, not dead',
          },
        ],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
      plugins: [
        'babel-plugin-macros',
        [
          'babel-plugin-styled-components',
          {
            minify: true,
            transpileTemplateLiterals: true,
            ssr: false,
            pure: true,
            displayName: false,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
      ],
    },
    development: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
      plugins: [
        'babel-plugin-macros',
        [
          'babel-plugin-styled-components',
          {
            minify: false,
            transpileTemplateLiterals: false,
            ssr: false,
            pure: true,
            displayName: true,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
      ],
    },
  },
};
