import React, { useContext } from 'react';
import { func, node, oneOfType, string } from 'prop-types';

import Button from '../styles/Button';

import { FormContext } from './Form';

export default function Submit({ component: Component, text, ...rest }) {
  const { submit } = useContext(FormContext);
  if (Component) return <Component submit={submit} {...rest} />;
  // Default component
  return (
    <Button type="submit" onClick={submit}>
      {text}
    </Button>
  );
}

Submit.defaultProps = {
  component: null,
  text: 'Submit',
};

Submit.propTypes = {
  component: oneOfType([node, func]),
  text: string,
};
