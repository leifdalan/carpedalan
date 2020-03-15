import getUnixTime from 'date-fns/getUnixTime';
import debug from 'debug';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { client } from 'ApiClient';
import { User } from 'User';
import useApi from 'hooks/useApi';
import usePosts from 'hooks/usePosts';
import useScrollPersist from 'hooks/useScrollPersist';
import useTags from 'hooks/useTags';
import Title from 'styles/Title';
import { getThemeValue, SIDEBAR_COLOR, TEXT } from 'styles/utils';

const log = debug('components:Sidebar');

interface StyledSidebarProps {
  isOpen?: boolean;
}
const StyledSidebar = styled.div<StyledSidebarProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  width: 400px;
  max-width: 80vw;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? 0 : -40)}em;
  z-index: 1;
  background: ${getThemeValue(SIDEBAR_COLOR)};
  height: 100%;
  overflow: scroll;
  transition: left 200ms ease-in;
  font-family: ${getThemeValue('bodyFont')};
  padding: ${({ isOpen }) => (isOpen ? `1em` : '1em 0')};
  ${Title} {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const List = styled.ul`
  margin-left: 0;
  padding-left: 0;
`;

const ListItem = styled.li`
  list-style: none;
  margin-left: 0;
  margin-bottom: 1em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(TEXT)};
`;

const Close = styled.button`
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
  const { request, response } = useApi(client.getPostsIndex);
  const { scrollTo } = useScrollPersist('sidebar', []);
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

  return userState ? (
    <StyledSidebar isOpen={isOpen} onClick={toggleMenu}>
      {tags.map(tag => (
        <li key={tag.id}>
          <Link to={`/tag/${tag.name}${hash}`}>{tag.name}</Link>
        </li>
      ))}
      <div>
        <Close type="button" onClick={toggleMenu}>
          Close ✖
        </Close>
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
            <StyledLink data-test="home" to="/">
              HOME
            </StyledLink>
          </ListItem>

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
  ) : null;
}
