import { useContext } from 'react';
import { func, node, oneOfType, string } from 'prop-types';
import get from 'lodash/get';

import { FormContext } from '../form';

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
  const { change, state, validate: validateAction } = useContext(FormContext);
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
  validate: v => v,
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
  component: oneOfType([string, node]).isRequired,
  shouldExist: func,
};

export default Field;
