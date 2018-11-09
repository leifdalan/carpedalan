import React from 'react';
import { create } from 'react-test-renderer';

import Root from '..';

jest.mock('superagent', () =>
  jest.fn().mockReturnValue({ body: { data: 'data' } }),
);

describe('test', () => {
  it('should do some stuff', () => {
    const instance = create(<Root />);
    expect(instance.toJSON()).toMatchSnapshot();
  });
});
