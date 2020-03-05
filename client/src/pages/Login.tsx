import * as React from 'react';
import { Link } from 'react-router-dom';

import { client } from 'ApiClient';
import useApi from 'hooks/useApi';
import useForm from 'hooks/useForm';
import useUser from 'hooks/useUser';
import Button from 'styles/Button';
import Input from 'styles/Input';

import { InputForm, InputWrapper, StyledTitle } from './styles';

const { useEffect, useState } = React;

/**
 * Login component. Return markup for page level component
 *
 * @returns {React.ReactElement}
 */
const Login: React.FC<{}> = (): React.ReactElement => {
  const { setUser, user } = useUser();
  const [showError, shouldShowError] = useState(true);

  /**
   * Change handler passed intended for passage to `useField`. Has
   * state side effect of setting error showing to false
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns {string}
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): string => {
    shouldShowError(false);
    return e.target.value;
  };

  const { useField } = useForm('myForm');

  const passwordInput = useField({ handleChange, field: 'password' });

  const { request, error, response } = useApi(client.login);

  useEffect(() => {
    if (response) {
      setUser(response?.user);
    }
  }, [response, setUser]);

  /**
   * Submit hanlder. Calls the login API.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    shouldShowError(true);
    request({
      requestBody: {
        password: String(passwordInput.value),
      },
    });
  };
  return (
    <InputWrapper>
      <InputForm
        data-test="submit"
        data-testid="submit"
        onSubmit={handleSubmit}
      >
        <StyledTitle center>Login</StyledTitle>
        {user}
        <Input>
          <input data-test="password" type="password" {...passwordInput} />
        </Input>
        <Button
          data-test="submit-button"
          data-testid="submit-button"
          type="submit"
        >
          Login
        </Button>
        {error && showError && !user ? (
          <div data-test="error" data-testid="error">
            {error.message}
          </div>
        ) : null}
        <Link to="/request">Request access</Link>
      </InputForm>
    </InputWrapper>
  );
};

export default Login;
