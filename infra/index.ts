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
import { makeRedis } from './redis';
import { getSecrets } from './secrets';
import { makeSns } from './sns';
// import { makeSqs } from './sqs';
import { getResourceName as n, createHashFromFile } from './utils';
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
  const { redis, replicationGroup } = makeRedis();

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
      cacheControl: 'max-age=31536000',
      bucket: publicBucket,
      source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
      ...(item === 'report.html' ? {} : { contentEncoding: 'br' }),
    });
  }

  // For each file in the directory, create an S3 object stored in `siteBucket`
  for (const item of fs.readdirSync(path.join(__dirname, '..', 'public'))) {
    const filePath = path.join(__dirname, '..', 'public', item);
    new aws.s3.BucketObject(item, {
      bucket: publicBucket,
      source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
      cacheControl: 'max-age=31536000',
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
    redis,
  });

  const runtime = 'nodejs12.x';
  /**
   * Have to use a zip to upload as the AWS CLI has a had limit on
   * a single upload, whether its a batch of files or a zip of the same
   * set of files.
   */
  const layerArchive = new pulumi.asset.FileArchive(
    '../imageResizer/layer/layer.zip',
  );

  const sourceCodeHash = await createHashFromFile(
    '../imageResizer/layer/layer.zip',
  );
  const depLayer = new aws.lambda.LayerVersion(n('dep-layer'), {
    compatibleRuntimes: [runtime],
    code: layerArchive,
    layerName: n('dep-layer'),

    sourceCodeHash,
  });
  const { topic } = makeSns({
    vpc,
    depLayer,
    lambdaRole,
    repGroup: replicationGroup,
  });
  const { layer } = getLambdas({
    lambdaRole,
    topic,
    privateBucket,
    rds,
    depLayer,
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
    repGroup: replicationGroup,
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
    replicationGroup: replicationGroup.primaryEndpointAddress,
    layerHash: sourceCodeHash,
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
