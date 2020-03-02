/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */
exports.sns = async (event, context) => {
  console.log('it worked', event.Records[0].Sns.Message, context);
  try {
    const message = JSON.parse(event.Records[0].Sns.Message);
    console.error('message', message);
  } catch (e) {
    console.error(e);
  }
  return {
    statusCode: 200,
    message: 'hello',
  };
};
