/* eslint-disable no-console,import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';

import express from 'express';
// eslint-disable-next-line no-unused-vars
import dtsgenerator from 'dtsgenerator';

import initialize from '../api-v1/initialize';

const app = express();

const openApiDoc = initialize(app);
console.error('Object.keys(openApiDoc)', Object.keys(openApiDoc.apiDoc.paths));
fs.writeFileSync(
  path.join(process.cwd(), '..', 'swagtestdelete', 'swagger.json'),
  JSON.stringify({ definitions: openApiDoc.originalApiDoc }, null, 2),
  'utf8',
);

// async function main() {
//   try {
//     const definitionContents = await dtsgenerator({
//       contents: [openApiDoc.apiDoc],
//     });
//     // fs.writeFileSync(
//     //   path.join(process.cwd(), 'swaggerSchema.d.ts'),
//     //   definitionContents,
//     //   'utf8',
//     // );
//     console.log('Regenerated OpenAPI typedefs to swaggerSchema.d.ts');
//   } catch (e) {
//     console.log('Error parsing swagger doc!');
//     console.error('e', e);
//   }
// }
// main();
