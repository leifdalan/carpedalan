import React from 'react';
import request from 'superagent';

import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';
import log from '../utils/log';

const submitLogin = async ({ password }) => {
  console.error('values', password);

  await request.post('/api/login', { password });
};

export default function Login(props) {
  log.info(props);
  return (
    <Form onSubmit={submitLogin}>
      <Field name="password" component={InputField} type="password" />
      <Submit />
    </Form>
  );
}
