import React, { useContext, useState } from 'react';

import Form from './form';
import InputField from './form/InputField';
import log from './utils/log';
import Field from './form/Field';
import FieldArray from './form/FieldArray';
import Submit from './form/Submit';

import { Counter } from '.';

const submitToApi = values => {
  log.info(values);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ not: 'good' }); // eslint-disable-line
    }, 1500);
  });
};

const Leaf = () => {
  const { counter, setCounter, data = [], isLoading } = useContext(Counter);

  const [initialValue, setInitialValue] = useState('hallo');
  const update = () => {
    setCounter(counter + 1);
    setInitialValue('fartttsss');
  };

  return isLoading ? (
    'loading'
  ) : (
    <>
      <Form
        initial={{
          test: { yo: initialValue },
          test1: '',
          array: [
            {
              sub1: 'hi',
            },
            {
              sub2: 'yo',
            },
          ],
        }}
        onSubmit={submitToApi}
      >
        <Field
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test.yo"
          component={InputField}
          format={val => val.toUpperCase()}
        />
        <Field
          shouldExist={({ test }) => test === 'YAHTZEE'}
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test1"
          component={InputField}
          format={val => val.toUpperCase()}
        />
        <FieldArray
          name="array"
          component={({ fields, add }) => {
            const handleAdd = () => add({});
            return fields.map(field => (
              <>
                <Field name={`${field}.sub1`} component={InputField} />
                <Field component={InputField} name={`${field}.sub2`} />
                <button type="button" onClick={handleAdd}>
                  Add!
                </button>
              </>
            ));
          }}
        />
        <Submit
          component={({ submit, text }) => <div onClick={submit}>{text}</div>}
          text="ima div"
        />
      </Form>
      <Form
        initial={{
          test: 'hallo',
          textArea: '',
        }}
      >
        <Field
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test"
          component={InputField}
          format={val => val.toUpperCase()}
        />
      </Form>
      <div data-test="clicky" onClick={update}>
        asdf
        {data.map(({ name }) => name)}
      </div>
    </>
  );
};

export default Leaf;
