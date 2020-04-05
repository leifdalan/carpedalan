import * as fs from 'fs';
import * as path from 'path';

import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as mime from 'mime';

import { createBucket } from './buckets';
import { makeCerts } from './certs';
import { createECSResources } from './ecs';
import { getLambdas } from './lambdas';
import { getPolicies } from './policies';
import { makeDB } from './rds';
import { makeRedis } from './redis';
import { getSecrets } from './secrets';
import { makeSns } from './sns';
import { makeSqs } from './sqs';
import { getResourceName as n, createHashFromFile } from './utils';
import { makeVpc } from './vpc';

// const templateBody = fs
//   .readFileSync(path.join(__dirname, 'lambda-forward.yml'), 'utf8')
//   .toString();
async function main() {
  const config = new pulumi.Config();

  const { secrets } = getSecrets({ config });

  const targetDomain = config.get('domain') as string;

  const privateBucketCert = makeCerts({
    region: 'us-east-1',
    domain: `photos.${targetDomain}`,
    subDomains: [`photos.local.${targetDomain}`],
    namespace: 'photos',
  });

  const publicBucketCert = makeCerts({
    region: 'us-east-1',
    domain: `cdn.${targetDomain}`,
    subDomains: [`cdn.local.${targetDomain}`],
    namespace: 'assets',
  });

  const albCert = makeCerts({
    region: 'us-west-2',
    domain: targetDomain,
    subDomains: [`local.${targetDomain}`],
    namespace: 'main-domain',
  });

  // new aws.cloudformation.Stack(n('datadog'), {
  //   templateBody,
  //   capabilities: ['CAPABILITY_AUTO_EXPAND', 'CAPABILITY_IAM'],
  //   parameters: {
  //     DdApiKey: '97c81ab134520c1a5ba8325ebf2ec477',
  //   },
  // });

  const { vpc } = makeVpc();

  const { rds } = makeDB({ config, vpc });
  const { replicationGroup } = makeRedis();

  const privateDistroDomain = `photos.${targetDomain}`;
  const { bucket: privateBucket, aRecord } = createBucket({
    mainDomain: targetDomain,
    certificateArn: privateBucketCert,
    aliases: [privateDistroDomain, `photos.local.${targetDomain}`],
    namespace: 'private-photos',
    isPrivate: true,
    vpc,
    allowCors: true,
    comment: 'Distro for private photos, uses trusted signers',
  });

  const publicDistroDomain = `cdn.${targetDomain}`;
  const { bucket: publicBucket } = createBucket({
    mainDomain: targetDomain,
    certificateArn: publicBucketCert,
    aliases: [publicDistroDomain, `cdn.local.${targetDomain}`],
    namespace: 'public-cdn',
    isPrivate: false,
    allowCors: true,
    comment: 'Public CDN for static assets.',
  });

  // For each file in the directory, create an S3 object stored in `siteBucket`
  for (const item of fs.readdirSync(path.join(__dirname, '..', 'dist'))) {
    const filePath = path.join(__dirname, '..', 'dist', item);
    if (item !== 'manifest.json')
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

  const { queue } = makeSqs({
    depLayer,
    lambdaRole,
    repGroup: replicationGroup,
    bucket: privateBucket,
    vpc,
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

  // const configDomain = config.get('domain') as string;
  const zoneId = config.get('hostedZoneId') as string;

  // const hostedZone = aws.route53.getZone({ zoneId });
  new aws.route53.Record(targetDomain, {
    name: targetDomain,
    zoneId,
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
    assetBucket: publicBucket.bucket,
    cdnDomain: publicDistroDomain,
    replicationGroup: replicationGroup.primaryEndpointAddress,
    layerHash: sourceCodeHash,
    queue,
  };
}
module.exports = main();

// export const nameOfBucket = privateBucket.id;
