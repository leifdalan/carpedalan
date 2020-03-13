import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface MakeSnsI {
  depLayer: aws.lambda.LayerVersion;
  lambdaRole: aws.iam.Role;
  repGroup: aws.elasticache.ReplicationGroup;
}

export function makeSqs({ depLayer, lambdaRole, repGroup }: MakeSnsI) {
  const runtime = 'nodejs12.x';
  const queue = new aws.sqs.Queue(n('pgidqueue'), {
    tags: t(n('pgidqueue')),
  });

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');
  const sqsProcessor = new aws.lambda.Function(n('sqsprocessor'), {
    tags: t(n('sqsprocessor')),
    code,
    memorySize: 1024,
    timeout: 45,
    handler: 'sns.sns',
    role: lambdaRole.arn,
    runtime,
    environment: {
      variables: {
        REDIS_URL: pulumi.interpolate`redis://${repGroup.primaryEndpointAddress}/0`,
      },
    },
    layers: [depLayer.arn],
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  queue.onEvent(n('sqs-event-handler'), sqsProcessor);
}
