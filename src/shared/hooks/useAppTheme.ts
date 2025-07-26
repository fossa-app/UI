import * as React from 'react';
import { getFromLocalStorage } from 'shared/helpers/storage.helpers';
import { CompanySettings, ThemeMode } from 'shared/models';
import { COMPANY_SETTINGS_KEY, DEFAULT_COMPANY_SETTINGS } from 'shared/constants';
import { createCustomTheme } from 'shared/themes';

export const useAppTheme = ({ isDarkTheme, companySettings }: { isDarkTheme: boolean; companySettings?: CompanySettings }) => {
  const mode: ThemeMode = isDarkTheme ? 'dark' : 'light';
  const companyDefaultSettings = getFromLocalStorage<CompanySettings>(COMPANY_SETTINGS_KEY);
  const colorSchemeId = companySettings?.colorSchemeId || companyDefaultSettings?.colorSchemeId || DEFAULT_COMPANY_SETTINGS.colorSchemeId;
  const appTheme = React.useMemo(() => createCustomTheme(mode, colorSchemeId), [colorSchemeId, mode]);

  return { appTheme, mode, colorSchemeId, isDarkTheme };
};
