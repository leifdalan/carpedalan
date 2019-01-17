import React from 'react';
import { any, bool, func, node, shape } from 'prop-types';
import styled from 'styled-components';

import { BODY_FONT, getThemeValue } from '../styles';
import DangerText from '../styles/DangerText';

const InputWrapper = styled.div`
  margin: 1em 0;
  width: 50%;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid hsl(0, 0%, 80%);
    font-size: 16px;
    font-family: ${getThemeValue(BODY_FONT)};
    border-radius: 4px;
  }
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
    <InputWrapper>
      {/* eslint-disable-next-line */}
      {label ? <label htmlFor={etc.id}>{label}</label> : null}
      <input
        data-test="inputField"
        onChange={handleChange}
        value={value || ''}
        id={etc.id}
        {...etc}
      />
      {showError ? <DangerText>{error}</DangerText> : null}
    </InputWrapper>
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
