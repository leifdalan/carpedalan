module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb-base", "prettier", "plugin:jest/recommended"],
  "plugins": ["prettier", "jest"],
  "env": {
    "browser": true,
    "node": true,
    "jest/globals": true
  },  
  "globals": {
    "cy": false,
    "Cypress": false,
    "before": false
  },
  "rules": {
    "func-names": ["error", "never"],
    "prettier/prettier": ["error"],
    "import/order": ["error", {"groups": ["builtin", "external", "parent", "sibling", "index"], "newlines-between" : "always"}],
    "no-console": "error",
    "max-classes-per-file": "off"
  },
  "overrides": [
    {
      "files": "**/__tests__/*",
      "rules": {
        "no-unused-expressions": "off",
        "no-undef": "off",
        "jest/expect-expect": "off"
      }
    }, {
      "files": "cypress/**/*",
      "rules": {
        "jest/valid-expect": "off",
        "jest/expect-expect": "off"
      } 

    }, {
      "files": ["scripts/**/*", "db/**/*"],
      "rules": {
        "no-console": "off",
        "import/no-extraneous-dependencies": "off"
      } 
    }
  ]
}
