import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { getResourceName as n, getTags as t } from './utils';

interface SecretsI {
  config: pulumi.Config;
}

export function getSecrets({ config }: SecretsI) {
  const username = config.getSecret('pg_user');
  const password = config.getSecret('pg_password');
  const privateKey = config.getSecret('privateKey');

  const privateKeySecret = new aws.secretsmanager.Secret(n('private-key'), {
    name: n('private-key'),
    tags: t(),
  });

  const pgUserSecret = new aws.secretsmanager.Secret(n('pg-user'), {
    name: n('pg-user'),
    tags: t(),
  });
  const pgPasswordSecret = new aws.secretsmanager.Secret(n('pg-password'), {
    name: n('pg-assword'),
    tags: t(),
  });
  let secretVersion;

  if (privateKey) {
    secretVersion = new aws.secretsmanager.SecretVersion(n('private-key'), {
      secretId: privateKeySecret.id,
      secretString: privateKey,
    });
    new aws.secretsmanager.SecretVersion(n('pg-user'), {
      secretId: pgUserSecret.id,
      secretString: username,
    });
    new aws.secretsmanager.SecretVersion(n('pg-password'), {
      secretId: pgPasswordSecret.id,
      secretString: password,
    });
  }

  return { secrets: { pgPasswordSecret, pgUserSecret, privateKeySecret } };
}
