import React, { useState, Fragment } from 'react';
import get from 'lodash/get';

import Form from './form/Form';
import InputField from './fields/InputField';
import Field from './form/Field';
import FieldArray from './form/FieldArray';
import Values from './form/Values';
import Submit from './form/Submit';

// Submit functions take the values as an argument
const submitToApi = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ not: 'good' }); // eslint-disable-line
    }, 1500);
  });

// An effect that has the forms state and change, used in
// the Form's useEffect hook
let hasGenerated = false;
const effect = ({ state, change }) => {
  if (
    get(state, 'values.test.yo') === 'GENERATE' &&
    get(state, 'values.test.generated') !== 'GENERATED' &&
    !hasGenerated
  ) {
    hasGenerated = true;
    change({ field: 'test.generated', value: 'GENERATED' });
  } else if (get(state, 'values.test.yo') !== 'GENERATE') {
    hasGenerated = false;
  }
};

const Leaf = () => {
  const [initialValue, setInitialValue] = useState('hallo');
  const update = () => {
    setInitialValue('fartttsss');
  };

  return (
    <>
      <Form
        // initial values are not required, as soon as a Field
        // is mounted, it is registered with a null value.
        initial={{
          test: { yo: initialValue, generated: '' },
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
        effect={effect}
      >
        <Field
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test.yo"
          component={InputField}
          format={val => val && val.toUpperCase()}
        />
        <Field
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test.generated"
          component={InputField}
        />
        <Field
          // A test function when truthy will display this component
          shouldExist={({ test }) => test === 'YAHTZEE'}
          validate={val => (val.length > 5 ? 'too long' : null)}
          name="test1"
          component={InputField}
        />
        {/* An array of identical fields, with the ability to add one */}
        <FieldArray
          name="array"
          component={({ fields, add }) =>
            fields.map(field => (
              <Fragment key={field}>
                <Field name={`${field}.sub1`} component={InputField} />
                <Field component={InputField} name={`${field}.sub2`} />
                <button type="button" onClick={add({})}>
                  Add!
                </button>
              </Fragment>
            ))
          }
        />
        {/* Another way to conditionally show a Field based on another field */}
        <Values>
          {values =>
            values.test.yo ? (
              <Field name="mounty" component={InputField} />
            ) : null
          }
        </Values>
        <Submit
          component={({ submit, text }) => <div onClick={submit}>{text}</div>}
          text="ima div"
        />
      </Form>
      {/* Two different forms that don't share their "state" */}
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
          format={val => val && val.toUpperCase()}
        />
      </Form>
      <div data-test="clicky" onClick={update}>
        reset form
      </div>
    </>
  );
};

export default Leaf;
