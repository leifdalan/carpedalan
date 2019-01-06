import React, { useContext } from 'react';
import { func, node, oneOfType } from 'prop-types';

import { FormContext } from './Form';

export default function Submit({ component: Component, ...rest }) {
  const { submit } = useContext(FormContext);
  if (Component) return <Component submit={submit} {...rest} />;
  // Default component
  return (
    <button type="submit" onClick={submit}>
      Submit
    </button>
  );
}

Submit.defaultProps = {
  component: null,
};

Submit.propTypes = {
  component: oneOfType([node, func]),
};
