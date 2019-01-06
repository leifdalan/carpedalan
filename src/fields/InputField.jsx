import React from 'react';
// import styled from 'styled-components';

export default ({ input: { onChange, value }, ...etc }) => {
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
};
