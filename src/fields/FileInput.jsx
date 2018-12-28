import React from 'react';
import { func, shape } from 'prop-types';

const FileInput = ({ input: { onChange }, localOnChange }) => {
  const handleChange = e => {
    onChange(e.target.files[0]);
    localOnChange(e.target.files[0]);
  };
  return <input type="file" onChange={handleChange} />;
};

FileInput.propTypes = {
  input: shape({
    onChange: func.isRequired,
  }).isRequired,
  localOnChange: func.isRequired,
};

export default FileInput;
