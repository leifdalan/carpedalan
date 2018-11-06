import React, { createContext } from 'react';
import { create } from 'react-test-renderer';

import Field from '../Field';
import Form from '../Form';

// const mockChange = jest.fn();
// const mockState = {};
// const mockValidate = jest.fn();
// const mockRegisterField = jest.fn();
// const mockUnregisterField = jest.fn();
// const mockFormContext = createContext({});
// console.log('mock', mockFormContext);
// const mockForm = ({ children }) => (
//   <mockFormContext.Provider
//     value={{
//       change: mockChange,
//       state: mockState,
//       validate: mockValidate,
//       registerField: mockRegisterField,
//       unregisterField: mockUnregisterField,
//     }}
//   >
//     {children}
//   </mockFormContext.Provider>
// );

// jest.mock('../Form', () => ({
//   // default: mockForm,
//   FormContext: mockFormContext,
// }));

// const onChange = jest.fn();
// eslint-disable-next-line react/prop-types
const prop = 'prop';
const Component = ({ input: { onChange, value } }) => (
  <div prop={prop} onChange={onChange} value={value} />
);

describe('<Field />', () => {
  let instance;
  let root;
  beforeEach(() => {
    instance = create(
      <Form>
        <Field name="test" component={Component} />
      </Form>,
    );
    ({ root } = instance);
  });

  it('should match snapshot', () => {
    const value = 'value';
    root.findByProps({ prop }).props.onChange(value);
    expect(instance.toJSON()).toMatchSnapshot();
  });
});
