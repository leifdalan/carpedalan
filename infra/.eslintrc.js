const config = {
    ...require('../.eslint-ts-base'),
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
  
  
  }
  
  
  module.exports = config;