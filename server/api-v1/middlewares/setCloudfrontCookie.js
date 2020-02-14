import cf from 'aws-cloudfront-sign';

import { AWSError } from '../../errors';
import { CF_TIMEOUT } from '../../../shared/constants';
import { cdnDomain, privateKey, cfKey, domain, skipCf } from '../../config';

export default function setSignedCloudfrontCookie(res) {
  if (skipCf) return;
  const replaced = privateKey
    ? privateKey.replace(/\\n/g, '\n').replace(/"/g, '')
    : null;

  try {
    const options = {
      keypairId: cfKey,
      privateKeyString: replaced,
      expireTime: new Date().getTime() + CF_TIMEOUT,
    };
    const signedCookies = cf.getSignedCookies(
      `https://${cdnDomain}/*`,
      options,
    );
    if (Object.keys(signedCookies).length) {
      Object.keys(signedCookies).forEach(key => {
        res.cookie(key, signedCookies[key], {
          domain: `.${domain}`,
          path: '/',
          secure: true,
          http: true,
          maxAge: CF_TIMEOUT,
        });
      });
    }
  } catch (e) {
    throw new AWSError(e);
  }
}
