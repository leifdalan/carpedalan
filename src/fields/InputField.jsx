import React from 'react';
import { any, func, shape } from 'prop-types';
// import styled from 'styled-components';

export default function InputField({ input: { onChange, value }, ...etc }) {
  const handleChange = e => {
    onChange(e.target.value);
  };

  return (
    <>
      <input
        data-test="inputField"
        onChange={handleChange}
        value={value || ''}
        {...etc}
      />
    </>
  );
}

InputField.propTypes = {
  input: shape({
    onChange: func.isRequired,
    value: any,
  }).isRequired,
};
