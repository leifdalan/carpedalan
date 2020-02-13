const aws = require('aws-sdk');

const secretManager = new aws.SecretsManager();

async function main() {
  const response = await secretManager
    .getSecretValue({
      SecretId: 'carpedalan-dev-pg-password-c8121f8',
    })
    .promise();
  console.log(JSON.stringify(response, null, 2));
}

main();
