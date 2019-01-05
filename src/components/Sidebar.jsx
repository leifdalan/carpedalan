import React, { useContext, useEffect } from 'react';
import { bool, func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getThemeValue, SIDEBAR_COLOR, TEXT } from '../styles';
import { Tag } from '../providers/TagProvider';
import Title from '../styles/Title';

import LogoutButton from './LogoutButton';

const StyledSidebar = styled.div`
  position: fixed;
  width: 200px;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? 0 : -20)}em;
  z-index: 1;
  background: ${getThemeValue(SIDEBAR_COLOR)};
  height: 100%;
  overflow: scroll;
  transition: left 200ms ease-in;
  font-family: montserratregular;
  padding: ${({ isOpen }) => (isOpen ? 1 : 0)}em;
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

export default function Sidebar({
  toggleMenu,
  userState,
  setUser,
  handleChangeTheme,
  isOpen,
}) {
  const { tags, loadTags } = useContext(Tag);

  useEffect(() => {
    loadTags();
    return null;
  }, []);
  return userState ? (
    <StyledSidebar isOpen={isOpen}>
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
          <StyledLink to="/">Main Feed</StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink to="/archive">Archive</StyledLink>
        </ListItem>

        {tags.map(({ name, id }) => (
          <ListItem key={id}>
            <StyledLink to={`/tag/${name}`}>{name}</StyledLink>
          </ListItem>
        ))}
      </List>
      <button type="button" onClick={handleChangeTheme}>
        toggle themeaa
      </button>
      <LogoutButton setUser={setUser} />
    </StyledSidebar>
  ) : null;
}

Sidebar.propTypes = {
  userState: string.isRequired,
  setUser: func.isRequired,
  handleChangeTheme: func.isRequired,
  toggleMenu: func.isRequired,
  isOpen: bool.isRequired,
};
