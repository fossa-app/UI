import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Box from '@mui/material/Box';
import { useAppSelector } from 'store';
import { selectAppConfig, selectCompanySettings, selectPreviewColorSchemeId } from 'store/features';
import { useAppTheme } from 'shared/hooks';
import { darkScrollbar, getTestSelectorByModule, lightScrollbar } from 'shared/helpers';
import { Module, SubModule } from 'shared/models';
import MessageLayout from 'layout/MessageLayout';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';

const RootPage: React.FC = () => {
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { item: companySettings } = useAppSelector(selectCompanySettings);
  const previewColorSchemeId = useAppSelector(selectPreviewColorSchemeId);
  const effectiveColorSchemeId = previewColorSchemeId || companySettings!.colorSchemeId;
  const { appTheme, colorSchemeId } = useAppTheme({
    isDarkTheme,
    companySettings: { ...companySettings, colorSchemeId: effectiveColorSchemeId },
  });

  return (
    <AxiosInterceptor>
      <ThemeProvider theme={appTheme}>
        <GlobalStyles styles={isDarkTheme ? darkScrollbar() : lightScrollbar()} />
        <CssBaseline />
        <ClientLoader />
        <MessageLayout />
        <Box
          data-cy={getTestSelectorByModule(Module.shared, SubModule.theme, 'app-theme')}
          data-theme={appTheme.palette.mode}
          data-color-scheme-id={colorSchemeId}
          sx={{ display: 'contents' }}
        />
      </ThemeProvider>
    </AxiosInterceptor>
  );
};

export default RootPage;
