import * as React from 'react';
import { useFusionAuth } from '@fusionauth/react-sdk';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAppDispatch, useAppSelector } from 'store';
import { selectConfig, setConfig } from 'store/features';

const Header: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectConfig);
  const { userInfo } = useFusionAuth();

  const handleThemeChange = (): void => {
    dispatch(
      setConfig({
        isDarkTheme: !isDarkTheme,
      })
    );
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
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
              sx={{ mr: 2 }}
            >
              {userInfo.given_name}
            </Typography>
          )}
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Switch
                data-testid="theme-switch"
                color="primary"
                checked={isDarkTheme}
                onChange={handleThemeChange}
              />
            }
            label="Dark theme"
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
