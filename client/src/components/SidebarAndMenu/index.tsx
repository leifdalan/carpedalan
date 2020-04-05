import * as React from 'react';

import Menu from 'components/Menu';
import Sidebar from 'components/Sidebar';
import Hamburger from 'components/Sidebar/Hamburger';

import useUser from '../../hooks/useUser';

const { useState } = React;

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

  const toggleMenu = () => setShouldShowSidebar(!shouldShowSidebar);

  return (
    <>
      {userState ? (
        <Menu data-test="menu" onClick={toggleMenu} as="div" side="left">
          <Hamburger isActive={shouldShowSidebar} />
          <span>{shouldShowSidebar ? 'Close' : 'Menu'}</span>
        </Menu>
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
