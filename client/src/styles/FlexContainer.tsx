import styled from 'styled-components';

export enum FlexEnums {
  center = 'center',
  spaceBetween = 'space-between',
}

interface FlexProps {
  justifyContent?: FlexEnums;
  alignItems?: FlexEnums;
}

const FlexContainer = styled.div<FlexProps>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent};
`;

FlexContainer.defaultProps = {
  justifyContent: FlexEnums.center,
  alignItems: FlexEnums.center,
};

export default FlexContainer;
