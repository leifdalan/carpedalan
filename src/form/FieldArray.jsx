import { useContext } from 'react';
import get from 'lodash/get';
import { func, node, oneOfType, string } from 'prop-types';

import { FormContext } from './Form';

export default function FieldArray({ component, name }) {
  const { change, state } = useContext(FormContext);

  const fields = (get(state.values, name) || []).map(
    (_, index) => `${name}[${index}]`,
  );

  const add = value => () =>
    change({ field: `${name}[${fields.length}]`, value });
  return component({
    fields,
    add,
  });
}

FieldArray.propTypes = {
  component: oneOfType([node, func]).isRequired,
  name: string.isRequired,
};
