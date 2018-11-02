import React from 'react';
import { create } from 'react-test-renderer';
import request from 'superagent';

import Root from '..';

jest.mock('superagent', () =>
  jest.fn().mockReturnValue({ body: { data: 'data' } }),
);

describe('test', () => {
  it('should do some stuff', () => {
    const instance = create(<Root />);
    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('should have an effect', () => {
    const { root } = create(<Root />);
    root.findByProps({ 'data-test': 'clicky' }).props.onClick();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('should have pass', () => {
    const { root } = create(<Root />);
    root.findByProps({ 'data-test': 'clicky' }).props.onClick();
    // expect(root.findByType(Counter.Provider).props.value).toBe(false);
    // expect(root.props.value).toBe('hallo');
  });
});
