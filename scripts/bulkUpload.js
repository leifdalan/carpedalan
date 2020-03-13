const os = require('os');
const path = require('path');
const fs = require('fs');
const { performance } = require('perf_hooks');
const https = require('https');

https.globalAgent.options.secureProtocol = 'SSLv3_method';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require('superagent');

const writeUserAgent = request.agent();

// check this first
const folder = process.argv[2];
const site = process.argv[3];
const password = process.argv[4];
console.error('folder', folder);

const errors = [];
async function main() {
  try {
    const response = await writeUserAgent
      .post(`https://${site}/v1/login`)
      .send({ password });
    console.error('response', response);

    const dataFiles = fs.readdirSync(
      path.join(os.homedir(), 'Downloads', folder),
    );
    console.log('starting ', dataFiles.length, ' files');
    const hardBeginning = performance.now();
    await Promise.all(
      dataFiles.map(async file => {
        console.log('file', file);
        try {
          await writeUserAgent.post(`https://${site}/v1/posts`).send({
            description: '',
            key: file,
          });
        } catch (e) {
          console.error('e.response', e.response);
          errors.push(e);
        }
      }),
    );
    // try {
    //   const response = spawnSync(
    //     'aws',
    //     [
    //       's3',
    //       'cp',
    //       `~/Downloads/${folder}/`,
    //       's3://carpedalan-photos/raw/',
    //       '--recursive',
    //     ],
    //     { stdio: 'inherit' },
    //   );
    // } catch (e) {
    //   console.error('spawn e', e);
    //   errors.push(e);
    // }

    const hardEnd = performance.now();
    console.log('finished in ', (hardEnd - hardBeginning) / 1000);
    console.error(JSON.stringify(errors, null, 2));
  } catch (e) {
    console.error('e', e);
  }
}

main();
