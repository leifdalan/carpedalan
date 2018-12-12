import React, { useState } from 'react';
import { func } from 'prop-types';
import { Redirect } from 'react-router-dom';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';

const LogoutButton = ({ setUser }) => {
  const [hasLoggedOut, logOut] = useState(false);
  const logout = async () => {
    await request.post(`${API_PATH}/logout`);
    setUser(null);
    logOut(true);
  };
  return (
    <>
      <button type="button" data-test="logout" onClick={logout}>
        log outzzzz
      </button>

      {hasLoggedOut ? <Redirect to="/login" /> : null}
    </>
  );
};

LogoutButton.propTypes = {
  setUser: func.isRequired,
};

export default LogoutButton;
