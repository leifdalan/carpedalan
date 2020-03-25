import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { getResourceName as n } from './utils';

export function makeVpc() {
  // const vpc = new awsx.ec2.Vpc(n('vpc'), {
  //   tags: t(n('vpc')),
  //   numberOfNatGateways: 0, // these are $20 / month!
  // });
  const providerRegion = new aws.Provider(n('provider'), {
    region: 'us-west-2', // Per AWS, ACM certificate must be in the us-east-1 region.
    profile: aws.config.profile,
  });

  const vpc = awsx.ec2.Vpc.getDefault({
    provider: providerRegion,
  });

  /**
   * Security group for http/https access only
   */
  // const sg = new awsx.ec2.SecurityGroup(n('http-https-sg'), {
  //   vpc,
  //   tags: t(n('http-https-sg')),
  // });

  // sg.createEgressRule(n('outbound-access'), {
  //   location: new awsx.ec2.AnyIPv4Location(),
  //   ports: new awsx.ec2.AllTcpPorts(),
  //   description: 'allow outbound access to anywhere',
  // });

  // /**
  //  * This security group is for the VPC endpoints.
  //  * @TODO
  //  * Figure out specifically what ports need traffic for the endpoints
  //  * to function properly/communicate with other services within
  //  * the VPC.
  //  */
  // const vpcendpointSg = new awsx.ec2.SecurityGroup(n('vpce'), {
  //   vpc,
  //   tags: t(n('vpce')),
  // });

  // vpcendpointSg.createEgressRule(n('endpoint-egress'), {
  //   location: new awsx.ec2.AnyIPv4Location(),
  //   ports: new awsx.ec2.TcpPorts(0, 65535),
  //   description: 'allow all access',
  // });

  // vpcendpointSg.createIngressRule(n('endpoint-ingress'), {
  //   location: new awsx.ec2.AnyIPv4Location(),
  //   ports: new awsx.ec2.TcpPorts(0, 65535),
  //   description: 'allow all access',
  // });

  // /**
  //  * Security group for postgres ports only
  //  */
  // const postgresSg = new awsx.ec2.SecurityGroup(n('postgresSg'), {
  //   vpc,
  //   tags: t(n('postgresSg')),
  // });

  // postgresSg.createIngressRule(n('postgres-access'), {
  //   location: new awsx.ec2.AnyIPv4Location(),
  //   ports: new awsx.ec2.TcpPorts(5432),
  //   description: 'allow postgres access',
  // });

  // /**
  //  * These Vpc Endpoints are for services that live inside the VPC that need to access
  //  * AWS resources WITHOUT a NAT gateway, because NAT gateways on private subnets
  //  * allow traffic to the public internet and AWS services. VPC endpoints are the
  //  * solution to this - they allow traffic to and from the specified service.
  //  *
  //  * Apparently Vpc endpoints within the same VPC *cannot* share an availability zone,
  //  * which is why the subnetIds are separated in the two endpoints below.
  //  */
  // new aws.ec2.VpcEndpoint(n('vpc-endpoint'), {
  //   vpcEndpointType: 'Interface',
  //   vpcId: vpc.vpc.id,
  //   serviceName: 'com.amazonaws.us-west-2.secretsmanager',
  //   privateDnsEnabled: true,
  //   securityGroupIds: [vpcendpointSg.id],
  //   subnetIds: [vpc.privateSubnetIds[0]],
  // });

  // new aws.ec2.VpcEndpoint(n('autoscale-endpoint'), {
  //   vpcEndpointType: 'Interface',
  //   vpcId: vpc.vpc.id,
  //   serviceName: 'com.amazonaws.us-west-2.autoscaling',
  //   securityGroupIds: [vpcendpointSg.id],
  //   subnetIds: [vpc.privateSubnetIds[1]],
  // });

  /**
   * @TOTO @IMPORTANT
   * Remove this endpoint after the migration is complete.
   */

  // new aws.ec2.VpcEndpoint(n('vpc-endpoint-s3'), {
  //   vpcEndpointType: 'Gateway',
  //   vpcId: vpc.vpc.id,
  //   routeTableIds: [vpc.vpc.mainRouteTableId],
  //   serviceName: 'com.amazonaws.us-west-2.s3',
  //   tags: t(n('vpc-endpoint-s3')),
  // });

  return {
    vpc,
  };
}
