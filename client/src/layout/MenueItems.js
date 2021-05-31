import React from 'react';
import { Menu } from 'antd';
import { NavLink, useRouteMatch } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import propTypes from 'prop-types';

const { SubMenu } = Menu;

const MenuItems = ({ darkMode, toggleCollapsed, topMenu }) => {
  const { path } = useRouteMatch();

  const pathName = window.location.pathname;
  const pathArray = pathName.split(path);
  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split('/');

  const [openKeys, setOpenKeys] = React.useState(
    !topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : [],
  );

  const onOpenChange = keys => {
    setOpenKeys(keys[keys.length - 1] !== 'recharts' ? [keys.length && keys[keys.length - 1]] : keys);
  };

  const onClick = item => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? 'inline' : 'horizontal'}
      theme={darkMode && 'dark'}
      // // eslint-disable-next-line no-nested-ternary
      defaultSelectedKeys={
        !topMenu
          ? [
              `${
                mainPathSplit.length === 1 ? 'home' : mainPathSplit.length === 2 ? mainPathSplit[1] : mainPathSplit[2]
              }`,
            ]
          : []
      }
      defaultOpenKeys={!topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : []}
      overflowedIndicator={<FeatherIcon icon="more-vertical" />}
      openKeys={openKeys}
    >
      <Menu.Item key="home" icon={
          !topMenu && (
            <NavLink className="menuItem-iocn" to={`/`}>
              <FeatherIcon icon="home" />
            </NavLink>
          )
        }>
        <NavLink onClick={toggleCollapsed} to={`/`}>
          Dashboard
        </NavLink>
      </Menu.Item>
      <SubMenu key="sale" icon={!topMenu && <FeatherIcon icon="dollar-sign" />} title="Sales">
        <Menu.Item key="total">
          <NavLink
            to="#"
          >
            Total Sales
          </NavLink>
        </Menu.Item>
        <Menu.Item key="cash">
          <NavLink
            to="#"
          >
            Cash Sales
          </NavLink>
        </Menu.Item>
        <Menu.Item key="card">
          <NavLink
            to="#"
          >
            Card Sales
          </NavLink>
        </Menu.Item>
        <Menu.Item key="refund">
          <NavLink
            to="#"
          >
            Refunds
          </NavLink>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="stock" icon={!topMenu && <FeatherIcon icon="shopping-bag" />} title="Stock">
        <Menu.Item key="stock">
          <NavLink
            to={`/stock/category`}
          >
            Categories
          </NavLink>
        </Menu.Item>
        <Menu.Item key="products">
          <NavLink
            to={`/stock/product`}
          >
            Products
          </NavLink>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="machine" icon={!topMenu && <FeatherIcon icon="shopping-bag" />} title="Machine">
        <Menu.Item key="machineMng">
          <NavLink
            to={`/machine`}
          >
            Machine Management
          </NavLink>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="setting" icon={!topMenu && <FeatherIcon icon="settings" />} title="Setting">
        <Menu.Item key="setting">
          <NavLink
            to={`${path}/settings/logMng`}
          >
            Log Management
          </NavLink>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

MenuItems.propTypes = {
  darkMode: propTypes.bool,
  topMenu: propTypes.bool,
  toggleCollapsed: propTypes.func,
};

export default MenuItems;
