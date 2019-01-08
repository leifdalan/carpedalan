import styled, { css } from 'styled-components';

export default styled.h1`
  font-family: montserratregular;
  margin: 2em 0;
  font-size: ${({ size }) => {
    switch (size) {
      case 'large':
        return '42px';
      case 'small':
        return '18px';
      default:
        return '24px';
    }
  }};
  text-transform: uppercase;
  letter-spacing: 5px;
  ${({ center }) =>
    center
      ? css`
          text-align: center;
        `
      : null}
`;
