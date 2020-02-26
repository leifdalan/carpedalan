import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getResourceName as n, getTags as t } from './utils';

interface SecretsI {
  config: pulumi.Config;
}

export interface AllSecrets {
  pgUserSecret: aws.secretsmanager.Secret;
  pgPasswordSecret: aws.secretsmanager.Secret;
  privateKeySecret: aws.secretsmanager.Secret;
  adminPassword: aws.secretsmanager.Secret;
  publicPassword: aws.secretsmanager.Secret;
  sessionSecret: aws.secretsmanager.Secret;
  cfKeySecret: aws.secretsmanager.Secret;
}
export interface ISecrets {
  secrets: AllSecrets;
}

export function getSecrets({ config }: SecretsI): ISecrets {
  const username = config.getSecret('pg_user');
  const password = config.getSecret('pg_password');
  const privateKey = config.getSecret('privateKey');
  const adminPass = config.getSecret('adminPassword');
  const publicPass = config.getSecret('publicPassword');
  const session = config.getSecret('sessionSecret');
  const cfKey = config.getSecret('cfKey');

  const privateKeySecret = new aws.secretsmanager.Secret(n('private-key'), {
    tags: t(n('private-key')),
  });

  const adminPassword = new aws.secretsmanager.Secret(n('adminPassword'), {
    tags: t(n('adminPassword')),
  });

  const publicPassword = new aws.secretsmanager.Secret(n('publicPassword'), {
    tags: t(n('publicPassword')),
  });

  const sessionSecret = new aws.secretsmanager.Secret(n('sessionSecret'), {
    tags: t(n('sessionSecret')),
  });

  const pgUserSecret = new aws.secretsmanager.Secret(n('pg-user'), {
    tags: t(n('pg-user')),
  });
  const pgPasswordSecret = new aws.secretsmanager.Secret(n('pg-password'), {
    tags: t(n('pg-password')),
  });
  const cfKeySecret = new aws.secretsmanager.Secret(n('cfKey'), {
    tags: t(n('cfKey')),
  });

  if (privateKey) {
    new aws.secretsmanager.SecretVersion(n('private-key'), {
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
    new aws.secretsmanager.SecretVersion(n('adminPassword'), {
      secretId: adminPassword.id,
      secretString: adminPass,
    });
    new aws.secretsmanager.SecretVersion(n('publicPassword'), {
      secretId: publicPassword.id,
      secretString: publicPass,
    });
    new aws.secretsmanager.SecretVersion(n('sessionSecret'), {
      secretId: sessionSecret.id,
      secretString: session,
    });
    new aws.secretsmanager.SecretVersion(n('cfKeySecret'), {
      secretId: cfKeySecret.id,
      secretString: cfKey,
    });
  }

  return {
    secrets: {
      pgPasswordSecret,
      pgUserSecret,
      privateKeySecret,
      adminPassword,
      publicPassword,
      sessionSecret,
      cfKeySecret,
    },
  };
}
