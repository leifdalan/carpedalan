import React, { useContext } from 'react';
import { func, node, oneOfType } from 'prop-types';

import { FormContext } from '../form';

export default function Submit({ component: Component, ...rest }) {
  const { submit } = useContext(FormContext);
  if (Component) return <Component submit={submit} {...rest} />;
  // Default component
  return (
    <button type="submit" onClick={submit}>
      Submit meeeee
    </button>
  );
}

Submit.defaultProps = {
  component: null,
};

Submit.propTypes = {
  component: oneOfType([node, func]),
};
