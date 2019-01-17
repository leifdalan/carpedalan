import { useContext, useEffect } from 'react';
import { func, node, oneOfType, string } from 'prop-types';
import get from 'lodash/get';

import { FormContext } from './Form';

function Field({
  name,
  validate,
  format,
  parse,
  normalize,
  component,
  shouldExist,
  ...ownProps
}) {
  const {
    change,
    state,
    validate: validateAction,
    registerField,
    unregisterField,
  } = useContext(FormContext);

  useEffect(() => {
    const error = validate(state.values[name]);

    validateAction({ field: name, error });
    registerField(name);
    return () => unregisterField(name);
  }, []);
  // eslint-disable-next-line
  const safeNormalize = normalize ? normalize :  (values) => get(values, name)
  const onChange = value => {
    const error = validate(value);
    const parsed = parse(value);
    validateAction({ field: name, error });
    change({ field: name, value: parsed });
  };
  const value = format(get(state.values, name));
  const error = state.errors[name];
  const shouldShow = shouldExist(state.values);
  return shouldShow
    ? component({
        input: { onChange, value },
        meta: { error, ...state.meta },
        ...ownProps,
      })
    : null;
}

Field.defaultProps = {
  validate: () => false,
  format: v => v,
  parse: v => v,
  shouldExist: () => true,
};

Field.propTypes = {
  name: string.isRequired,
  validate: func,
  format: func,
  parse: func,
  normalize: func,
  component: oneOfType([string, node, func]).isRequired,
  shouldExist: func,
};

export default Field;
