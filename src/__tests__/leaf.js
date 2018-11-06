import React from 'react';
import { create } from 'react-test-renderer';

import Form from '../form/Form';
import Leaf from '../leaf';

describe('test', () => {
  it('should do some stuff', () => {
    const instance = create(<Leaf />);
    expect(instance.toJSON()).toMatchSnapshot();
  });

  it('tests state changes', () => {
    const { root } = create(<Leaf />);

    root.findByProps({ 'data-test': 'clicky' }).props.onClick();
    expect(root.findAllByType(Form)[0].props.initial.test.yo).toBe('fartttsss');
  });
});
