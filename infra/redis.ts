import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { getResourceName as n, getTags as t } from './utils';

interface MakeDBI {
  vpc?: awsx.ec2.Vpc;
}

export function makeRedis() {
  const replicationGroup = new aws.elasticache.ReplicationGroup(
    'replicationGroup',
    {
      engine: 'redis',
      engineVersion: '5.0.6',
      nodeType: 'cache.t2.micro',
      replicationGroupDescription: 'hmmm?',
      replicationGroupId: 'repgroupid',
      clusterMode: {
        numNodeGroups: 1,
        replicasPerNodeGroup: 0,
      },
      applyImmediately: true,
      tags: t(n('replicationGroup')),
    },
    { ignoreChanges: ['clusterMode'] },
  );

  const redis = new aws.elasticache.Cluster(n('svg'), {
    replicationGroupId: replicationGroup.id,
    clusterId: 'svg',
    tags: t(n('svg')),
  });

  return { redis, replicationGroup };
}
