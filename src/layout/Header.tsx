import * as React from 'react';
import { useFusionAuth } from '@fusionauth/react-sdk';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAppDispatch, useAppSelector } from 'store';
import { selectConfig, setConfig } from 'store/features';

const Header: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectConfig);
  const { isLoggedIn, userInfo, startLogout } = useFusionAuth();

  const handleThemeChange = (): void => {
    dispatch(
      setConfig({
        isDarkTheme: !isDarkTheme,
      })
    );
  };

  const handleLogout = (): void => {
    startLogout();
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            data-testid="app-logo"
            noWrap
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Fossa
          </Typography>
          {userInfo?.given_name && (
            <Typography
              data-testid="user-name"
              noWrap
              variant="body2"
              sx={{ mr: 3 }}
            >
              {userInfo.given_name}
            </Typography>
          )}
          {isLoggedIn && (
            <IconButton color="secondary" size="small" onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          )}
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Switch
                data-testid="theme-switch"
                size="small"
                checked={isDarkTheme}
                onChange={handleThemeChange}
              />
            }
            labelPlacement="start"
            label={<Typography variant="body2">Dark theme</Typography>}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
