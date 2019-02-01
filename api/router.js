import express from 'express';
import { SES } from 'aws-sdk';

import { adminPassword, publicPassword } from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';
import { isLoggedIn, setSignedCloudfrontCookie } from '../server/middlewares';

import posts from './posts';
import tags from './tags';

// Create S3 interface object
const ses = new SES({ region: 'us-east-1' });

const api = express.Router();

// // Route the things
api.use('/posts', posts);
api.use('/tags', tags);

api.get('/refresh', isLoggedIn, (req, res) => {
  res.status(200).send({ refreshed: true });
});

// Login route
api.post('/login', (req, res) => {
  if (req.body.password === publicPassword) {
    req.session.user = READ_USER;
    req.session.requests = 1;
    setSignedCloudfrontCookie(res);
    res.status(200).send({ user: req.session.user });
  } else if (req.body.password === adminPassword) {
    req.session.user = WRITE_USER;
    req.session.requests = 1;
    setSignedCloudfrontCookie(res);
    res.status(200).send({ user: req.session.user });
  } else {
    res.status(401).send();
  }
});

api.post('/user', (req, res) => {
  Object.keys(req.body || {}).forEach(key => {
    req.session[key] = req.body[key];
  });
  res.status(200).end();
});

api.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

api.post('/request', async (req, res) => {
  const { email, firstName, lastName } = req.body;
  const params = {
    Destination: {
      ToAddresses: [
        'leifdalan@gmail.com',
        /* more items */
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `${firstName} ${lastName} with email: ${email} requested access.`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'Reqestsz',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Request to carpedalan.com',
      },
    },
    Source: '4dMiN@carpedalan.com' /* required */,
    ReplyToAddresses: [
      'no-reply@farts.com',
      /* more items */
    ],
  };
  try {
    const receipt = await ses.sendEmail(params).promise();
    res.status(200).json(receipt);
  } catch (e) {
    res.status(e.statusCode || 500).json(e);
  }
});

export default api;
