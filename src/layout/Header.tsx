import * as React from 'react';
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fossa
          </Typography>
          <FormControlLabel
            control={
              <Switch
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
