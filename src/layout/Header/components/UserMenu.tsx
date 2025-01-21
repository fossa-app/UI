import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Employee } from 'shared/models';

interface UserMenuProps {
  name: string;
  picture?: string;
  employee?: Employee;
  onLogoutClick: () => void;
  onUserClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ name, employee, picture, onLogoutClick, onUserClick }) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserClick = () => {
    if (!employee) {
      return;
    }

    onUserClick();
    handleCloseUserMenu();
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    handleCloseUserMenu();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton data-cy="user-avatar" aria-label="Avatar" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar alt={name} src={picture} />
      </IconButton>
      <Menu
        keepMounted
        data-testid="user-menu"
        data-cy="user-menu"
        open={Boolean(anchorElUser)}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleCloseUserMenu}
      >
        <MenuItem data-testid="user-name" data-cy="user-name" aria-label="User Name" onClick={handleUserClick}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Hi, {name}
          </Typography>
        </MenuItem>
        <MenuItem data-testid="logout-button" data-cy="logout-button" aria-label="Logout" onClick={handleLogoutClick}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
