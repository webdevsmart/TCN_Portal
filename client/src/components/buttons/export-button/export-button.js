import React from 'react';
import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { Popover } from '../../popup/popup';
import { Button } from '../buttons';

const ExportButtonPageHeader = () => {
  const content = (
    <>
      <NavLink to="#">
        <FeatherIcon size={16} icon="printer" />
        <span>Products</span>
      </NavLink>
      <NavLink to="#">
        <FeatherIcon size={16} icon="book-open" />
        <span>Categories</span>
      </NavLink>
      <NavLink to="#">
        <FeatherIcon size={16} icon="file-text" />
        <span>Sales</span>
      </NavLink>
      <NavLink to="#">
        <FeatherIcon size={16} icon="x" />
        <span>Stocks</span>
      </NavLink>
      <NavLink to="#">
        <FeatherIcon size={16} icon="file" />
        <span>Rifill Run</span>
      </NavLink>
    </>
  );
  return (
    <Popover placement="bottomLeft" content={content} trigger="click">
      <Button size="small" type="white">
        <FeatherIcon icon="download" size={14} />
        Upload
      </Button>
    </Popover>
  );
};

export { ExportButtonPageHeader };
