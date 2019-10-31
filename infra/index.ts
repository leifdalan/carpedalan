import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { makeCerts, getDomainAndSubdomain } from './certs';
import { makeVpc } from './vpc';
import { getBuckets } from './buckets';
import { createECSResources } from './ecs';
import { makeDB } from './rds';
import { getSecrets } from './secrets';
import { getPolicies } from './policies';
import { getLambdas } from './lambdas';
import { getResourceName as n } from './utils';
async function main() {
  const accountNameSpace = 'dalan';

  const config = new pulumi.Config();

  const { secrets } = getSecrets({ config });

  const targetDomain = config.get('domain') as string;

  const [certificateArn, albCertificateArn] = makeCerts(
    targetDomain,
    accountNameSpace,
  );

  const { postgresSg, sg, vpc } = makeVpc(targetDomain, accountNameSpace);

  const { rds } = makeDB({ vpc, postgresSg, config });

  const { privateBucket, aRecord } = getBuckets({
    targetDomain,
    accountNameSpace,
    certificateArn,
  });

  const { taskRole, executionRole, lambdaRole } = getPolicies({
    secrets,
    privateBucket,
    rds,
  });

  const { layer } = getLambdas({
    lambdaRole,
    vpc,
    sg,
    privateBucket,
    postgresSg,
  });

  const { alb, taskDefinition } = createECSResources({
    vpc,
    albCertificateArn,
    sg,
    rds,
    postgresSg,
    config,
    taskRole,
    executionRole,
    secrets,
    aRecord,
    targetDomain,
  });

  const domainParts = getDomainAndSubdomain(targetDomain);
  const hostedZone = aws.route53.getZone({ name: domainParts.parentDomain });
  const aliasRecord = new aws.route53.Record(targetDomain, {
    name: targetDomain,
    zoneId: hostedZone.zoneId,
    type: 'A',
    aliases: [
      {
        name: alb.loadBalancer.dnsName,
        zoneId: alb.loadBalancer.zoneId,
        evaluateTargetHealth: true,
      },
    ],
  });
  return {
    secrets: secrets.pgUserSecret,
    layerArn: layer.arn,
    containers: taskDefinition.containers.web.image.imageResult,
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
