import * as React from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAppDispatch, useAppSelector } from 'store';
import { selectAppConfig, selectUser, updateAppConfig } from 'store/features';
import { getUserManager } from 'shared/helpers';
import Logo from '../../components/UI/Logo';
import UserMenu from './components/UserMenu/UserMenu';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const userManager = getUserManager();
  const { data: user } = useAppSelector(selectUser);

  const handleThemeChange = () => {
    dispatch(
      updateAppConfig({
        isDarkTheme: !isDarkTheme,
      })
    );
  };

  const handleLogout = async () => {
    await userManager.signoutRedirect();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="end" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Logo sx={{ mr: 2 }} />
        <Typography data-testid="app-logo" noWrap variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fossa
        </Typography>
        <FormControlLabel
          sx={{ mr: 1 }}
          control={<Switch data-testid="theme-switch" size="small" checked={isDarkTheme} onChange={handleThemeChange} />}
          labelPlacement="start"
          label={
            <Typography noWrap variant="body2">
              Dark theme
            </Typography>
          }
        />
        {user?.profile?.given_name && (
          <UserMenu name={user.profile.given_name} picture={user.profile.picture} onLogoutClick={handleLogout} />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
