import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { AllSecrets } from './secrets';
import { getResourceName as n, getTags as t } from './utils';

interface LambdaI extends AllSecrets {
  lambdaRole: aws.iam.Role;
  vpc: awsx.ec2.Vpc;
  sg: awsx.ec2.SecurityGroup;
  postgresSg: awsx.ec2.SecurityGroup;
  privateBucket: aws.s3.Bucket;
  rds: aws.rds.Instance;
}

export async function getLambdas({
  lambdaRole,
  vpc,
  sg,
  privateBucket,
  postgresSg,
  rds,
  pgUserSecret,
  pgPasswordSecret,
}: LambdaI) {
  // const layerArchive = new pulumi.asset.FileArchive(
  //   '../imageResizer/layer/layer.zip',
  // );

  // const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
  //   compatibleRuntimes: ['nodejs12.x'],
  //   code: layerArchive,
  //   layerName: n('dep-layer'),
  //   // sourceCodeHash: layerHash,
  // });
  const privateSubnets = await vpc.privateSubnetIds;
  const publicSubnets = await vpc.publicSubnetIds;
  const code = new pulumi.asset.FileArchive('../imageResizer/src/');

  const photoLambda = new aws.lambda.Function(n('photo-lambda'), {
    code,
    vpcConfig: {
      securityGroupIds: [sg.securityGroup.id, postgresSg.securityGroup.id],
      subnetIds: [...privateSubnets, ...publicSubnets],
    },
    memorySize: 2048,
    timeout: 45,
    handler: 'image.imageResizer',
    role: lambdaRole.arn,
    runtime: 'nodejs12.x',
    // layers: [depLayer.arn],
    environment: {
      variables: {
        PG_HOST: rds.endpoint,
        PG_USER_SECRET_ID: pgUserSecret.name,
        PG_PASSWORD_SECRET_ID: pgPasswordSecret.name,
      },
    },
    tags: t(),
    description:
      'A process to create thumbnails, upload them to s3, and update the database',
  });

  privateBucket.onObjectCreated(n('bucket-handler'), photoLambda, {
    filterPrefix: 'raw/',
  });
  // return { layer: depLayer };
}
