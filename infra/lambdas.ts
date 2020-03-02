import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { AllSecrets } from './secrets';
import { getResourceName as n, getTags as t } from './utils';

interface LambdaI extends AllSecrets {
  lambdaRole: aws.iam.Role;
  privateBucket: aws.s3.Bucket;
  rds: aws.rds.Instance;
  topic: aws.sns.Topic;
  depLayer: aws.lambda.LayerVersion;
}

export function getLambdas({
  lambdaRole,
  privateBucket,
  rds,
  pgUserSecret,
  pgPasswordSecret,
  topic,
  depLayer,
}: LambdaI) {
  const runtime = 'nodejs12.x';
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
        TOPIC_ARN: topic.arn,
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
