const fs = require('fs');

const data = require('../goodDataWithEtag.json'); // eslint-disable-line import/no-unresolved

const values = data.map(val => ({
  ...val,
  key: `original/${val.id}-${val.width}-${val.height}.jpg`,
}));

async function log() {
  // const { values, errors } = await upload();
  fs.writeFile(
    'goodDataWithEtagAndKey.json',
    JSON.stringify(values, null, 2),
    'utf8',
    () => {},
  );
}

log();
