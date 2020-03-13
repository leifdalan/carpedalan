import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

import useToast from 'hooks/useToast';
import Button from 'styles/Button';

const CLASS_PREFIX = 'item';
const TRANSITION_SPEED = 350;
const Toast = styled.aside`
  position: fixed;
  z-index: 2;
  bottom: 20px;
  left: 0px;
  width: 100%;
  padding: 2em;
  padding-bottom: 0;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
  background: hotpink;
  margin-bottom: 2em;
  &.${CLASS_PREFIX}-enter {
    opacity: 0;
  }
  &.${CLASS_PREFIX}-enter-active {
    opacity: 1;
    transition: opacity ${TRANSITION_SPEED}ms ease-out;
  }
  &.${CLASS_PREFIX}-exit {
    opacity: 1;
  }
  &.${CLASS_PREFIX}-exit-active {
    opacity: 0;
    transition: opacity ${TRANSITION_SPEED}ms ease-out;
  }
`;

export default function Toaster() {
  const { toasts } = useToast();
  return (
    <Toast>
      <TransitionGroup>
        {toasts.map(({ message, onRetry, onDismiss }, index) => (
          <CSSTransition
            key={index}
            classNames={CLASS_PREFIX}
            timeout={TRANSITION_SPEED}
          >
            <Item key={index}>
              <div>{message}</div>
              <div className="buttons">
                {onRetry ? (
                  <Button type="button" onClick={onRetry}>
                    Retry
                  </Button>
                ) : null}
                <Button type="button" onClick={onDismiss}>
                  Dismiss
                </Button>
              </div>
            </Item>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Toast>
  );
}
