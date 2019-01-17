import styled from 'styled-components';

import { getThemeValue, DANGER_COLOR } from '.';

export default styled.div`
  color: ${getThemeValue(DANGER_COLOR)};
`;
