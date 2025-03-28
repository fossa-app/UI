import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SxProps, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { MENU_ITEMS } from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import { Module, SubModule } from 'shared/models';

interface MenuProps {
  onCloseSideBar: () => void;
}

const Menu: React.FC<MenuProps> = ({ onCloseSideBar }) => {
  const theme = useTheme();
  const location = useLocation();

  const closeSideBar = () => {
    onCloseSideBar();
  };

  const getButtonStyles = (isActive: boolean): SxProps => {
    return { color: isActive ? theme.palette.primary.main : theme.palette.info.contrastText };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <List>
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const buttonStyles = getButtonStyles(isActive);

          return (
            <ListItem disablePadding key={item.name}>
              <ListItemButton
                aria-label={item.name}
                data-cy={getTestSelectorByModule(Module.shared, SubModule.menu, `menu-item-${item.name}`)}
                component={Link}
                to={item.path}
                onClick={closeSideBar}
              >
                <ListItemIcon sx={buttonStyles}>{item.icon && <item.icon />}</ListItemIcon>
                <ListItemText primary={item.name} sx={buttonStyles} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
