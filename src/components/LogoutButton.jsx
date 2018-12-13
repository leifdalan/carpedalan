import React from 'react';
import { func, shape } from 'prop-types';
import { withRouter } from 'react-router-dom';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';

const LogoutButton = ({ setUser, history }) => {
  const logout = async () => {
    await request.post(`${API_PATH}/logout`);
    history.push('/login');
    setUser(null);
  };

  return (
    <>
      <button type="button" data-test="logout" onClick={logout}>
        log outzzzz
      </button>
    </>
  );
};

LogoutButton.propTypes = {
  setUser: func.isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default withRouter(LogoutButton);
