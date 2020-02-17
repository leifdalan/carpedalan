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
  },
};
