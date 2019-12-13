const os = require('os');
const path = require('path');
const fs = require('fs');
const { performance } = require('perf_hooks');
const { spawnSync } = require('child_process');

const request = require('superagent');
const aws = require('aws-sdk');

const writeUserAgent = request.agent();

const s3 = new aws.S3();

// check this first
const folder = process.argv[2];
console.error('folder', folder);

const errors = [];
async function main() {
  try {
    const response = await writeUserAgent
      .post('https://carpedalan.com/v1/login')
      .send({ password: '411EThomas!' });

    const dataFiles = fs.readdirSync(
      path.join(os.homedir(), 'Downloads', folder),
    );
    console.log('starting ', dataFiles.length, ' files');
    const hardBeginning = performance.now();
    await Promise.all(
      dataFiles.map(async file => {
        const startTime = performance.now();
        console.log('file', file);
        try {
          const response2 = await writeUserAgent
            .post('https://carpedalan.com/v1/posts')
            .send({
              description: '',
              key: file,
            });
        } catch (e) {
          console.error('e.response', e.response);
          errors.push(e);
        }
      }),
    );
    try {
      const response = spawnSync(
        'aws',
        [
          's3',
          'cp',
          `~/Downloads/${folder}/`,
          's3://carpedalan-photos/raw/',
          '--recursive',
        ],
        { stdio: 'inherit' },
      );
    } catch (e) {
      console.error('spawn e', e);
      errors.push(e);
    }

    const hardEnd = performance.now();
    console.log('finished in ', (hardEnd - hardBeginning) / 1000);
    console.error(JSON.stringify(errors, null, 2));
  } catch (e) {
    console.error('e', e.response);
  }
}

main();
