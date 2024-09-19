import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// TODO: find a way to inherit this from @fusionauth
interface UserMenuProps {
  name: string;
  picture?: string;
  onLogoutClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  name,
  picture,
  onLogoutClick,
}) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar alt={name} src={picture} />
      </IconButton>
      <Menu
        keepMounted
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
        <MenuItem data-testid="user-name">
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Hi, {name}
          </Typography>
        </MenuItem>
        <MenuItem data-testid="logout-button" onClick={onLogoutClick}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
