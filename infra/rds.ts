import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface MakeDBI {
  vpc: awsx.ec2.Vpc;
  config: pulumi.Config;
}

export function makeDB({ vpc, config }: MakeDBI) {
  const username = config.getSecret('pg_user');
  const password = config.getSecret('pg_password');
  // const subnetGroup = new aws.rds.SubnetGroup(n('pulumisubnet'), {
  //   subnetIds: vpc.privateSubnetIds,
  //   tags: t(n('pulumisubnet')),
  // });

  const rds = new aws.rds.Instance(n('rds'), {
    username,
    password,
    allowMajorVersionUpgrade: true,
    instanceClass: 'db.t2.micro',
    applyImmediately: true,
    availabilityZone: vpc.publicSubnets[0].subnet.availabilityZone,
    // dbSubnetGroupName: subnetGroup.name,
    engine: 'postgres',
    name: 'carpedalan',
    port: 5432,
    publiclyAccessible: true,
    allocatedStorage: 20,
    skipFinalSnapshot: true,
    tags: t(n('rds')),
  });

  return { rds };
}
