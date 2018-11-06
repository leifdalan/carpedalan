import React from 'react';
import { func, number } from 'prop-types';

import Leaf from './leaf';

function Admin({ counter, setCounter }) {
  return (
    <>
      <button type="button" onClick={() => setCounter(counter + 1)}>
        {counter}
        <div>leaf:</div>
      </button>
      <Leaf />
    </>
  );
}

Admin.propTypes = {
  setCounter: func.isRequired,
  counter: number.isRequired,
};

export default Admin;
