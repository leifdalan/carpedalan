/* eslint-disable jsx-a11y/accessible-emoji */
import debug from 'debug';
import React, { MouseEvent, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSwipeable, SwipeCallback } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';
import styled, { css } from 'styled-components';

import { User } from 'User';
import useTags from 'hooks/useTags';
import useWindow from 'hooks/useWindow';
import Title from 'styles/Title';
import { getThemeValue, TEXT } from 'styles/utils';

const log = debug('components:Sidebar');
export let deferredPrompt: BeforeInstallPromptEvent | null; // eslint-disable-line import/no-mutable-exports

const CLASS_PREFIX = 'sidebar';
const TRANSITION_SPEED = 500;
const TRANSITION_SPEED_MS = `${TRANSITION_SPEED}ms`;

/* eslint-disable no-console */
window.addEventListener('beforeinstallprompt', (e: Event) => {
  // Prevent the mini-infobar from appearing on mobile
  console.log('beforeInstallPrompt....');
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e as BeforeInstallPromptEvent;
  console.log('userchoice');
  // Update UI notify the user they can install the PWA
});
/* eslint-enable no-console */
const fullGrayScale = 0.7;
const fullBlur = 3;
const fullBgOpacity = 0.34;

const START_FILTER = css`
  backdrop-filter: grayscale(0) blur(0px) brightness(100%);
`;
const END_FILTER = css`
  backdrop-filter: grayscale(${fullGrayScale}) blur(${fullBlur}px);
`;
const START_BACKGROUND = css`
  background-color: rgba(255, 192, 238, 0);
`;
const END_BACKGROUND = css`
  background-color: rgba(255, 192, 238, ${fullBgOpacity});
`;

interface StyledSidebarProps {
  isSwiping?: boolean;
  hasSwiped?: boolean;
}

const SidebarWrapper = styled.div<StyledSidebarProps>`
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  ${END_BACKGROUND}
  ${END_FILTER}
  ${props =>
    !props.isSwiping || props.hasSwiped
      ? css`
          transition: backdrop-filter ${TRANSITION_SPEED_MS}
              cubic-bezier(0, 0.34, 0.16, 1.1),
            background-color ${TRANSITION_SPEED_MS}
              cubic-bezier(0, 0.34, 0.16, 1.1);
        `
      : ''}
  &.${CLASS_PREFIX}-enter {
    ${START_FILTER}
    ${START_BACKGROUND}
  }
  &.${CLASS_PREFIX}-enter-done {
    ${END_FILTER}
    ${END_BACKGROUND}
  }
  &.${CLASS_PREFIX}-enter-active {
    transform: translateX(0);
    ${END_FILTER}
    ${END_BACKGROUND}
  }
  &.${CLASS_PREFIX}-exit-active {
    ${START_FILTER}
    ${START_BACKGROUND}
  }
`;
const StyledSidebar = styled.div<StyledSidebarProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
    width: 100%;
  top: 0;

  background: linear-gradient(90deg, rgba(241,235,240,1) 0%, rgba(241,235,240,0.4) 65%, rgba(241,235,240,0) 100%);
  
  height: 100%;
  overflow: scroll;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  ${props =>
    !props.isSwiping || props.hasSwiped
      ? css`
          transition: transform ${TRANSITION_SPEED_MS}
            cubic-bezier(0, 0.34, 0.16, 1.1);
        `
      : ''}
  font-family: ${getThemeValue('bodyFont')};
  padding: 2.5em;   
  padding-top: 5em;
  ${Title} {
    margin-top: 0;
    margin-bottom: 0;
  }

  .${CLASS_PREFIX}-enter & {
    transform: translateX(-100%);
  }
  .${CLASS_PREFIX}-enter-active & {
    transform: translateX(0);
  }
  .${CLASS_PREFIX}-exit-active & {
    transform: translateX(-100%);
  }
`;

const List = styled.ul`
  margin-left: 0;
  padding-left: 0;
`;

const ListItem = styled.li`
  font-family: ${getThemeValue('titleFont')};
  list-style: none;
  margin-left: 0;
  margin-bottom: 2em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const StyledHomeLink = styled(StyledLink)`
  text-decoration: none;
  background: ${getThemeValue('brandColor')};
  color: white;
  margin-top: 12px;
  padding: 12px;
  border-radius: 15px;
`;

const Install = styled.button`
  font-family: ${getThemeValue('titleFont')};
  margin-top: 10px;
  margin-bottom: 25px;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`;

const StyledHelp = styled.a`
  text-decoration: none;
  color: ${getThemeValue(TEXT)};
`;

interface SidebarProps {
  toggleMenu: () => void;
  userState: User;
  isOpen: boolean;
}

export default function Sidebar({
  toggleMenu,
  userState,
  isOpen,
}: SidebarProps) {
  const { tags } = useTags();
  const { hash } = useLocation();
  const [swipePos, setSwipePos] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const { width } = useWindow();
  // const { request, response } = useApi(client.getPostsIndex);
  // const { scrollTo } = useScrollPersist('sidebar', []);
  // const handleMonth = useCallback(
  //   async (timestamp: number) => {
  //     const stamp = 1526774400;
  //     await request({
  //       requestBody: {
  //         timestamp: stamp,
  //       },
  //     });
  //   },
  //   [request],
  // );

  // useEffect(() => {
  //   if (response) {
  //     scrollTo?.scrollToItem(response.index, 'center');
  //   }
  // }, [response, scrollTo]);
  // const handleClick = useCallback(() => {}, []);

  const handleInstall = (event: MouseEvent<HTMLButtonElement>) => {
    log('Handling install', deferredPrompt);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          log(
            'user accepted A2HS prompt',
            choiceResult.platform,
            choiceResult.outcome,
          );
        } else {
          log(
            'user dismissed A2HS prompt',
            choiceResult.platform,
            choiceResult.outcome,
          );
        }
        deferredPrompt = null;
      });
    }
  };

  const getScaledFilterStyle = useCallback(
    swipePos => {
      const totalOfWholeMoved = 1 - swipePos / width;

      return {
        backdropFilter: `grayscale(${totalOfWholeMoved *
          fullGrayScale}) blur(${totalOfWholeMoved * fullBlur}px)`,
        background: `rgba(255, 192, 238, ${totalOfWholeMoved * fullBgOpacity})`,
      };
    },
    [width],
  );

  const handleSwiping = useCallback<SwipeCallback>(event => {
    setSwipePos(event.deltaX);
  }, []);
  const handleSwiped = useCallback<SwipeCallback>(() => {
    log('swipePos', swipePos);
    if (swipePos > 20) {
      setSwipePos(width);
      setHasSwiped(true);
      toggleMenu();
      setTimeout(() => {
        setHasSwiped(false);
        setSwipePos(0);
      }, TRANSITION_SPEED);
    }
  }, [swipePos, toggleMenu, width]);

  const handlers = useSwipeable({
    onSwiping: handleSwiping,
    onSwiped: handleSwiped,
  });

  // useEffect(() => {
  //   if (!isOpen) {
  //     setSwipePos(0);
  //   }
  // }, [isOpen]);
  log('swipePos', swipePos, hasSwiped, !!swipePos);
  return userState ? (
    <CSSTransition
      in={isOpen}
      classNames={CLASS_PREFIX}
      timeout={TRANSITION_SPEED}
      unmountOnExit
    >
      <SidebarWrapper
        onClick={toggleMenu}
        {...handlers}
        isSwiping={!!swipePos}
        hasSwiped={hasSwiped}
        style={{
          ...(swipePos ? getScaledFilterStyle(swipePos) : {}),
        }}
      >
        <StyledSidebar
          isSwiping={!!swipePos}
          hasSwiped={hasSwiped}
          style={{
            ...(swipePos ? { transform: `translateX(-${swipePos}px)` } : {}),
          }}
          className="farts"
        >
          <div>
            {deferredPrompt ? (
              <Install type="button" onClick={handleInstall}>
                ❤️ Install this app ❤️
              </Install>
            ) : null}

            <List>
              {userState === 'write' ? (
                <>
                  <ListItem>
                    <StyledLink data-test="admin" to="/admin">
                      ADMIN
                    </StyledLink>
                  </ListItem>
                  <ListItem>
                    <StyledLink to="/pending">Pending</StyledLink>
                  </ListItem>
                </>
              ) : null}

              <ListItem>
                <StyledHomeLink data-test="home" to="/">
                  Home
                </StyledHomeLink>
              </ListItem>

              {tags.map(tag => (
                <ListItem key={tag.id}>
                  <StyledLink to={`/tag/${tag.name}${hash}`}>
                    {`#${tag.name}`}
                  </StyledLink>
                </ListItem>
              ))}

              <ListItem>
                <StyledLink to="/faq">FAQ</StyledLink>
              </ListItem>
            </List>
          </div>
          <StyledHelp href="mailto:leifdalan@gmail.com">Help!</StyledHelp>

          {/* <button type="button" onClick={handleChangeTheme}>
          toggle themeaa
        </button>
        <LogoutButton setUser={setUser} /> */}
        </StyledSidebar>
      </SidebarWrapper>
    </CSSTransition>
  ) : null;
}
