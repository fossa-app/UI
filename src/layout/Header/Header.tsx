import * as React from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { selectAppConfig, selectCompany, selectUser, updateAppConfig } from 'store/features';
import { getUserManager } from 'shared/helpers';
import Search from '../../components/Search';
import UserMenu from './components/UserMenu/UserMenu';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const userManager = getUserManager();
  const { data: user } = useAppSelector(selectUser);
  const { data: company } = useAppSelector(selectCompany);
  const companyName = company?.name ?? '';

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

  const handleGetOptionLabel = (option: { id: string; name: string }) => {
    return option.name;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
          <Grid size="auto">
            <IconButton edge="end">
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid size="grow">
            <Typography data-testid="app-logo" noWrap variant="h6" component="div">
              {companyName}
            </Typography>
          </Grid>
          <Grid size={3}>
            <Search data={[]} getOptionLabel={handleGetOptionLabel} />
          </Grid>
          <Grid size="auto" sx={{ display: 'flex', alignItems: 'center' }}>
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
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
