import React from 'react';
import { create } from 'react-test-renderer';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import request from 'superagent';

import { API_PATH } from '../../../shared/constants';
import LogoutButton from '../LogoutButton';

jest.mock('superagent', () => ({
  post: jest.fn(),
}));

describe('LogoutButton', () => {
  beforeEach(jest.resetAllMocks);
  it('calls the input.onChange prop when the input changes', async () => {
    const setUser = jest.fn();
    const { root } = create(
      <Router>
        <LogoutButton setUser={setUser} />
      </Router>,
    );
    await root
      .findByProps({
        type: 'button',
      })
      .props.onClick();
    expect(setUser).toHaveBeenCalledTimes(1);
    expect(setUser).toHaveBeenCalledWith(null);
  });

  it('should call api logout when clicked', async () => {
    const setUser = jest.fn();
    const { root } = create(
      <Router>
        <LogoutButton setUser={setUser} />
      </Router>,
    );
    await root
      .findByProps({
        type: 'button',
      })
      .props.onClick();
    expect(request.post).toHaveBeenCalledTimes(1);
    expect(request.post).toHaveBeenCalledWith(`${API_PATH}/logout`);
  });

  it('should render a redirect', async () => {
    const setUser = jest.fn();
    const instance = create(
      <Router>
        <LogoutButton setUser={setUser} />
      </Router>,
    );
    await instance.root
      .findByProps({
        type: 'button',
      })
      .props.onClick();
    expect(instance.root.findByType(Redirect)).toBeTruthy();
    instance.update();
    expect(instance.toJSON()).toBe(null);
  });
});
