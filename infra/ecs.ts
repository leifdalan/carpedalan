import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';

interface CreateI {
  vpc: awsx.ec2.Vpc;
  albCertificateArn: pulumi.OutputInstance<string>;
  sg: awsx.ec2.SecurityGroup;
  postgresSg: awsx.ec2.SecurityGroup;
  rds: aws.rds.Instance;
  config: pulumi.Config;
  taskRole: aws.iam.Role;
  executionRole: aws.iam.Role;
  secrets: {
    pgUserSecret: aws.secretsmanager.Secret;
    pgPasswordSecret: aws.secretsmanager.Secret;
    privateKeySecret: aws.secretsmanager.Secret;
  };
}

export function createECSResources({
  vpc,
  albCertificateArn,
  sg,
  postgresSg,
  rds,
  config,
  taskRole,
  executionRole,
  secrets,
}: CreateI) {
  const alb = new awsx.lb.ApplicationLoadBalancer(n('alb'), {
    vpc,
    securityGroups: [sg],
    external: true,
    tags: t(),
  });

  const targetGroup = alb.createTargetGroup(n('webapp'), {
    vpc,
    port: 80,
    tags: t(),
  });

  const listener = targetGroup.createListener(n('listener'), {
    vpc,
    port: 443,
    certificateArn: albCertificateArn, // @TODO MAKE NEW CERT
  });

  alb.createListener(n('redirecthttp'), {
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
    vpc,
    tags: t(),
    securityGroups: [sg, postgresSg],
  });

  cluster.createAutoScalingGroup(n('auto-scaling-group'), {
    templateParameters: { minSize: 2 },
    launchConfigurationArgs: { instanceType: 't2.nano' },
  });

  const env = [
    {
      name: 'POSTGRES_HOST',
      value: pulumi.interpolate`${rds.address}:${rds.port}/${rds.name}`,
    },
    {
      name: 'SOME',
      value: 'else',
    },
  ];

  const repository = new aws.ecr.Repository(n('repository'));

  const taskDefinition = new awsx.ecs.EC2TaskDefinition(n('task'), {
    executionRole,
    taskRole,
    tags: t(),
    containers: {
      web: {
        image: awsx.ecs.Image.fromDockerBuild(repository, {
          context: './',
          dockerfile: './Dockerfile.nginx',
        }),
        memory: 256,
        portMappings: [listener],
        environment: env,
        // @ts-ignore
        secrets: [
          {
            // @ts-ignore
            name: 'PRIVATE_KEY',
            // @ts-ignore
            valueFrom: pulumi.interpolate`${secrets.privateKeySecret.arn}`,
          },
          {
            // @ts-ignore
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
        ],
      },
    },
  });

  const service = new awsx.ecs.EC2Service(n('service'), {
    cluster,
    taskDefinition,
    desiredCount: 1,
    waitForSteadyState: false,
    tags: t(),
  });

  return { alb };
}
