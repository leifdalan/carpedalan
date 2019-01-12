import React from 'react';
import { func } from 'prop-types';
import styled from 'styled-components';

const Comin = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11vw;
  color: white;
  font-family: 'england';
  font-weight: normal;
  &:before {
    z-index: -1;
    content: '';
    position: absolute;
    background-image: url('https://cdn.carpedalan.com/comingsoon.jpg');
    background-size: cover;
    background-position: 50% 100%;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    filter: brightness(70%);
  }
`;

const Secret = styled.div`
  position: fixed;
  height: 10%;
  width: 10%;
  right: 0;
  bottom: 0;
`;

export default function ComingSoon({ setShowLogin }) {
  const handleClick = () => setShowLogin(true);
  return (
    <>
      <Comin tabIndex="-1" data-test="comingSoon">
        Coming February 1st
      </Comin>
      <Secret data-test="secret" onClick={handleClick} />
    </>
  );
}

ComingSoon.propTypes = {
  setShowLogin: func.isRequired,
};
