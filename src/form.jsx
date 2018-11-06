import React, { useReducer, createContext } from 'react';
import { arrayOf, node, shape, func, oneOfType, string } from 'prop-types';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

import log from './utils/log';

export const FormContext = createContext({});
const { Provider: FormProvider } = FormContext;

const initialFormReducerState = {
  values: {},
  errors: {},
  meta: {},
};

const reducer = (
  state,
  { type, payload, payload: { field, value, error } = {} },
) => {
  log.info(type, payload);
  switch (type) {
    case 'CHANGE':
      set(state.values, field, value);
      return {
        ...state,
        meta: {
          isDirty: true,
        },
      };
    case 'VALIDATION':
      return {
        ...state,
        errors: {
          ...state.errors,
          [field]: error,
        },
        meta: {
          ...state.meta,
          invalid: true,
        },
      };
    case 'FORM_VALIDATION':
      return {
        ...state,
        errors: payload,
        meta: {
          ...state.meta,
          invalid: true,
        },
      };
    case 'START_SUBMIT':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: true,
        },
      };
    case 'STOP_SUBMIT':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: false,
        },
      };
    case 'SUBMIT_SUCCEEDED':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitting: false,
          submitSucceeded: true,
        },
      };
    case 'SUBMIT_FAILED':
      return {
        ...state,
        errors: payload,
        meta: {
          ...state.meta,
          submitting: false,
          submitSucceeded: false,
        },
      };
    default:
      return state;
  }
};

function Form({ initial = {}, children, onSubmit, validate: validation }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialFormReducerState,
    values: initial,
  });

  const change = ({ field, value }) =>
    dispatch({
      type: 'CHANGE',
      payload: { field, value },
    });

  const validate = ({ field, error }) =>
    dispatch({ type: 'VALIDATION', payload: { field, error } });

  const submit = async () => {
    dispatch({
      type: 'START_SUBMIT',
    });

    const errors = validation(state.values);

    if (errors && !isEmpty(errors)) {
      dispatch({ type: 'FORM_VALIDATION', payload: errors });
      dispatch({
        type: 'SUBMIT_FAILED',
        payload: errors,
      });
    } else {
      try {
        await onSubmit(state.values);
        dispatch({
          type: 'SUBMIT_SUCCEEDED',
        });
      } catch (e) {
        dispatch({
          type: 'SUBMIT_FAILED',
          payload: e,
        });
      } finally {
        dispatch({
          type: 'SUBMIT_STOP',
        });
      }
    }
  };

  return (
    <FormProvider
      value={{ change, validate, state, submit, values: state.values }}
    >
      {children}
    </FormProvider>
  );
}

Form.defaultProps = {
  initial: {},
  children: [],
  onSubmit: () => {},
  validate: () => {},
};

Form.propTypes = {
  initial: shape({}),
  children: arrayOf(oneOfType([node, string])),
  onSubmit: func,
  validate: func,
};

export default Form;
