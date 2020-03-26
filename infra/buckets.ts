import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as name, getTags as t } from './utils';

interface GetBucketsI {
  domain: string;
  mainDomain: string;
  namespace: string;
  certificateArn: pulumi.OutputInstance<string>;
  isPrivate: boolean;
  allowCors?: boolean;
  vpc?: awsx.ec2.Vpc;
  s3Endpoint?: aws.ec2.VpcEndpoint;
  comment: string;
}
const corsRules = () => [
  {
    allowedHeaders: ['*'],
    allowedMethods: ['PUT', 'POST', 'GET', 'HEAD', 'DELETE'],
    allowedOrigins: [`*`],
  },
];

export function createBucket({
  isPrivate = false,
  domain,
  namespace,
  certificateArn,
  allowCors = false,
  vpc,
  s3Endpoint,
  comment,
}: GetBucketsI) {
  function n(resource: string) {
    return name(`${namespace}-${resource}`);
  }

  /**
   * Origin Access Identity is the link between CF origins and S3 buckets
   */
  const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
    n('origin-access'),
    {
      comment: 'Origin Access Identity for private photo s3 relationship',
    },
  );

  /**
   * Actual S3 bucket. Set to private and delegate access through cloudfront
   */
  const privateBucket = new aws.s3.Bucket(n('private-bucket'), {
    acl: 'private',
    forceDestroy: true,
    ...(allowCors ? { corsRules: corsRules() } : {}),
    tags: t(n('private-bucket')),
  });

  /**
   * If VPC is specified, this bucket needs an extra policy to allow
   * access via VPC Gateway endpoint. In our case this is for the lambda
   * that needs bucket access, but the lambda is in a VPC.
   */
  const extra =
    vpc && s3Endpoint
      ? pulumi.interpolate`, {
    "Sid": "2",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "arn:aws:s3:::${privateBucket.bucket}/*",
    "Condition": {
        "StringEquals": {
            "aws:sourceVpc": "${vpc.vpc.id}"
        }
    }
  }, {
      "Sid": "3",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::${privateBucket.bucket}/*",
      "Condition": {
          "StringEquals": {
              "aws:sourceVpce": "${s3Endpoint.id}"
          }
      }
    }
  `
      : '';

  new aws.s3.BucketPolicy(n('private-photo-bucket-policy'), {
    bucket: privateBucket.bucket,
    policy: pulumi.interpolate`{
        "Version": "2008-10-17",
        "Id": "PolicyForCloudFrontPrivateContent",
        "Statement": [
          {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${originAccessIdentity.id}"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${privateBucket.bucket}/*"
          }${extra}
          
        ]
      }`,
  });

  const s3OriginId = 'S3PhotoOrigin';
  const s3Distribution = new aws.cloudfront.Distribution(n('private-distro'), {
    aliases: [domain], // Route 53 aliases
    comment,
    tags: t(n('private-distro')),
    defaultCacheBehavior: {
      allowedMethods: [
        'DELETE',
        'GET',
        'HEAD',
        'OPTIONS',
        'PATCH',
        'POST',
        'PUT',
      ],
      cachedMethods: ['GET', 'HEAD'],
      defaultTtl: 3600,
      forwardedValues: {
        cookies: {
          forward: 'none',
        },
        queryString: false,
        headers: [
          'Access-Control-Request-Headers',
          'Access-Control-Request-Method',
          'Origin',
        ],
      },
      maxTtl: 86400,
      minTtl: 0,
      targetOriginId: s3OriginId,

      viewerProtocolPolicy: 'allow-all',
    },
    defaultRootObject: 'index.html',
    enabled: true,
    isIpv6Enabled: true,
    orderedCacheBehaviors: [
      {
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD'],
        compress: true,
        defaultTtl: 3600,
        forwardedValues: {
          cookies: {
            forward: 'none',
          },
          queryString: false,
          headers: [
            'Access-Control-Request-Headers',
            'Access-Control-Request-Method',
            'Origin',
          ],
        },
        maxTtl: 86400,
        minTtl: 0,
        pathPattern: '/*',
        targetOriginId: s3OriginId,
        viewerProtocolPolicy: 'redirect-to-https',
        ...(isPrivate ? { trustedSigners: ['404112572358'] } : {}),
      },
    ],
    origins: [
      {
        domainName: privateBucket.bucketRegionalDomainName,
        originId: s3OriginId,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    priceClass: 'PriceClass_200',
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      acmCertificateArn: certificateArn,
      sslSupportMethod: 'sni-only',
    },
  });
  // Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
  function createAliasRecord(
    domain: string,
    distribution: aws.cloudfront.Distribution,
  ): aws.route53.Record {
    const config = new pulumi.Config();

    const zoneId = config.get('hostedZoneId') as string;

    return new aws.route53.Record(domain, {
      name: domain,
      zoneId,
      type: 'A',
      aliases: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    });
  }

  const aRecord = createAliasRecord(domain, s3Distribution);
  return {
    aRecord,
    bucket: privateBucket,
  };
}
