import React from 'react';
import { create } from 'react-test-renderer';

import InputField from '../InputField';

describe('InputField', () => {
  it('calls the input.onChange prop when the input changes', () => {
    const onChange = jest.fn();
    const { root } = create(<InputField input={{ onChange }} meta={{}} />);
    const value = 'value';
    const e = {
      target: {
        value,
      },
    };
    root
      .findByProps({
        'data-test': 'inputField',
      })
      .props.onChange(e);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(value);
  });
});
