import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { getResourceName as n, getTags as t } from './utils';

// Allocate a new VPC using any of the above techniques.
export function makeVpc() {
  const vpc = new awsx.ec2.Vpc(n('vpc'), {
    tags: t(),
    numberOfNatGateways: 0, // these are $20 / month!
  });

  // Allocate a security group and then a series of rules:
  const sg = new awsx.ec2.SecurityGroup(n('http-https-sg'), {
    vpc,
    tags: t(),
  });

  // Need to add an endpoint so that lambda can access secrets when on
  // a VPC with private networks without a NAT gateway
  new aws.ec2.VpcEndpoint(n('vpc-endpoint'), {
    vpcEndpointType: 'Interface',
    vpcId: vpc.vpc.id,
    serviceName: 'com.amazonaws.us-west-2.secretsmanager',
    privateDnsEnabled: true,
    securityGroupIds: [sg.securityGroup.id],
    subnetIds: vpc.privateSubnetIds,
  });

  // 3) outbound TCP traffic on any port to anywhere
  sg.createEgressRule(n('outbound-access'), {
    location: new awsx.ec2.AnyIPv4Location(),
    ports: new awsx.ec2.AllTcpPorts(),
    description: 'allow outbound access to anywhere',
  });
  const postgresSg = new awsx.ec2.SecurityGroup(n('postgresSg'), {
    vpc,
    tags: t(),
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
  };
}
