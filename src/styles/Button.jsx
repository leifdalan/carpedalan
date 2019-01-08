import styled from 'styled-components';

import { getThemeValue, BRAND_COLOR } from '.';

export default styled.button`
  background: ${getThemeValue(BRAND_COLOR)};
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`;
