import React from 'react';
import { any, func, shape } from 'prop-types';
import styled from 'styled-components';

import { BODY_FONT, getThemeValue } from '../styles';

const Input = styled.input`
  margin: 1em 0;
  padding: 12px;
  width: 50%;
  border: 1px solid hsl(0, 0%, 80%);
  font-size: 16px;
  font-family: ${getThemeValue(BODY_FONT)};
  border-radius: 4px;
`;

export default function InputField({
  input: { onChange, value },
  label,
  ...etc
}) {
  const handleChange = e => {
    onChange(e.target.value);
  };

  return (
    <>
      {label ? <label htmlFor={etc.id}>{label}</label> : null}
      <Input
        data-test="inputField"
        onChange={handleChange}
        value={value || ''}
        id={etc.id}
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
