const path = require('path');

const src1 = path.join(__dirname);

module.exports = {
  includePaths: [src1],
  excludePatterns: [
    // No need to include `node_modules`. Vandelay will exclude that automatically.
    '**/*.test.*',
    /.*\/flow-typed\/.*/,
    /.*\/config\/.*/,
  ],
  importGroups: ['react', 'react-dom', 'redux', 'react-redux'],
  padCurlyBraces: true,
  useSingleQuotes: true,
  useSemicolons: true,
  multilineImportStyle: 'single',
  trailingComma: true,
  preferTypeOutside: true,
  maxImportLineLength: 80,
  nonModulePaths: ['src1'],
  /**
   * Webpack configured to use allow imports relative to the project root for anything in `src1`.
   *    - `nonModulePaths` config tells Vandelay that imports beginning with these paths should not be
   *      considered node_modules.
   *    - `processImportPath` config tells Vandelay to write paths for `src1` relative to the project root.
   */
};
