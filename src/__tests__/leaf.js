import React from 'react';
import { create } from 'react-test-renderer';

import Leaf from '../leaf';

import { Counter } from '..';

jest.mock('superagent', () =>
  jest.fn().mockReturnValue({ body: { data: 'data' } }),
);

describe('test', () => {
  it('should do some stuff', () => {
    const instance = create(<Leaf />);
    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('should have an effect', () => {
    const setCounter = jest.fn();
    const { root } = create(
      <Counter.Provider value={{ setCounter }}>
        <Leaf />
      </Counter.Provider>,
    );
    root.findByProps({ 'data-test': 'clicky' }).props.onClick();
    // root.findByProps({ 'data-test': 'clicky' }).props.onClick();
    expect(setCounter).toHaveBeenCalledTimes(1);
  });
});
