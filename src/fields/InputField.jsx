import React from 'react';

export default ({ input: { onChange, value }, meta: { error } }) => {
  const handleChange = e => {
    onChange(e.target.value);
  };

  return (
    <>
      <input
        data-test="inputField"
        onChange={handleChange}
        value={value || ''}
      />
      {error || null}
    </>
  );
};
