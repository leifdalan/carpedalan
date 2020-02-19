const base = require('../.eslint-ts-base');

const config = {
    ...base,
    "parserOptions": {
      "project": "./infra/tsconfig.json",
      "tsconfigRootDir": "./"
    },
    "settings": {
      "import/resolver": {
  
        // use <root>/path/to/folder/tsconfig.json
        "typescript": {
          "directory": "./infra"
        },
  
      },
    },
    rules: {
      ...base.rules,
      "no-new": "off",
      "@typescript-eslint/ban-ts-ignore": "warn",
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/ban-ts-ignore": "off"
    }
  
  }
  
  
  module.exports = config;