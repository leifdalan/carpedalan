import styled from 'styled-components';

import { prop } from '.';

const FlexContainer = styled.div`
  display: flex;
  align-items: ${prop('alignItems')};
  justify-content: ${prop('justifyContent')};
`;

FlexContainer.defaultProps = {
  justifyContent: 'center',
  alignItems: 'center',
};

export default FlexContainer;
