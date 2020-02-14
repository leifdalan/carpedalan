import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface LambdaI {
  lambdaRole: aws.iam.Role;
  vpc: awsx.ec2.Vpc;
  sg: awsx.ec2.SecurityGroup;
  postgresSg: awsx.ec2.SecurityGroup;
  privateBucket: aws.s3.Bucket;
  rds: aws.rds.Instance;
}

export function getLambdas({
  lambdaRole,
  vpc,
  sg,
  privateBucket,
  postgresSg,
  rds,
}: LambdaI) {
  const layerArchive = new pulumi.asset.FileArchive('../imageResizer/layer/');

  const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
    compatibleRuntimes: ['nodejs12.x'],
    code: layerArchive,
    layerName: n('dep-layer'),
    // sourceCodeHash: layerHash,
  });

  const code = new pulumi.asset.FileArchive('../imageResizer/src/');

  const photoLambda = new aws.lambda.Function(n('photo-lambda'), {
    code,
    vpcConfig: {
      securityGroupIds: [sg.securityGroup.id, postgresSg.securityGroup.id],
      subnetIds: [...vpc.privateSubnetIds, ...vpc.publicSubnetIds],
    },
    memorySize: 2048,
    timeout: 45,
    handler: 'image.imageResizer',
    role: lambdaRole.arn,
    runtime: 'nodejs12.x',
    layers: [depLayer.arn],
    environment: {
      variables: {
        PG_URI: rds.endpoint,
      },
    },
    tags: t(),
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  privateBucket.onObjectCreated(n('bucket-handler'), photoLambda, {
    filterPrefix: 'raw/',
  });
  return { layer: depLayer };
}
