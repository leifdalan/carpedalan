import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface PolicyI {
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
    adminPassword: aws.secretsmanager.Secret;
    publicPassword: aws.secretsmanager.Secret;
    sessionSecret: aws.secretsmanager.Secret;
    cfKeySecret: aws.secretsmanager.Secret;
  };
  rds: aws.rds.Instance;
  privateBucket: aws.s3.Bucket;
}
export function getPolicies({ secrets, privateBucket, rds }: PolicyI) {
  /**
   * User created that will be used for the webserver to create signed
   * policies on behalf of the end-user for direct uploads to the private
   * photo bucket.
   */
  const bucketUser = new aws.iam.User(n('private-bucket-user'), {
    tags: t(n('private-bucket-user')),
  });

  const bucketUserCreds = pulumi.secret(
    new aws.iam.AccessKey(n('bucket-access-key'), {
      user: bucketUser.name,
    }),
  );

  const bucketUserCredSecret = new aws.secretsmanager.Secret(
    n('bucket-access-key-secret'),
    {
      tags: t(n('bucket-access-key-secret')),
    },
  );

  /**
   * Storing this as a SecretsManager secret so that ECS can use
   * `valueFrom` rather than `value` so that the value is never exposed
   * to anyone with console access to AWS.
   */
  new aws.secretsmanager.SecretVersion(n('bucket-access-key-s'), {
    secretId: bucketUserCredSecret.id,
    secretString: bucketUserCreds.secret,
  });

  const policy = new aws.iam.Policy('allow-s3-management-policy', {
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: '*',
          Resource: pulumi.interpolate`${privateBucket.arn}/*`,
        },
      ],
    },
  });

  /**
   * Attach a policy to the bucket user that allows S3 access to the bucket,
   * as the generated signed policy will need PUT access to upload to the bucket
   * directly.
   */
  new aws.iam.UserPolicy(n('end-user-bucket-policy'), {
    user: bucketUser.name,
    policy: policy.policy,
  });

  /**
   * Using default roles for tasks and execution for ECS.
   */
  const taskRole = new aws.iam.Role(n('task-role'), {
    assumeRolePolicy: JSON.stringify(
      awsx.ecs.TaskDefinition.defaultRoleAssumeRolePolicy(),
    ),
    tags: t(n('task-role')),
  });

  const executionRole = new aws.iam.Role(n('execution-role'), {
    assumeRolePolicy: JSON.stringify(
      awsx.ecs.TaskDefinition.defaultRoleAssumeRolePolicy(),
    ),
    tags: t(n('execution-role')),
  });

  /**
   * Task role policy must include permissions needed to spin up, access
   * resources like secrets that are used to embed environment variables
   * in containers.
   */
  new aws.iam.RolePolicy(
    n('task-role-policy'),
    {
      role: taskRole,
      policy: pulumi
        .all([
          secrets.privateKeySecret.arn,
          secrets.pgUserSecret.arn,
          secrets.pgPasswordSecret.arn,
          secrets.adminPassword.arn,
          secrets.publicPassword.arn,
          secrets.sessionSecret.arn,
          secrets.cfKeySecret.arn,
          rds.arn,
          bucketUserCredSecret.arn,
        ])
        .apply(
          ([
            secretArn,
            pgArn,
            pgSecretArn,
            admin,
            publicPass,
            session,
            cfKey,
            rdsArn,
            bucketUserCredSecretArn,
          ]) =>
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'ssm:GetParameters',
                    'secretsmanager:GetSecretValue',
                    'kms:Decrypt',
                  ],
                  Resource: [
                    secretArn,
                    pgArn,
                    pgSecretArn,
                    admin,
                    publicPass,
                    session,
                    cfKey,
                    bucketUserCredSecretArn,
                    // key id?
                  ],
                },
                {
                  Effect: 'Allow',
                  Action: [
                    'cloudformation:DescribeChangeSet',
                    'cloudformation:DescribeStackResources',
                    'cloudformation:DescribeStacks',
                    'cloudformation:GetTemplate',
                    'cloudformation:ListStackResources',
                    'cloudwatch:*',
                    'cognito-identity:ListIdentityPools',
                    'cognito-sync:GetCognitoEvents',
                    'cognito-sync:SetCognitoEvents',
                    'dynamodb:*',
                    'ec2:DescribeSecurityGroups',
                    'ec2:DescribeSubnets',
                    'ec2:DescribeVpcs',
                    'events:*',
                    'iam:GetPolicy',
                    'iam:GetPolicyVersion',
                    'iam:GetRole',
                    'iam:GetRolePolicy',
                    'iam:ListAttachedRolePolicies',
                    'iam:ListRolePolicies',
                    'iam:ListRoles',
                    'iam:PassRole',
                    'iot:AttachPrincipalPolicy',
                    'iot:AttachThingPrincipal',
                    'iot:CreateKeysAndCertificate',
                    'iot:CreatePolicy',
                    'iot:CreateThing',
                    'iot:CreateTopicRule',
                    'iot:DescribeEndpoint',
                    'iot:GetTopicRule',
                    'iot:ListPolicies',
                    'iot:ListThings',
                    'iot:ListTopicRules',
                    'iot:ReplaceTopicRule',
                    'kinesis:DescribeStream',
                    'kinesis:ListStreams',
                    'kinesis:PutRecord',
                    'kms:ListAliases',
                    'lambda:*',
                    'logs:*',
                    's3:*',
                    'sns:ListSubscriptions',
                    'sns:ListSubscriptionsByTopic',
                    'sns:ListTopics',
                    'sns:Publish',
                    'sns:Subscribe',
                    'sns:Unsubscribe',
                    'sqs:ListQueues',
                    'sqs:SendMessage',
                    'tag:GetResources',
                    'xray:PutTelemetryRecords',
                    'xray:PutTraceSegments',
                  ],
                  Resource: '*',
                },
                {
                  Effect: 'Allow',
                  Action: ['rds-db:connect'],
                  Resource: [rdsArn],
                },
              ],
            }),
        ),
    },
    { dependsOn: secrets.privateKeySecret },
  );

  /**
   * "Execute" policy are all permissions needed in the runtime of the container,
   * including AWS services access. e.g. RDS connection
   */
  new aws.iam.RolePolicy(
    n('execute-role-policy'),
    {
      role: executionRole,
      policy: pulumi
        .all([
          secrets.privateKeySecret.arn,
          secrets.pgUserSecret.arn,
          secrets.pgPasswordSecret.arn,
          secrets.adminPassword.arn,
          secrets.publicPassword.arn,
          secrets.sessionSecret.arn,
          secrets.cfKeySecret.arn,
          rds.arn,
          bucketUserCredSecret.arn,
        ])
        .apply(
          ([
            secretArn,
            pgArn,
            pgSecretArn,
            admin,
            publicPass,
            session,
            cfKey,
            rdsArn,
            bucketUserCredSecretArn,
          ]) =>
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: [
                    'ssm:GetParameters',
                    'secretsmanager:GetSecretValue',
                    'kms:Decrypt',
                  ],
                  Resource: [
                    secretArn,
                    pgArn,
                    pgSecretArn,
                    admin,
                    publicPass,
                    session,
                    cfKey,
                    bucketUserCredSecretArn,
                    // key id?
                  ],
                },
                {
                  Effect: 'Allow',
                  Action: [
                    'ecr:GetAuthorizationToken',
                    'ecr:BatchCheckLayerAvailability',
                    'ecr:GetDownloadUrlForLayer',
                    'ecr:BatchGetImage',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                  ],
                  Resource: '*',
                },
                {
                  Effect: 'Allow',
                  Action: ['rds-db:connect'],
                  Resource: [rdsArn],
                },
              ],
            }),
        ),
    },
    { dependsOn: secrets.privateKeySecret },
  );

  const lambdaRole = new aws.iam.Role(n('lambda-role'), {
    assumeRolePolicy: `{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }`,
    tags: t(n('lambda-role')),
  });

  /**
   * Resources the lambda needs to access other AWS resources
   */
  new aws.iam.RolePolicy(n('lambda-role-policy'), {
    role: lambdaRole,
    policy: pulumi
      .all([
        privateBucket.arn,
        secrets.pgUserSecret.arn,
        secrets.pgPasswordSecret.arn,
        rds.arn,
      ])
      .apply(([bucketArn, pgUserArn, pgPasswordArn, rdsArn]) =>
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'ec2:*',
              ],
              Resource: 'arn:aws:logs:*:*:*',
            },
            {
              Effect: 'Allow',
              Action: [
                'ec2:CreateNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DeleteNetworkInterface',
              ],

              Resource: '*',
            },
            {
              Effect: 'Allow',
              Action: ['s3:GetBucketLocation', 's3:ListAllMyBuckets'],
              Resource: 'arn:aws:s3:::*',
            },
            {
              Effect: 'Allow',
              Action: 's3:*',
              Resource: [bucketArn, `${bucketArn}/*`],
            },
            {
              Effect: 'Allow',
              Action: 'secretsmanager:*',
              Resource: [pgPasswordArn, pgUserArn],
            },
            {
              Effect: 'Allow',
              Action: ['rds-db:connect'],
              Resource: [rdsArn],
            },
          ],
        }),
      ),
  });
  return {
    taskRole,
    executionRole,
    lambdaRole,
    bucketUserCreds,
    bucketUserCredSecret,
  };
}
