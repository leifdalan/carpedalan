import React from 'react';
import { any, func, shape } from 'prop-types';
import styled from 'styled-components';

const Input = styled.input`
  margin: 1em 0;
  padding: 1em;
  width: 50%;
  border: 1px solid hsl(0, 0%, 80%);
`;

export default function InputField({ input: { onChange, value }, ...etc }) {
  const handleChange = e => {
    onChange(e.target.value);
  };

  return (
    <>
      <Input
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
