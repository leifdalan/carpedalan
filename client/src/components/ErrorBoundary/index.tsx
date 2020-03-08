import React, { ComponentType } from 'react';
import styled from 'styled-components';

import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import Title from 'styles/Title';

const Wrapper = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
`;
export default function withErrorBoundary<P extends object>({
  Component,
  namespace = 'no-namespace',
}: {
  Component: ComponentType<P>;
  namespace?: string;
}) {
  return class extends React.Component<P, { hasError: boolean }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    private static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }

    componentDidCatch(error: Error | null, info: object) {
      /* eslint-disable no-console */
      /**
       * @TODO Add sentry here.
       */
      console.error(`Caught Error for ${namespace}!`);
      console.info(info);
      console.error(error);
      /* eslint-enable no-console */
    }

    render() {
      const {
        props,
        state: { hasError },
      } = this;
      if (hasError) {
        // You can render any custom fallback UI
        return (
          <Wrapper
            alignItems={FlexEnums.center}
            justifyContent={FlexEnums.center}
          >
            <Title>Oops!</Title>
            <Title>Something went wrong.</Title>
          </Wrapper>
        );
      }

      return <Component {...props} />;
    }
  };
}
