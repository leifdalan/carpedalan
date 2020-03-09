/* eslint-disable no-console,import/no-extraneous-dependencies,no-restricted-syntax,no-await-in-loop,no-loop-func,no-nested-ternary */
import fs from 'fs';

import { compile } from 'json-schema-to-typescript';
import express from 'express';
// eslint-disable-next-line no-unused-vars
import dtsgenerator from 'dtsgenerator';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import groupBy from 'lodash/groupBy';

import initialize from '../api-v1/initialize';

const app = express();

const openApiDoc = initialize(app);

function getSchemaOrRef(obj) {
  if (obj.$ref) {
    const pathString = obj.$ref.substring(2).replace(/\//g, '.'); // eslint-disable-line
    return get(openApiDoc.apiDoc, pathString);
  }
  return obj;
}

async function main() {
  console.log('Generating TS API Client for client codebase...');
  console.time('Generated.');
  const { components, paths } = openApiDoc.apiDoc;
  const { schemas } = components;
  async function getDefinition({ schema, description, name }) {
    const schemaToCompile = getSchemaOrRef(schema);
    const result = await compile(
      {
        ...schemaToCompile,
        definitions: { components },
        components,
      },
      name,
      {
        bannerComment: description ? `` : '',
        declareExternallyReferenced: true,
        $refOptions: { resolve: { file: false } },
      },
    );
    return result;
  }

  const defs = [];
  const methodStrings = [];
  const schemaDefs = [];
  for (const schemaKey of Object.keys(schemas)) {
    const results = await compile(
      { ...schemas[schemaKey], definitions: { components }, components },
      `${schemaKey}I`,
      {
        bannerComment: '',
        declareExternallyReferenced: true,
        $refOptions: { resolve: { file: false } },
      },
    );
    schemaDefs.push(results);
  }

  for (const apiPath of Object.keys(paths)) {
    const { parameters, ...rest } = paths[apiPath];

    for (const method of Object.keys(rest)) {
      let thisApiPath = apiPath;
      let extras = '';
      const {
        description,
        operationId,
        requestBody,
        parameters: params,
        responses,
      } = rest[method];
      const requestBodyName = `${operationId}RequestBodyI`;
      const responseBodyName = `${operationId}ResponseBodyI`;
      let requestBodyDef;

      let responseBodyDef;

      if (responses) {
        for (const response of Object.keys(responses)) {
          // only success responses

          if (response[0] === '2' && responses[response].content) {
            responseBodyDef = await getDefinition({
              schema: responses[response].content['application/json'].schema,
              description: responses[response].description,
              name: responseBodyName,
            });

            defs.push(responseBodyDef);
          }
        }
      }
      if (requestBody) {
        requestBodyDef = await getDefinition({
          schema: requestBody.content['application/json'].schema,
          description: requestBody.description,
          name: requestBodyName,
        });

        defs.push(requestBodyDef);
      }
      let queryDef;
      const queryDefName = `${operationId}QueryI`;
      let pathDef;
      const pathDefName = `${operationId}PathI`;
      if (params && params.length) {
        const grouped = groupBy(params, 'in');
        const { query, path: pathsFromGroup } = grouped;
        const querySchema =
          query &&
          query.reduce(
            (acc, q) => ({
              ...acc,
              properties: {
                ...acc.properties,
                [q.name]: q.schema,
              },
              required: [...acc.required, ...(q.required ? [q.name] : [])],
            }),
            {
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            },
          );

        if (querySchema) {
          queryDef = await getDefinition({
            schema: querySchema,
            name: queryDefName,
            description: querySchema.description,
          });
          defs.push(queryDef);
        }

        // PATH STUFF
        if (pathsFromGroup && pathsFromGroup.length) {
          const pathSchema = pathsFromGroup.reduce(
            (acc, p) => ({
              ...acc,
              properties: {
                ...acc.properties,
                [p.name]: p.schema,
              },
              required: [...acc.required, ...(p.required ? [p.name] : [])],
            }),
            {
              type: 'object',
              properties: {},
              required: [],
              additionalProperties: false,
            },
          );
          if (pathSchema) {
            pathDef = await getDefinition({
              schema: pathSchema,
              name: pathDefName,
              description: pathSchema.description,
            });
            thisApiPath = apiPath.replace(/{/g, '${');
            extras = pathsFromGroup
              .map(p => `const { ${p.name} } = requestParams;`)
              .join('\n');
            defs.push(pathDef);
          }
        }
      }

      const requestType =
        upperFirst(
          requestBodyDef
            ? requestBodyName
            : queryDef
            ? queryDefName
            : undefined,
        ) || 'undefined';
      let argType;

      if (requestBodyDef && pathDef) {
        argType = `{ requestBody, requestParams }: BodyAndPath<${requestType}, ${upperFirst(
          pathDefName,
        )}>`;
      } else if (requestBodyDef || queryDef) {
        argType = `{ requestBody }: BodyOnly<${requestType}>`;
      } else if (pathDef) {
        argType = `{ requestParams }: PathOnly<${upperFirst(pathDefName)}>`;
      } else {
        argType = '';
      }

      const responseType = responseBodyDef
        ? upperFirst(responseBodyName)
        : 'void';

      let functionArgs;
      if (['get', 'delete'].includes(method.toLowerCase())) {
        functionArgs = requestBodyDef
          ? `(\`/v1${thisApiPath}\${stringify(requestBody)}\`)`
          : `(\`/v1${thisApiPath}\`)`;
      } else {
        functionArgs = requestBodyDef
          ? `(\`/v1${thisApiPath}\`, requestBody)`
          : `(\`/v1${thisApiPath}\`)`;
      }

      const methodString = `
  /**
   * ${description}
   *
   * @returns {Promise<${responseType} | ErrorI>}
   */      
  public async ${operationId}(${argType}) {
    try {
      ${extras}
      const { data } = await axios.${method}<${responseType}>${functionArgs};
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }
`;
      methodStrings.push(methodString);
    }
  }
  const ApiClientCode = `
  
import axios from 'axios';
import { stringify } from 'qs';

interface BodyOnly<T> {
  requestBody: T;
}

interface PathOnly<T> {
  requestParams: T;
}

interface BodyAndPath<T, U> {
  requestBody: T;
  requestParams: U;
}
${schemaDefs.join('\n')}
${defs.join('\n')}

export default class ApiClient {
  ${methodStrings.join('\n')}
}

export const client = new ApiClient();

`;
  fs.writeFileSync('ApiClient.ts', ApiClientCode, 'utf8');
  console.timeEnd('Generated.');
}
main();
