import * as crypto from 'crypto';
import * as fs from 'fs';

import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export function getResourceName(name: string) {
  return `${pulumi.getProject()}-${pulumi.getStack()}-${name}`;
}

interface Tag {
  [name: string]: string;
}
export function getTags(name?: string): aws.Tags {
  return {
    isPulumiGenerated: 'true',
    project: pulumi.getProject(),
    stack: pulumi.getStack(),
    ...(name ? { Name: name } : {}),
  };
}

export const createHashFromFile = (filePath: string): Promise<string> =>
  new Promise(resolve => {
    const hash = crypto.createHash('sha256');
    fs.createReadStream(filePath)
      .on('data', data => hash.update(data))
      .on('end', () => resolve(hash.digest('base64')));
  });
