import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import request from 'superagent';

import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';

import { User } from '..';

import ComingSoon from '../components/ComingSoon';
import Title from '../styles/Title';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const InputForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: 25em;
  max-height: 25em;
  width: 40vw;
  height: 40vh;
`;

export default function Login() {
  const { setUser, user } = useContext(User);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const submitLogin = async ({ password }) => {
    try {
      const response = await request.post('/api/login', { password });
      setUser(response.body.user);
      setHasLoggedIn(true);
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      {showLogin || user ? (
        <InputWrapper>
          <InputForm>
            <Title center>Login</Title>
            <Form onSubmit={submitLogin}>
              <Field
                name="password"
                component={InputField}
                placeholder="Password, please"
                type="password"
              />
              <Submit />
            </Form>
          </InputForm>

          {hasLoggedIn ? <Redirect to="/" /> : null}
        </InputWrapper>
      ) : (
        <ComingSoon setShowLogin={setShowLogin} />
      )}
    </>
  );
}
