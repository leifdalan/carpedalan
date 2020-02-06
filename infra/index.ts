import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { makeCerts, getDomainAndSubdomain } from './certs';
import { makeVpc } from './vpc';
import { createBucket } from './buckets';
import { createECSResources } from './ecs';
import { makeDB } from './rds';
import { getSecrets } from './secrets';
import { getPolicies } from './policies';
import { getLambdas } from './lambdas';
import { getResourceName as n } from './utils';
import * as mime from 'mime';
import * as path from 'path';
async function main() {
  const accountNameSpace = 'dalan';

  const config = new pulumi.Config();

  const { secrets } = getSecrets({ config });

  const targetDomain = config.get('domain') as string;

  const privateBucketCert = makeCerts({
    region: 'us-east-1',
    domain: `photos.${targetDomain}`,
    namespace: 'photos',
  });

  const publicBucketCert = makeCerts({
    region: 'us-east-1',
    domain: `cdn.${targetDomain}`,
    namespace: 'assets',
  });

  const albCert = makeCerts({
    region: 'us-east-1',
    domain: targetDomain,
    namespace: 'main',
  });

  const newCert = makeCerts({
    region: 'us-west-2',
    domain: targetDomain,
    namespace: 'main-domain',
  });

  const { postgresSg, sg, vpc } = makeVpc(targetDomain, accountNameSpace);

  const { rds } = makeDB({ vpc, postgresSg, config });

  const privateDistroDomain = `photos.${targetDomain}`;
  const { bucket: privateBucket, aRecord } = createBucket({
    mainDomain: targetDomain,
    certificateArn: privateBucketCert,
    domain: privateDistroDomain,
    namespace: 'private-photos',
    isPrivate: true,
  });

  const publicDistroDomain = `cdn.${targetDomain}`;
  const { bucket: publicBucket } = createBucket({
    mainDomain: targetDomain,
    certificateArn: publicBucketCert,
    domain: publicDistroDomain,
    namespace: 'public-cdn',
    isPrivate: false,
  });

  // For each file in the directory, create an S3 object stored in `siteBucket`
  const siteDir = './dist';
  for (const item of require('fs').readdirSync(
    path.join(__dirname, '..', 'dist'),
  )) {
    const filePath = path.join(__dirname, '..', 'dist', item);
    const object = new aws.s3.BucketObject(item, {
      bucket: publicBucket,
      source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
      contentEncoding: 'gzip',
    });
  }

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
    rds,
  });

  const { alb, taskDefinition } = createECSResources({
    vpc,
    sg,
    rds,
    postgresSg,
    config,
    taskRole,
    executionRole,
    secrets,
    aRecord,
    targetDomain,
    privateDistroDomain,
    publicDistroDomain,
    publicBucket,
    albCertificateArn: newCert,
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
    assetBucket: publicBucket.bucket,
    cdnDomain: publicDistroDomain,
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
