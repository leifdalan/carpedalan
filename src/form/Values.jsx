import { useContext } from 'react';
import get from 'lodash/get';
import { func, string } from 'prop-types';

import { FormContext } from './Form';

export default function Values({ children, selector }) {
  const {
    state: { values },
  } = useContext(FormContext);
  let arg = values;
  if (selector) {
    arg = get(values, selector);
  }
  return children(arg);
}

Values.propTypes = {
  children: func.isRequired,
  selector: string,
};
