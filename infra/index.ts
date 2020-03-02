import * as fs from 'fs';
import * as path from 'path';

import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as mime from 'mime';

import { createBucket } from './buckets';
import { makeCerts, getDomainAndSubdomain } from './certs';
import { createECSResources } from './ecs';
import { getLambdas } from './lambdas';
import { getPolicies } from './policies';
import { makeDB } from './rds';
import { getSecrets } from './secrets';
import { makeVpc } from './vpc';

async function main() {
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
    region: 'us-west-2',
    domain: targetDomain,
    namespace: 'main-domain',
  });

  const { vpc } = makeVpc();

  const { rds } = makeDB({ config, vpc });

  const privateDistroDomain = `photos.${targetDomain}`;
  const { bucket: privateBucket, aRecord } = createBucket({
    mainDomain: targetDomain,
    certificateArn: privateBucketCert,
    domain: privateDistroDomain,
    namespace: 'private-photos',
    isPrivate: true,
    vpc,
  });

  const publicDistroDomain = `cdn.${targetDomain}`;
  const { bucket: publicBucket } = createBucket({
    mainDomain: targetDomain,
    certificateArn: publicBucketCert,
    domain: publicDistroDomain,
    namespace: 'public-cdn',
    isPrivate: false,
    allowCors: true,
  });

  // For each file in the directory, create an S3 object stored in `siteBucket`
  for (const item of fs.readdirSync(path.join(__dirname, '..', 'dist'))) {
    const filePath = path.join(__dirname, '..', 'dist', item);
    new aws.s3.BucketObject(item, {
      bucket: publicBucket,
      source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
      ...(item === 'report.html' ? {} : { contentEncoding: 'gzip' }),
    });
  }

  // For each file in the directory, create an S3 object stored in `siteBucket`
  for (const item of fs.readdirSync(path.join(__dirname, '..', 'public'))) {
    const filePath = path.join(__dirname, '..', 'public', item);
    new aws.s3.BucketObject(item, {
      bucket: publicBucket,
      source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
  }

  const {
    taskRole,
    executionRole,
    lambdaRole,
    bucketUserCredSecret,
    bucketUserCreds,
  } = getPolicies({
    secrets,
    privateBucket,
    rds,
  });

  const { layer } = getLambdas({
    lambdaRole,
    privateBucket,
    rds,
    ...secrets,
  });

  const { alb, taskDefinition } = createECSResources({
    rds,
    config,
    taskRole,
    executionRole,
    secrets,
    aRecord,
    targetDomain,
    privateDistroDomain,
    publicDistroDomain,
    publicBucket,
    bucketUserCredSecret,
    bucketUserCreds,
    albCertificateArn: albCert,
    vpc,
  });

  const domainParts = getDomainAndSubdomain(targetDomain);
  const hostedZone = aws.route53.getZone({ name: domainParts.parentDomain });
  new aws.route53.Record(targetDomain, {
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
    revisionNumber: taskDefinition.taskDefinition.revision,
    layerArn: layer.arn,
    containers: taskDefinition.containers.web.image.imageResult,
    assetBucket: publicBucket.bucket,
    cdnDomain: publicDistroDomain,
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
