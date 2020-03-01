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
  const subnetGroup = new aws.elasticache.SubnetGroup(n('redissubnet'), {
    subnetIds: vpc.privateSubnetIds,
  });

  const replicationGroup = new aws.elasticache.ReplicationGroup(
    'replicationGroup',
    {
      engine: 'redis',
      engineVersion: '5.0.6',
      nodeType: 'cache.t2.micro',
      replicationGroupDescription: 'hmmm?',
      replicationGroupId: 'repgroupid',
      securityGroupIds: [postgresSg.id],
      subnetGroupName: subnetGroup.name,
      clusterMode: {
        numNodeGroups: 1,
        replicasPerNodeGroup: 0,
      },
      applyImmediately: true,
      tags: t(n('replicationGroup')),
    },
  );

  const redis = new aws.elasticache.Cluster(n('svg'), {
    replicationGroupId: replicationGroup.id,
    clusterId: 'svg',
    tags: t(n('svg')),
  });

  return { redis, replicationGroup };
}
