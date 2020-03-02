import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface MakeSnsI {
  vpc: awsx.ec2.Vpc;
  depLayer: aws.lambda.LayerVersion;
  lambdaRole: aws.iam.Role;
  repGroup: aws.elasticache.ReplicationGroup;
}

export function makeSns({ vpc, depLayer, lambdaRole, repGroup }: MakeSnsI) {
  const runtime = 'nodejs12.x';
  const topic = new aws.sns.Topic(n('svg-topic'));

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');
  const vpcLambda = new aws.lambda.Function(n('sns'), {
    tags: t(n('sns')),
    code,
    vpcConfig: {
      securityGroupIds: [vpc.vpc.defaultSecurityGroupId],
      subnetIds: [...vpc.publicSubnetIds, ...vpc.privateSubnetIds],
    },
    memorySize: 2048,
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

  topic.onEvent(n('event-handler'), vpcLambda, {});

  return { topic };
}
