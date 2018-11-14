import React from 'react';
import { create } from 'react-test-renderer';

import Leaf from '../leaf';

jest.mock('superagent', () => ({
  post: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
}));

describe('test', () => {
  it('should do some stuff', () => {
    const instance = create(<Leaf />);
    expect(instance.toJSON()).toMatchSnapshot();
  });
});
