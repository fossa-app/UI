import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useAppSelector } from 'store';
import { selectAppConfig, selectCompanySettings } from 'store/features';
import { useAppTheme } from 'shared/hooks';
import { darkScrollbar, lightScrollbar } from 'shared/helpers';
import MessageLayout from 'layout/MessageLayout';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';

const RootPage: React.FC = () => {
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: companySettings } = useAppSelector(selectCompanySettings);
  const { appTheme } = useAppTheme({ isDarkTheme, companySettings });

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
