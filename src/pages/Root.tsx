import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useAppSelector } from 'store';
import { selectAppConfig, selectCompanySettings } from 'store/features';
import { darkScrollbar, getFromLocalStorage, lightScrollbar } from 'shared/helpers';
import { CompanySettings, ThemeMode } from 'shared/models';
import { COMPANY_SETTINGS_KEY } from 'shared/constants';
import { createCustomTheme } from 'shared/themes';
import MessageLayout from 'layout/MessageLayout';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';

const RootPage: React.FC = () => {
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: companySettings } = useAppSelector(selectCompanySettings);
  const mode: ThemeMode = isDarkTheme ? 'dark' : 'light';
  const companyDefaultSettings = getFromLocalStorage<CompanySettings>(COMPANY_SETTINGS_KEY);
  const colorSchemeId = companySettings?.colorSchemeId || companyDefaultSettings?.colorSchemeId;
  const appTheme = React.useMemo(() => createCustomTheme(mode, colorSchemeId), [colorSchemeId, mode]);

  return (
    <AxiosInterceptor>
      <ThemeProvider theme={appTheme}>
        <GlobalStyles styles={isDarkTheme ? darkScrollbar() : lightScrollbar()} />
        <CssBaseline />
        <ClientLoader />
        <MessageLayout />
      </ThemeProvider>
    </AxiosInterceptor>
  );
};

export default RootPage;
