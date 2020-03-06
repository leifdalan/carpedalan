import styled from 'styled-components';

import Title from './Title';
import { getThemeValue } from './utils';

export enum Side {
  right = 'right',
  left = 'left',
}

interface MenuProps {
  side: Side;
}

const Menu = styled(Title)<MenuProps>`
  color: inherit;
  border: none;
  cursor: pointer;
  outline: inherit;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 25px;
  background: rgba(255, 255, 255, 0.6);
  padding: 5px;
  box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 10px 10px;
  border-radius: 40%;
  margin-top: 1em;
  font-family: ${getThemeValue('titleFont')};
`;

export default Menu;
