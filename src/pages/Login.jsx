import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import request from 'superagent';

import Success from '../components/Success';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';

import { User } from '..';

import ComingSoon from '../components/ComingSoon';
import { BRAND_COLOR, getThemeValue, prop } from '../styles';
import Title from '../styles/Title';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const InputForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: ${prop('height')};
  max-height: 25em;
  width: 40vw;
  height: 40vh;
  input {
    text-align: center;
  }
`;

InputForm.defaultProps = {
  height: '25em',
};

const StyledTitle = styled(Title)`
  margin: 0;
`;

const StyledButton = styled.button`
  color: ${getThemeValue(BRAND_COLOR)};
  border: none;
  padding: 1em 3em;
  cursor: pointer;
  outline: inherit;
`;

export default function Login() {
  const { setUser, user } = useContext(User);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [requestAccess, setRequestAccess] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const submitLogin = async ({ password }) => {
    try {
      const response = await request.post('/api/login', { password });
      setUser(response.body.user);
      setHasLoggedIn(true);
    } catch (e) {
      throw e;
    }
  };

  const submitRequestAccess = async ({ email, firstName, lastName }) => {
    try {
      const response = await request.post('/api/request', {
        email,
        firstName,
        lastName,
      });
      setAccessRequested(true);
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      {showLogin || user ? (
        <InputWrapper>
          <InputForm>
            {requestAccess ? (
              <>
                {accessRequested ? (
                  <>
                    <Success />
                    <div>Thank you! Your request has been sent!</div>
                  </>
                ) : (
                  <>
                    <StyledTitle center>Request Access</StyledTitle>
                    <Form onSubmit={submitRequestAccess}>
                      <Field
                        name="firstName"
                        component={InputField}
                        placeholder="First Name"
                        label="First Name"
                        id="firstName"
                      />
                      <Field
                        name="lastName"
                        component={InputField}
                        placeholder="Last Name"
                        label="Last Name"
                        id="lasttName"
                      />
                      <Field
                        name="email"
                        component={InputField}
                        placeholder="Email address"
                        label="Email Address"
                        id="email"
                      />
                      <Submit text="Send Request" />
                    </Form>
                  </>
                )}
              </>
            ) : (
              <>
                <StyledTitle center>Login</StyledTitle>
                <Form onSubmit={submitLogin}>
                  <Field
                    name="password"
                    component={InputField}
                    placeholder="Password, please"
                    type="password"
                  />
                  <Submit text="Login" />
                </Form>
              </>
            )}
            {!requestAccess ? (
              <StyledButton
                type="button"
                onClick={() => setRequestAccess(true)}
              >
                Request Access
              </StyledButton>
            ) : null}
          </InputForm>

          {hasLoggedIn ? <Redirect to="/" /> : null}
        </InputWrapper>
      ) : (
        <ComingSoon setShowLogin={setShowLogin} />
      )}
    </>
  );
}
