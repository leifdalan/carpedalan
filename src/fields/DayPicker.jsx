// import React from 'react';
// import { any, bool, func, node, shape } from 'prop-types';
// import DayPicker from 'react-day-picker';

// import DangerText from '../styles/DangerText';

// export default function InputField({
//   input: { onChange, value },
//   meta: { error, submitFailed },
//   label,
//   ...etc
// }) {
//   const handleChange = e => {
//     onChange(e);
//   };

//   const showError = error && submitFailed;

//   return (
//     <>
//       {/* eslint-disable-next-line */}
//       {label ? <label htmlFor={etc.id}>{label}</label> : null}
//       <DayPicker
//         data-test="datePicker"
//         onDayClick={handleChange}
//         id={etc.id}
//         {...etc}
//       />
//       {showError ? <DangerText>{error}</DangerText> : null}
//     </>
//   );
// }

// InputField.defaultProps = {
//   meta: {
//     error: {},
//     isDirty: false,
//   },
//   label: null,
// };

// InputField.propTypes = {
//   input: shape({
//     onChange: func.isRequired,
//     value: any,
//   }).isRequired,
//   meta: shape({
//     error: shape({}),
//     isDirty: bool,
//   }),
//   label: node,
// };
