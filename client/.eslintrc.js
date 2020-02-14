module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./client/tsconfig.json",
    "tsconfigRootDir": "."
  },
  "env": {
    "browser": true,
    "jest/globals": true
  },
  "settings": {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/resolver": {

      // use <root>/path/to/folder/tsconfig.json
      "typescript": {
        "directory": "./client/tsconfig.json"
      },

    },
  },

  "plugins": ["@typescript-eslint", "react-hooks", "jest", "prettier"],
  "extends": [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  "rules": {
    /**
     * @description rules of eslint official
     */
    /**
     * @bug https://github.com/benmosher/eslint-plugin-import/issues/1282
     * "import/named" temporary disable.
     */
    "import/named": "off",
    /**
     * @bug?
     * "import/export" temporary disable.
     */
    "import/export": "off",
    "import/order": ["error", {"groups": ["builtin", "external", "internal", "parent", "sibling", "index"], "newlines-between" : "always", "alphabetize": {"order": "asc"}}],
    "import/prefer-default-export": "off", // Allow single Named-export
    "no-unused-expressions": ["warn", {
      "allowShortCircuit": true,
      "allowTernary": true
    }], // https://eslint.org/docs/rules/no-unused-expressions

    /**
     * @description rules of @typescript-eslint
     */
    "@typescript-eslint/prefer-interface": "off", // also want to use "type"
    "@typescript-eslint/explicit-function-return-type": "off", // annoying to force return type

    /**
     * @description rules of eslint-plugin-react
     */
    "react/jsx-filename-extension": ["warn", {
      "extensions": [".jsx", ".tsx"]
    }], // also want to use with ".tsx"
    "react/prop-types": "off", // Is this incompatible with TS props type?

    /**
     * @description rules of eslint-plugin-react-hooks
     */
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "no-restricted-syntax": "off",
    "no-throw-literal": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "log|debug" }],
    "@typescript-eslint/interface-name-prefix": "off",
    "no-shadow": "off",
    "func-names": "off",
    "react/no-array-index-key": "warn",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],

    /**
     * @description rules of eslint-plugin-prettier
     */
    "prettier/prettier": [
      "error", {
        "singleQuote": true,
      }
    ]
  },
  "overrides": [
    {
      "files": ["**/__tests__/*", "**/testutils/*"],
      "rules": {
        "no-unused-expressions": "off",
        "no-undef": "off",
        "jest/expect-expect": "off",
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]

}