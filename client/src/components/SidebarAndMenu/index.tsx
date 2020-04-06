import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Menu from 'components/Menu';
import Sidebar from 'components/Sidebar';
import Hamburger from 'components/Sidebar/Hamburger';
import GridIcon from 'styles/GridIcon';
import PhotoIcon from 'styles/PhotoIcon';

import useUser from '../../hooks/useUser';

const { useState } = React;

const StyledLink = styled(Link)`
  color: black;
  display: flex;
  align-items: center;
  padding: 4px;
  span {
    padding-right: 8px;
  }
`;
/**
 * Composite component for Sidebar and Menu, takes no props
 * Controls opening and closing of sidebar, and provides things
 * to the sidebar via hook values
 *
 * @returns {React.ReactElement}
 */
const SidebarAndMenu: React.FC = (): React.ReactElement => {
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const { user: userState } = useUser();
  const { hash, pathname } = useLocation();

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <>
      {userState ? (
        <>
          <Menu data-test="menu" onClick={toggleMenu} as="div" side="left">
            <Hamburger isActive={shouldShowSidebar} aria-label="Menu" />
            <span>{shouldShowSidebar ? 'Close' : 'Menu'}</span>
          </Menu>
          <Menu side="right">
            <StyledLink
              to={`${pathname}${hash.includes('grid') ? '' : '#grid'}`}
            >
              <span>{hash.includes('grid') ? 'List' : 'Grid'}</span>
              {!hash.includes('grid') ? <GridIcon /> : <PhotoIcon />}
            </StyledLink>
          </Menu>
        </>
      ) : null}
      <Sidebar
        isOpen={shouldShowSidebar}
        userState={userState}
        toggleMenu={toggleMenu}
      />
    </>
  );
};

export default SidebarAndMenu;
