import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from './AppSidebarNav';
import { sygnet } from 'src/assets/brand/sygnet';
import navigation from '../_nav';
import { setSidebarShow, setSidebarUnfoldable } from './store/sidebarSlice'; // Adjusted to the correct path
import logo from '../assets/images/logo.png';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { sidebarShow, sidebarUnfoldable } = useSelector((state) => state.sidebar);

  const handleCloseSidebar = () => {
    dispatch(setSidebarShow(false));
  };

  const handleSidebarToggle = () => {
    dispatch(setSidebarUnfoldable(!sidebarUnfoldable));
  };

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={sidebarUnfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible));
      }}
    >
      <CSidebarHeader className="border-bottom">
      <CSidebarBrand to="/">
        <img 
          src={logo}
          alt="BETA-PMS Logo" 
          style={{ height: '90px', width: 'auto' }} 
        />
        <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
      </CSidebarBrand>

        <CCloseButton 
          className="d-lg-none" 
          dark 
          onClick={handleCloseSidebar}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={handleSidebarToggle}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);