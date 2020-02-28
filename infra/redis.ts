import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface MakeDBI {
  vpc: awsx.ec2.Vpc;
  postgresSg: awsx.ec2.SecurityGroup;
  config: pulumi.Config;
}

export function makeRedis({ vpc, postgresSg }: MakeDBI) {
  const subnetGroup = new aws.elasticache.SubnetGroup('redissubnet', {
    subnetIds: vpc.privateSubnetIds,
  });

  const redis = new aws.elasticache.Cluster('svg', {
    engine: 'redis',
    engineVersion: '5.0.6',
    numCacheNodes: 1,
    nodeType: 'cache.t2.micro',
    parameterGroupName: 'default.redis5.0',
    port: 6379,
    securityGroupIds: [postgresSg.id],
    applyImmediately: true,
    availabilityZone: vpc.privateSubnets[0].subnet.availabilityZone,
    subnetGroupName: subnetGroup.name,
    clusterId: 'svg',
  });

  return { redis };
}
