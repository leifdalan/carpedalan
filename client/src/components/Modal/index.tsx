import debug from 'debug';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import FlexContainer from 'styles/FlexContainer';
import { propTrueFalse } from 'styles/utils';

const log = debug('components:Modal');

const ENTER_SPEED = 300;
const EXIT_SPEED = 300;
const ENTER_SPEED_MS = `${ENTER_SPEED}ms`;
const EXIT_SPEED_MS = `${EXIT_SPEED}ms`;
interface TransitionPropsI {
  isMounted: boolean;
  isClosing: boolean;
}

const Background = styled(FlexContainer)<TransitionPropsI>`
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 3;
  top: 0;
  left: 0;

  &:before {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: opacity
        ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)} ease-out,
      backdrop-filter
        ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)} ease-out;
    opacity: ${propTrueFalse('isMounted', 1, 0)};
    backdrop-filter: ${propTrueFalse(
      'isMounted',
      'blur(6px) grayscale(0.8)',
      'blur(0px) grayscale(0)',
    )};
    /* backdrop-filter: blur(7px) grayscale(0.8); */
    content: '';
    background: radial-gradient(
      ellipse at center,
      rgba(237, 187, 243, 0.5) 0%,
      rgba(249, 196, 247, 0.5) 25%,
      rgba(47, 33, 49, 0.5) 100%
    );
  }
`;

const CloseButton = styled.button<TransitionPropsI>`
  position: fixed;
  top: 0;
  opacity: ${propTrueFalse('isMounted', 1, 0)};
  right: ${propTrueFalse('isMounted', 0, '-30px')};
  transition: right ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)}
      ease-out,
    opacity ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)}
      ease-out;
  background: black;
  color: white;
  border: none;
  outline: inherit;
  padding: 1em;
  font-size: 16px;
`;

interface TransitionPropsI {
  isMounted: boolean;
  isClosing: boolean;
}

const Wrapper = styled.div<TransitionPropsI>`
  width: 100%;
  height: 100%;
  opacity: ${propTrueFalse('isMounted', 1, 0)};
  transform: scale(${propTrueFalse('isMounted', 1, 0)});
  transition: transform
      ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)}
      cubic-bezier(0, 0.34, 0.16, 1.1),
    opacity ${propTrueFalse('isClosing', EXIT_SPEED_MS, ENTER_SPEED_MS)}
      cubic-bezier(0, 0.34, 0.16, 1.1);
`;

export type onClose = (e: React.MouseEvent<HTMLElement>) => void;

interface ModalI {
  children?: React.ReactNode;
  onClose: onClose;
  safeRef: React.MutableRefObject<HTMLElement | null>;
}

const Modal = ({ children, onClose, safeRef }: ModalI) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('show-modal');

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('show-modal');
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (
      e.target &&
      safeRef.current &&
      !safeRef.current.contains(e.target as Node)
    ) {
      log('calling onClose with', e);
      setIsClosing(true);
      setIsMounted(false);
      setTimeout(() => {
        onClose(e);
      }, EXIT_SPEED);
    }
  }

  useEffect(() => {
    /**
     * @TODO Why does this need a timeout? This is super hacky.
     */
    setTimeout(() => setIsMounted(true), 21);
  }, []);

  const portalElement = document.getElementById('modal');
  if (portalElement) {
    return createPortal(
      <Background
        isClosing={isClosing}
        isMounted={isMounted}
        data-test="background"
        onClick={handleClick}
      >
        <CloseButton
          isClosing={isClosing}
          isMounted={isMounted}
          data-test="closeModal"
          onClick={handleClick}
        >
          ✖
        </CloseButton>
        <Wrapper isClosing={isClosing} isMounted={isMounted}>
          {children}
        </Wrapper>
      </Background>,
      portalElement,
    );
  }
  return null;
};

export default Modal;
