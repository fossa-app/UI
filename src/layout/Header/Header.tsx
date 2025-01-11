import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { openSideBar, selectAppConfig, selectCompany, selectStep, selectUser, toggleAppTheme } from 'store/features';
import { getUserManager } from 'shared/helpers';
import { ROUTES, SEARCH_PORTAL_ID } from 'shared/constants';
import SearchPortal from 'components/Search';
import UserMenu from './components/UserMenu';
import ThemeButton from './components/ThemeButton';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: user } = useAppSelector(selectUser);
  const { data: company } = useAppSelector(selectCompany);
  const { status } = useAppSelector(selectStep);
  const userManager = getUserManager();
  const companyName = company?.name ?? '';
  const setupCompleted = status === 'succeeded';

  const handleThemeChange = () => {
    dispatch(toggleAppTheme(!isDarkTheme));
  };

  const handleLogout = async () => {
    await userManager.signoutRedirect();
  };

  const handleCompanyClick = () => {
    navigate(ROUTES.manage.path);
  };

  const showSideBar = () => {
    if (!setupCompleted) {
      return;
    }

    dispatch(openSideBar());
  };

  return (
    <AppBar position="static" component="nav">
      <Toolbar>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
          <Grid size="auto">
            <IconButton data-cy="menu-icon" aria-label="Menu" disabled={!setupCompleted} edge="end" color="inherit" onClick={showSideBar}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid size="grow">
            {companyName && (
              <Typography
                data-testid="company-logo"
                data-cy="company-logo"
                noWrap
                variant="h6"
                onClick={handleCompanyClick}
                sx={{ maxWidth: { sm: 320, xs: 120, cursor: 'pointer' } }}
              >
                {companyName}
              </Typography>
            )}
          </Grid>
          <Grid size="auto">
            <div id={SEARCH_PORTAL_ID} />
            <SearchPortal fullWidth size="small" />
          </Grid>
          <Grid size="auto">
            <ThemeButton isDarkTheme={isDarkTheme} onClick={handleThemeChange} />
          </Grid>
          <Grid size="auto">
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
