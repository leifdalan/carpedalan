import styled from 'styled-components';

import { prop, getThemeValue } from 'styles/utils';

interface IMenu {
  readonly side: string;
}
const Menu = styled.button<IMenu>`
  color: inherit;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  outline: inherit;
  position: fixed;
  z-index: 2;
  top: 0;
  ${prop('side')}: 10px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(7px) brightness(100%);
  padding: 12px;
  /* box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 10px 5px; */
  border-radius: 8px;
  margin-top: 10px;
  font-family: ${getThemeValue('titleFont')};
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 7px;
  font-size: 16px;
  a {
    text-decoration: none;
    &:hover {
      color: inherit;
    }
  }
`;

export default Menu;
