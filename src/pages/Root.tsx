import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector } from 'store';
import { selectAppConfig } from 'store/features';
import { darkTheme, lightTheme } from 'shared/configs/theme';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';
import ErrorLayout from 'layout/ErrorLayout';

const RootPage: React.FC = () => {
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const appTheme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <AxiosInterceptor>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ClientLoader />
        <ErrorLayout />
      </ThemeProvider>
    </AxiosInterceptor>
  );
};

export default RootPage;
