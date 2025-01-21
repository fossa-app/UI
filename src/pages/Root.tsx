import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useAppSelector } from 'store';
import { selectAppConfig } from 'store/features';
import { darkTheme, lightTheme } from 'shared/configs/theme';
import { darkScrollbar, lightScrollbar } from 'shared/helpers';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';
import ErrorLayout from 'layout/ErrorLayout';
import LoaderLayout from 'layout/LoaderLayout';

const RootPage: React.FC = () => {
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const appTheme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <AxiosInterceptor>
      <ThemeProvider theme={appTheme}>
        <GlobalStyles styles={isDarkTheme ? darkScrollbar() : lightScrollbar()} />
        <CssBaseline />
        <ClientLoader />
        <ErrorLayout />
        {/* TODO: add SuccessLayout */}
        <LoaderLayout />
      </ThemeProvider>
    </AxiosInterceptor>
  );
};

export default RootPage;
