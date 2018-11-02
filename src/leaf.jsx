import React, { useContext } from 'react';

import { Counter } from '.';

const Leaf = () => {
  const { counter, setCounter, data = [], isLoading } = useContext(Counter);
  const update = () => setCounter(counter + 1);
  return isLoading ? (
    'loading'
  ) : (
    <div data-test="clicky" onClick={update}>
      {data.map(({ name }) => name)}
    </div>
  );
};

export default Leaf;
