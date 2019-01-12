import React from 'react';
import { any, bool, func, node, shape } from 'prop-types';
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
  meta: { error, submitFailed },
  label,
  ...etc
}) {
  const handleChange = e => {
    onChange(e.target.value);
  };

  const showError = error && submitFailed;

  return (
    <>
      {/* eslint-disable-next-line */}
      {label ? <label htmlFor={etc.id}>{label}</label> : null}
      <Input
        data-test="inputField"
        onChange={handleChange}
        value={value || ''}
        id={etc.id}
        {...etc}
      />
      {showError ? error : null}
    </>
  );
}

InputField.defaultProps = {
  meta: {
    error: {},
    isDirty: false,
  },
  label: null,
};

InputField.propTypes = {
  input: shape({
    onChange: func.isRequired,
    value: any,
  }).isRequired,
  meta: shape({
    error: shape({}),
    isDirty: bool,
  }),
  label: node,
};
