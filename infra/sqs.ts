import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface MakeSnsI {
  depLayer: aws.lambda.LayerVersion;
  lambdaRole: aws.iam.Role;
  repGroup: aws.elasticache.ReplicationGroup;
  bucket: aws.s3.Bucket;
  vpc: awsx.ec2.Vpc;
}

export function makeSqs({
  depLayer,
  lambdaRole,
  repGroup,
  bucket,
  vpc,
}: MakeSnsI) {
  const TIMEOUT = 45;
  const runtime = 'nodejs12.x';
  const deadQueue = new aws.sqs.Queue(n('dead-queue'), {
    tags: t(n('dead-queue')),
    visibilityTimeoutSeconds: TIMEOUT + 1,
  });
  const queue = new aws.sqs.Queue(n('pgidqueue'), {
    tags: t(n('pgidqueue')),
    visibilityTimeoutSeconds: TIMEOUT + 1,
    redrivePolicy: pulumi.interpolate`
    {
      "deadLetterTargetArn": "${deadQueue.arn}",
      "maxReceiveCount": 2
    }
    `,
  });

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');
  const sqsProcessor = new aws.lambda.Function(n('sqsprocessor'), {
    tags: t(n('sqsprocessor')),
    code,
    memorySize: 1024,
    timeout: TIMEOUT,
    handler: 'sqs.sqs',
    role: lambdaRole.arn,
    runtime,
    environment: {
      variables: {
        REDIS_URL: pulumi.interpolate`redis://${repGroup.primaryEndpointAddress}/0`,
        BUCKET: pulumi.interpolate`${bucket.bucket}`,
      },
    },
    vpcConfig: {
      securityGroupIds: [vpc.vpc.defaultSecurityGroupId],
      subnetIds: [...vpc.publicSubnetIds, ...vpc.privateSubnetIds],
    },
    layers: [depLayer.arn],
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  queue.onEvent(n('sqs-event-handler'), sqsProcessor, {
    batchSize: 1,
  });
  return {
    queue,
  };
}
