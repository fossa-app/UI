import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Employee, Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';

const testModule = Module.shared;
const testSubModule = SubModule.header;

interface ProfileMenuProps {
  profile?: Employee;
  onLogoutClick: () => void;
  onProfileClick: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ profile, onLogoutClick, onProfileClick }) => {
  const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);

  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  const handleProfileClick = () => {
    if (!profile || profile.isDraft) {
      return;
    }

    onProfileClick();
    handleCloseProfileMenu();
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    handleCloseProfileMenu();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        data-cy={getTestSelectorByModule(testModule, testSubModule, 'profile-avatar')}
        aria-label="Avatar"
        onClick={handleOpenProfileMenu}
        sx={{ p: 0 }}
      >
        <Avatar alt={profile?.firstName} src={profile?.picture} />
      </IconButton>
      <Menu
        keepMounted
        data-testid="profile-menu"
        data-cy={getTestSelectorByModule(testModule, testSubModule, 'profile-menu')}
        open={Boolean(anchorElProfile)}
        anchorEl={anchorElProfile}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleCloseProfileMenu}
      >
        <MenuItem
          data-testid="profile-name"
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'profile-name')}
          aria-label="Profile Name"
          onClick={handleProfileClick}
        >
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Hi, {profile?.firstName}
          </Typography>
        </MenuItem>
        <MenuItem
          data-testid="logout-button"
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'logout-button')}
          aria-label="Logout"
          onClick={handleLogoutClick}
        >
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
