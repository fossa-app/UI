import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { openSideBar, selectAppConfig, selectCompany, selectProfile, selectOnboardingCompleted, toggleAppTheme } from 'store/features';
import { getTestSelectorByModule, getUserManager } from 'shared/helpers';
import { ROUTES, SEARCH_PORTAL_ID } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import SearchPortal from 'components/Search';
import ProfileMenu from './components/ProfileMenu';
import ThemeButton from './components/ThemeButton';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: company } = useAppSelector(selectCompany);
  const { data: profile } = useAppSelector(selectProfile);
  const onboardingCompleted = useAppSelector(selectOnboardingCompleted);
  const userManager = getUserManager();
  const companyName = company?.name ?? '';

  const handleThemeChange = () => {
    dispatch(toggleAppTheme(!isDarkTheme));
  };

  const handleLogout = async () => {
    await userManager.signoutRedirect();
  };

  const handleProfileClick = () => {
    navigate(ROUTES.viewProfile.path);
  };

  const handleCompanyClick = () => {
    navigate(ROUTES.viewCompany.path);
  };

  const showSideBar = () => {
    if (!onboardingCompleted) {
      return;
    }

    dispatch(openSideBar());
  };

  const navigateFlowsPage = () => {
    navigate(ROUTES.flows.path);
  };

  return (
    <AppBar position="sticky" component="nav">
      <Toolbar>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
          <Grid size="auto">
            <IconButton
              data-cy={getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon')}
              aria-label="Menu"
              disabled={!onboardingCompleted}
              edge="end"
              color="inherit"
              onClick={showSideBar}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
          {profile && (
            <Grid size="auto">
              <IconButton
                data-cy={getTestSelectorByModule(Module.shared, SubModule.header, 'flows-icon')}
                aria-label="Flows"
                edge="end"
                color="inherit"
                onClick={navigateFlowsPage}
              >
                <AccountTreeIcon />
              </IconButton>
            </Grid>
          )}
          <Grid size="grow">
            {companyName && (
              <Typography
                data-testid="company-logo"
                data-cy={getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo')}
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
            {profile && <ProfileMenu profile={profile} onLogoutClick={handleLogout} onProfileClick={handleProfileClick} />}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
