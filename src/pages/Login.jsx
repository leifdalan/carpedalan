import React, { useContext } from 'react';
import request from 'superagent';

import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';

import { User } from '..';

export default function Login() {
  const { setUser } = useContext(User);

  const submitLogin = async ({ password }) => {
    try {
      const response = await request.post('/api/login', { password });
      setUser(response.body.user);
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      <Form onSubmit={submitLogin}>
        <div>soaaaamething</div>
        <Field name="password" component={InputField} type="password" />
        <Submit />
      </Form>
    </>
  );
}
