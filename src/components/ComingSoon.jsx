import React from 'react';
import styled from 'styled-components';

const Comin = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Secret = styled.div`
  position: fixed;
  height: 10%;
  width: 10%;
  right: 0;
  bottom: 0;
`;
export default ({ setShowLogin }) => {
  const handleClick = () => setShowLogin(true);
  return (
    <>
      <Comin tabIndex="-1" data-test="comingSoon">
        coming Soon
      </Comin>
      <Secret data-test="secret" onClick={handleClick} />
    </>
  );
};
