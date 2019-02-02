import React, { useContext, useEffect } from 'react';
import { bool, func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { User } from '..';

import { getThemeValue, SIDEBAR_COLOR, TEXT } from '../styles';
import { Tag } from '../providers/TagProvider';
import Title from '../styles/Title';

const StyledSidebar = styled.div`
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
  font-family: montserratregular;
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

const Close = styled(Title)`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`;

const StyledHelp = styled(Title)`
  text-decoration: none;
  color: ${getThemeValue(TEXT)};
`;

export default function Sidebar({
  toggleMenu,
  userState,
  // setUser,
  // handleChangeTheme,
  isOpen,
}) {
  const { user } = useContext(User);
  const { tags, loadTags } = useContext(Tag);

  useEffect(() => {
    if (user) loadTags();
    return null;
  }, [user]);

  return userState ? (
    <StyledSidebar isOpen={isOpen} onClick={toggleMenu}>
      <div>
        <Close type="button" as="button" onClick={toggleMenu}>
          Close ✖
        </Close>
        <List>
          {userState === 'write' ? (
            <ListItem>
              <StyledLink to="/admin">ADMIN</StyledLink>
            </ListItem>
          ) : null}

          <ListItem>
            <StyledLink to="/">HOME</StyledLink>
          </ListItem>

          <ListItem>
            <StyledLink to="/faq">FAQ</StyledLink>
          </ListItem>

          {tags
            .sort((a, b) => b.count - a.count)
            .map(({ name, id, count }) => (
              <ListItem key={id}>
                <StyledLink to={`/tag/${name}`}>
                  {`#${name} (${count || 0})`}
                </StyledLink>
              </ListItem>
            ))}
        </List>
      </div>
      <StyledHelp as="a" href="mailto:leifdalan@gmail.com">
        Help!
      </StyledHelp>
      {/* <button type="button" onClick={handleChangeTheme}>
        toggle themeaa
      </button>
      <LogoutButton setUser={setUser} /> */}
    </StyledSidebar>
  ) : null;
}

Sidebar.defaultProps = {
  userState: null,
};

Sidebar.propTypes = {
  userState: string,
  // setUser: func.isRequired,
  // handleChangeTheme: func.isRequired,
  toggleMenu: func.isRequired,
  isOpen: bool.isRequired,
};
