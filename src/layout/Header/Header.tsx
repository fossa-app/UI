import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { openSideBar, selectAppConfig, selectCompany, selectStep, selectUser, toggleAppTheme } from 'store/features';
import { getSearchContext, getUserManager } from 'shared/helpers';
import { ROUTES } from 'shared/constants';
import Search from 'components/Search';
import UserMenu from './components/UserMenu';
import ThemeSwitch from './components/ThemeSwitch';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: user } = useAppSelector(selectUser);
  const { data: company } = useAppSelector(selectCompany);
  const { status } = useAppSelector(selectStep);
  const userManager = getUserManager();
  const [locationPathname, setLocationPathname] = React.useState(location.pathname);
  const companyName = company?.name ?? '';
  const setupCompleted = status === 'succeeded';
  const showSearch = setupCompleted && !!getSearchContext(locationPathname);

  const handleThemeChange = () => {
    dispatch(toggleAppTheme(!isDarkTheme));
  };

  const handleLogout = async () => {
    await userManager.signoutRedirect();
  };

  const handleGetOptionLabel = (option: { id: string; name: string }) => {
    return option.name;
  };

  const handleCompanyClick = () => {
    navigate(ROUTES.manage.path);
  };

  const showSideBar = () => {
    dispatch(openSideBar());
  };

  React.useEffect(() => {
    setLocationPathname(pathname);
  }, [pathname]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
          <Grid size="auto">
            {setupCompleted && (
              <IconButton edge="end" color="inherit" onClick={showSideBar}>
                <MenuIcon />
              </IconButton>
            )}
          </Grid>
          <Grid size="grow">
            {companyName && (
              <Typography
                data-testid="app-logo"
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
            {showSearch && <Search data={[]} context={getSearchContext(locationPathname)!} getOptionLabel={handleGetOptionLabel} />}
          </Grid>
          <Grid size="auto">
            <ThemeSwitch isDarkTheme={isDarkTheme} onThemeChange={handleThemeChange} />
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
