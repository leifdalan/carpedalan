import styled, { css } from 'styled-components';

import { getThemeValue, TITLE_FONT } from '.';

export default styled.h1`
  font-family: ${getThemeValue(TITLE_FONT)};
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
