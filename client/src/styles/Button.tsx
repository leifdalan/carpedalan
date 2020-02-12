import styled from 'styled-components';

import { getThemeValue, TITLE_FONT } from './utils';

export enum ButtonType {
  danger,
  neutral,
}

interface ButtonProps {
  theme: string;
  variant?: ButtonType;
}

export default styled.button<ButtonProps>`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case ButtonType.danger:
        return theme.dangerColor;
      case ButtonType.neutral:
        return theme.neutralColor;
      default:
        return theme.brandColor;
    }
  }};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  letter-spacing: 3px;
  color: white;
  border: none;
  padding: 1em 3em;
  cursor: pointer;
  outline: inherit;
  border-radius: 50px;
  :hover {
    filter: brightness(85%);
  }
  :active {
    filter: brightness(125%);
  }
`;
