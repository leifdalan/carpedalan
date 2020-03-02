import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { AllSecrets } from './secrets';
import { getResourceName as n, getTags as t } from './utils';

interface LambdaI extends AllSecrets {
  lambdaRole: aws.iam.Role;
  privateBucket: aws.s3.Bucket;
  rds: aws.rds.Instance;
}

export function getLambdas({
  lambdaRole,

  privateBucket,
  rds,
  pgUserSecret,
  pgPasswordSecret,
}: LambdaI) {
  const runtime = 'nodejs12.x';
  /**
   * Have to use a zip to upload as the AWS CLI has a had limit on
   * a single upload, whether its a batch of files or a zip of the same
   * set of files.
   */
  const layerArchive = new pulumi.asset.FileArchive(
    '../imageResizer/layer/layer.zip',
  );

  const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
    compatibleRuntimes: [runtime],
    code: layerArchive,
    layerName: n('dep-layer'),
    // sourceCodeHash: layerHash,
  });

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');

  const photoLambda = new aws.lambda.Function(n('photo-lambda'), {
    tags: t(n('photo-lambda')),
    code,
    memorySize: 2048,
    timeout: 45,
    handler: 'image.imageResizer',
    role: lambdaRole.arn,
    runtime,
    layers: [depLayer.arn],
    environment: {
      variables: {
        PG_HOST: rds.endpoint,
        // Lambda will use secretsManager to retrieve these values at runtime.
        PG_USER_SECRET_ID: pgUserSecret.name,
        PG_PASSWORD_SECRET_ID: pgPasswordSecret.name,
      },
    },
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  /**
   * Event Subscription! This is the definition for the trigger event
   * that will fire the lambda.
   */
  privateBucket.onObjectCreated(n('bucket-handler'), photoLambda, {
    filterPrefix: 'raw/',
  });
  return { layer: depLayer };
}
