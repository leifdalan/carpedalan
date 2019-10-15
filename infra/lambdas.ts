import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';

interface LambdaI {
  lambdaRole: aws.iam.Role;
  vpc: awsx.ec2.Vpc;
  sg: awsx.ec2.SecurityGroup;
}

export function getLambdas({ lambdaRole, vpc, sg }: LambdaI) {
  const layerArchive = new pulumi.asset.FileArchive('./imageResizer/layer/');

  const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
    compatibleRuntimes: ['nodejs8.10'],
    code: layerArchive,
    layerName: n('dep-layer'),
  });

  const code = new pulumi.asset.FileArchive('./imageResizer/src/');
  const photoLambda = new aws.lambda.Function(n('photo-lambda'), {
    vpcConfig: {
      securityGroupIds: [sg.securityGroup.id],
      subnetIds: [...vpc.privateSubnetIds, ...vpc.publicSubnetIds],
      vpcId: vpc.id,
    },
    memorySize: 2048,
    timeout: 1000 * 30,
    code,
    handler: 'index.handler',
    role: lambdaRole.arn,
    runtime: 'nodejs8.10',
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });
}
