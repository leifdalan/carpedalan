import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';
const tenMinutes = 60 * 10;

let certificateArn: pulumi.Input<string>;

export function getDomainAndSubdomain(
  domain: string,
): { subdomain: string; parentDomain: string } {
  const parts = domain.split('.');
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: '', parentDomain: domain };
  }

  const subdomain = parts[0];
  parts.shift(); // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: `${parts.join('.')}.`,
  };
}

export function makeCerts(targetDomain: string, accountNameSpace: string) {
  /**
   * Only provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
   */
  const eastRegion = new aws.Provider('east', {
    profile: aws.config.profile,
    region: 'us-east-1', // Per AWS, ACM certificate must be in the us-east-1 region.
  });

  const certificate = new aws.acm.Certificate(
    n('certificate'),
    {
      domainName: `photos.${targetDomain}`,
      validationMethod: 'DNS',
      subjectAlternativeNames: [`local.photos.${targetDomain}`],
      tags: t(),
    },

    { provider: eastRegion },
  );

  const domainParts = getDomainAndSubdomain(targetDomain);
  const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain })
    .id;

  /**
   *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  const certificateValidationDomain = new aws.route53.Record(
    n(`${targetDomain}-validation1`),
    {
      name: certificate.domainValidationOptions[0].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: tenMinutes,
    },
  );

  /**
   *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  const certificateValidationDomain2 = new aws.route53.Record(
    n(`${targetDomain}-validation2`),
    {
      name: certificate.domainValidationOptions[1].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[1].resourceRecordType,
      records: [certificate.domainValidationOptions[1].resourceRecordValue],
      ttl: tenMinutes,
    },
  );

  /**
   * This is a _special_ resource that waits for ACM to complete validation via the DNS record
   * checking for a status of "ISSUED" on the certificate itself. No actual resources are
   * created (or updated or deleted).
   *
   * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
   * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
   * for the actual implementation.
   */
  const certificateValidation = new aws.acm.CertificateValidation(
    n('certificateValidation'),
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: [
        certificateValidationDomain.fqdn,
        certificateValidationDomain2.fqdn,
      ],
    },
    { provider: eastRegion },
  );

  certificateArn = certificateValidation.certificateArn;
  // Cert for ALB on the west coast
  let albCertificateArn: pulumi.Input<string>;
  const albCert = new aws.acm.Certificate(n('alb-certificate'), {
    domainName: targetDomain,
    validationMethod: 'DNS',
    tags: t(),
  });

  const albDomainParts = getDomainAndSubdomain(targetDomain);
  const albHostedZoneId = aws.route53.getZone({
    name: albDomainParts.parentDomain,
  }).id;

  /**
   *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  const AlbCertificateValidationDomain = new aws.route53.Record(
    n(`${targetDomain}-validation1-alb`),
    {
      name: albCert.domainValidationOptions[0].resourceRecordName,
      zoneId: albHostedZoneId,
      type: albCert.domainValidationOptions[0].resourceRecordType,
      records: [albCert.domainValidationOptions[0].resourceRecordValue],
      ttl: tenMinutes,
    },
  );

  /**
   * This is a _special_ resource that waits for ACM to complete validation via the DNS record
   * checking for a status of "ISSUED" on the certificate itself. No actual resources are
   * created (or updated or deleted).
   *
   * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
   * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
   * for the actual implementation.
   */
  const albCertificateValidation = new aws.acm.CertificateValidation(
    n('certificateValidation-alb'),
    {
      certificateArn: albCert.arn,
      validationRecordFqdns: [AlbCertificateValidationDomain.fqdn],
    },
  );

  albCertificateArn = albCertificateValidation.certificateArn;
  return [certificateArn, albCertificateArn];
}
