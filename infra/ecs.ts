import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

const { CI_JOB_ID, CI_COMMIT_SHA, CI_COMMIT_REF_NAME } = process.env;
interface CreateI {
  albCertificateArn: pulumi.OutputInstance<string>;
  rds: aws.rds.Instance;
  config: pulumi.Config;
  taskRole: aws.iam.Role;
  executionRole: aws.iam.Role;
  targetDomain: string;
  publicDistroDomain: string;
  privateDistroDomain: string;
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
    adminPassword: aws.secretsmanager.Secret;
    publicPassword: aws.secretsmanager.Secret;
    sessionSecret: aws.secretsmanager.Secret;
    cfKeySecret: aws.secretsmanager.Secret;
  };
  aRecord: aws.route53.Record;
  publicBucket: aws.s3.Bucket;
  bucketUserCredSecret: aws.secretsmanager.Secret;
  bucketUserCreds: pulumi.Output<aws.iam.AccessKey>;
  repGroup: aws.elasticache.ReplicationGroup;
  vpc: awsx.ec2.Vpc;
}

const NODE_PORT = 8000;
const NGINX_PORT = 80;

export function createECSResources({
  albCertificateArn,
  rds,
  taskRole,
  executionRole,
  secrets,
  targetDomain,
  publicDistroDomain,
  privateDistroDomain,
  bucketUserCredSecret,
  bucketUserCreds,
  repGroup,
  vpc,
  config,
}: // redis,
CreateI) {
  /**
   * Create a load balancer that has a target group that matches the container's
   * exposed ports.
   */
  const alb = new awsx.lb.ApplicationLoadBalancer(n('alb'), {
    external: true,
    tags: t(n('alb')),
    vpc,
  });

  const targetGroup = alb.createTargetGroup(n('web'), {
    vpc,
    port: NGINX_PORT, // This is the magic port that must match the container image's exposed port.
    healthCheck: {
      path: '/healthcheck',
      timeout: 9,
      interval: 10,
      healthyThreshold: 3,
      unhealthyThreshold: 3,
      port: `${NGINX_PORT}`,
      matcher: '200-299',
    },
    /**
     * Needs to be "instance" instead of default "ip" because our task definition
     * network mode is "bridge" (needed to link containers together in the "docker
     * way")
     */
    targetType: 'instance',
    tags: t(n('web')),
  });

  /**
   * This will create a listener rule pointing to the target group, listening
   * on outside traffic port 443, with the right certArn.
   */
  const listener = targetGroup.createListener(n('listener'), {
    port: 443,
    certificateArn: albCertificateArn,
    vpc,
  });

  /**
   * Targetgroup-less listener that will redirect to https/443
   */
  alb.createListener(n('redirecthttp'), {
    vpc,
    port: 80,
    protocol: 'HTTP',
    defaultAction: {
      type: 'redirect',
      redirect: {
        protocol: 'HTTPS',
        port: '443',
        statusCode: 'HTTP_301',
      },
    },
  });

  const cluster = new awsx.ecs.Cluster(n('cluster'), {
    tags: t(n('cluster')),
    vpc,
    securityGroups: [vpc.vpc.defaultSecurityGroupId],
  });

  const keyPair = new aws.ec2.KeyPair(n('access'), {
    keyName: n('access'),
    publicKey: config.get('publicKey') as string,
    tags: t(n('access')),
  });

  /**
   * Create a launch configuration, autoscaling group and instances specified
   * in `minSize`. Since this VPC does NOT have a NAT gateway associated with
   * its private subnets, we need to 1) create a VPCendpoint for the autoscaling
   * service, and 2) specify a private subnet that the endpoint also has. Pulumi
   * will spin up a cloudformation template, and without 1) and 2), a ready state
   * will never be reached because cloudformation can't communicate with the
   * instances properly.
   */
  const asg = cluster.createAutoScalingGroup(n('micro-scaling-group'), {
    vpc,
    templateParameters: { minSize: 2, maxSize: 2 },
    launchConfigurationArgs: {
      instanceType: 't2.micro',
      keyName: keyPair.keyName,
      securityGroups: [vpc.vpc.defaultSecurityGroupId],
    },
    subnetIds: [...vpc.publicSubnetIds, ...vpc.privateSubnetIds],
  });

  asg.scaleToTrackAverageCPUUtilization(n('cpu-scaler'), {
    targetValue: 5,
  });

  /**
   * Environment variables set in the container runtime. These will
   * be exposed to anyone with programmatic or console access to AWS.
   */
  const env = [
    {
      name: 'PG_HOST',
      value: pulumi.interpolate`${rds.address}`,
    },
    {
      name: 'PG_PORT',
      value: pulumi.interpolate`${rds.port}`,
    },
    {
      name: 'PG_DATABASE',
      value: pulumi.interpolate`${rds.name}`,
    },
    {
      name: 'ASSET_CDN_DOMAIN',
      value: publicDistroDomain,
    },
    {
      name: 'CDN_DOMAIN',
      value: privateDistroDomain,
    },
    {
      name: 'DOMAIN',
      value: pulumi.interpolate`${targetDomain}`,
    },
    {
      name: 'PORT',
      value: `${NODE_PORT}`,
    },
    {
      name: 'AWS_ACCESS_KEY_ID',
      value: pulumi.interpolate`${bucketUserCreds.id}`,
    },
    {
      name: 'CI_JOB_ID',
      value: CI_JOB_ID,
    },
    {
      name: 'CI_COMMIT_SHA',
      value: CI_COMMIT_SHA,
    },
    {
      name: 'CI_COMMIT_REF_NAME',
      value: CI_COMMIT_REF_NAME,
    },
    {
      name: 'DEFAULT_POSTS_PER_PAGE',
      value: '200',
    },
    {
      name: 'REDIS_URL',
      /**
       * @TODO Figure out how to get this dynamically from aws.elasticache.Cluster/ReplicaGroup
       */
      value: pulumi.interpolate`redis://${repGroup.primaryEndpointAddress}/0`,
    },
  ];

  /**
   * Docker repository for storing and referencing our images in ECS tasks.
   */
  const repository = new aws.ecr.Repository(n('repository'), {
    tags: t(n('repository')),
  });

  /**
   * ECR lifecycle policy to clean up old/stale images. These add up quick!
   */
  new aws.ecr.LifecyclePolicy(n('lifecycle'), {
    repository: repository.name,
    policy: {
      rules: [
        {
          rulePriority: 1,
          description: 'Delete everything!',
          selection: {
            tagStatus: 'any' as pulumi.Input<'any' | 'tagged' | 'untagged'>,
            countType: 'sinceImagePushed' as pulumi.Input<
              'imageCountMoreThan' | 'sinceImagePushed'
            >,
            countUnit: 'days',
            countNumber: 3,
          },
          action: {
            type: 'expire',
          },
        },
      ],
    },
  });

  /**
   * Task definition for ECS service
   */
  const taskDefinition = new awsx.ecs.EC2TaskDefinition(n('task'), {
    executionRole, // Needs all perms for container runtime
    taskRole, // Needs all perms necessary for "spinning up" (e.g. secretsmanager)
    vpc,
    /**
     * "Bridge" mode (rather than default "awsvpc") allows inter-docker service
     * aliasing, in the classic docker networking sense.
     */
    networkMode: 'bridge',
    tags: t(n('task')),

    containers: {
      nginx: {
        cpu: 256,
        memory: 256,
        image: awsx.ecs.Image.fromDockerBuild(repository, {
          context: '../nginx',
          dockerfile: '../nginx/Dockerfile',
        }),

        links: ['web'],
        portMappings: [listener],
        /**
         * Adding healthcheck brings the container to a "RUNNING" status faster
         * and more reliably. Having seperate healthchecks per container
         * is helpful for debugging which container is failing to be healthy.
         */
        healthCheck: {
          command: [
            'CMD-SHELL',
            'wget http://localhost/healthcheck -q -O - > /dev/null 2>&1',
          ],
          interval: 5,
          retries: 5,
          startPeriod: 10,
        },
      },
      // @ts-ignore
      web: {
        memory: 512,
        cpu: 512,
        /**
         * This utility will actually run a docker build with the included args
         * and push to the ECR repository, tagged with the SHA of the docker
         * build.
         */
        image: awsx.ecs.Image.fromDockerBuild(repository, {
          context: '../',
          dockerfile: '../server/Dockerfile',
          extraOptions: ['--target', 'prod', '--cache-from', 'api:latest'],
        }),
        /**
         * Adding healthcheck brings the container to a "RUNNING" status faster
         * and more reliably. Having seperate healthchecks per container
         * is helpful for debugging which container is failing to be healthy.
         */
        healthCheck: {
          command: ['CMD-SHELL', `node ./scripts/healthcheck.js ${NODE_PORT}`],
          interval: 5,
          retries: 10,
          startPeriod: 10,
        },

        /**
         * When specifying the listener here, it automatically maps its port,
         * so in this case, analogous to "80:80"
         */
        portMappings: [
          {
            hostPort: NODE_PORT,
            containerPort: NODE_PORT,
            protocol: 'tcp',
          },
        ],
        // @ts-ignore
        environment: env,
        secrets: [
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${bucketUserCredSecret.arn}`,
          },
          {
            name: 'PRIVATE_KEY',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.privateKeySecret.arn}`,
          },
          {
            name: 'PG_USER',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.pgUserSecret.arn}`,
          },
          {
            // @ts-ignore
            name: 'PG_PASSWORD',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.pgPasswordSecret.arn}`,
          },
          {
            name: 'ADMIN_PASSWORD',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.adminPassword.arn}`,
          },
          {
            // @ts-ignore
            name: 'PUBLIC_PASSWORD',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.publicPassword.arn}`,
          },
          {
            // @ts-ignore
            name: 'SESSION_SECRET',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.sessionSecret.arn}`,
          },
          {
            // @ts-ignore
            name: 'CLOUDFRONT_KEY_ID',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.cfKeySecret.arn}`,
          },
        ],
      },
    },
  });

  new awsx.ecs.EC2Service(n('service'), {
    cluster,
    taskDefinition,
    desiredCount: 2,
    waitForSteadyState: false, // Will continue the pulumi build without verifying read state
    tags: t(n('service')),
  });

  return { alb, taskDefinition };
}
