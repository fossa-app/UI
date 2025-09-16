import React from 'react';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { useAppDispatch, useAppSelector } from 'store';
import { closeSidebar, selectAppConfig } from 'store/features';
import Menu from './components/Menu';

type SideBarProps = DrawerProps;

const SideBar: React.FC<SideBarProps> = ({ ...props }) => {
  const dispatch = useAppDispatch();
  const { sideBarOpened } = useAppSelector(selectAppConfig);

  const close = () => {
    dispatch(closeSidebar());
  };

  return (
    <Drawer
      {...props}
      variant={props.variant}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 280 } },
        },
      }}
      open={sideBarOpened}
      onClose={close}
    >
      <Menu onCloseSideBar={close} />
    </Drawer>
  );
};

export default SideBar;
