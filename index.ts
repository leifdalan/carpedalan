import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { makeCerts, getDomainAndSubdomain } from './infra/certs';
import { makeVpc } from './infra/vpc';
import { getBuckets } from './infra/buckets';
import { createECSResources } from './infra/ecs';
import { makeDB } from './infra/rds';
import { getSecrets } from './infra/secrets';
import { getPolicies } from './infra/policies';
import { getLambdas } from './infra/lambdas';
import { getResourceName as n } from './infra/utils';
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

  const { privateBucket } = getBuckets({
    targetDomain,
    accountNameSpace,
    certificateArn,
  });

  const { taskRole, executionRole, lambdaRole } = getPolicies({
    secrets,
    privateBucket,
  });

  const { layer } = getLambdas({
    lambdaRole,
    vpc,
    sg,
    privateBucket,
    postgresSg,
  });

  const { alb } = createECSResources({
    vpc,
    albCertificateArn,
    sg,
    rds,
    postgresSg,
    config,
    taskRole,
    executionRole,
    secrets,
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
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
