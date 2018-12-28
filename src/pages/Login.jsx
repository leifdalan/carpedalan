import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import request from 'superagent';

import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';

import { User } from '..';

import ComingSoon from '../components/ComingSoon';

export default function Login() {
  const { setUser, user } = useContext(User);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const submitLogin = async ({ password }) => {
    try {
      const response = await request.post('/api/login', { password });
      setHasLoggedIn(true);
      setUser(response.body.user);
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      {showLogin || user ? (
        <>
          <Form onSubmit={submitLogin}>
            <div>soaaaamething</div>
            <Field
              name="password"
              component={InputField}
              asdf="asdf"
              type="password"
            />
            <Submit />
          </Form>

          {hasLoggedIn ? <Redirect to="/" /> : null}
        </>
      ) : (
        <ComingSoon setShowLogin={setShowLogin} />
      )}
    </>
  );
}
