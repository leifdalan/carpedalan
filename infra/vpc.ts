import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { getResourceName as n, getTags as t } from './utils';

// Allocate a new VPC using any of the above techniques.
export function makeVpc() {
  const vpc = new awsx.ec2.Vpc(n('vpc'), {
    tags: t(n('vpc')),
    numberOfNatGateways: 0, // these are $20 / month!
  });

  // Allocate a security group and then a series of rules:
  const sg = new awsx.ec2.SecurityGroup(n('http-https-sg'), {
    vpc,
    tags: t(n('http-https-sg')),
  });

  const vpcendpointSg = new awsx.ec2.SecurityGroup(n('vpce'), {
    vpc,
    tags: t(n('vpce')),
  });

  vpcendpointSg.createEgressRule(n('endpoint-egress'), {
    location: new awsx.ec2.AnyIPv4Location(),
    ports: new awsx.ec2.TcpPorts(0, 65535),
    description: 'allow all access',
  });

  vpcendpointSg.createIngressRule(n('endpoint-ingress'), {
    location: new awsx.ec2.AnyIPv4Location(),
    ports: new awsx.ec2.TcpPorts(0, 65535),
    description: 'allow all access',
  });

  sg.createEgressRule(n('outbound-access'), {
    location: new awsx.ec2.AnyIPv4Location(),
    ports: new awsx.ec2.AllTcpPorts(),
    description: 'allow outbound access to anywhere',
  });
  const postgresSg = new awsx.ec2.SecurityGroup(n('postgresSg'), {
    vpc,
    tags: t(n('postgresSg')),
  });

  /**
   * These Vpc Endpoints are for services that live inside the VPC that need to access
   * AWS resources WITHOUT a NAT gateway, because NAT gateways on private subnets
   * allow traffic to the public internet and AWS services. VPC endpoints are the
   * solution to this - they allow traffic to and from the specified service.
   *
   * Apparently Vpc endpoints within the same VPC *cannot* share an availability zone,
   * which is why the subnetIds are separated in the two endpoints below.
   */
  new aws.ec2.VpcEndpoint(n('vpc-endpoint'), {
    vpcEndpointType: 'Interface',
    vpcId: vpc.vpc.id,
    serviceName: 'com.amazonaws.us-west-2.secretsmanager',
    privateDnsEnabled: true,
    securityGroupIds: [vpcendpointSg.id],
    subnetIds: [vpc.privateSubnetIds[0]],
  });

  new aws.ec2.VpcEndpoint(n('autoscale-endpoint'), {
    vpcEndpointType: 'Interface',
    vpcId: vpc.vpc.id,
    serviceName: 'com.amazonaws.us-west-2.autoscaling',
    securityGroupIds: [vpcendpointSg.id],
    subnetIds: [vpc.privateSubnetIds[1]],
  });

  // 1) inbound SSH traffic on port 22 from a specific IP address
  postgresSg.createIngressRule(n('postgres-access'), {
    location: new awsx.ec2.AnyIPv4Location(),
    ports: new awsx.ec2.TcpPorts(5432),
    description: 'allow postgres access',
  });

  return {
    postgresSg,
    sg,
    vpc,
    vpcendpointSg,
  };
}
