const fs = require('fs');

const moment = require('moment');

const data = require('./goodDataWithEtag');

const values = data.map(val => {
  const date = moment(val.date).format('YYYY-MM-DD-HH-MM-ss');
  return {
    ...val,
    key: `original/${date}-${val.width}-${val.height}.jpg`,
  };
});

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
