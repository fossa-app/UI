import { createTheme, Theme } from '@mui/material/styles';
import { getPaletteFromScheme } from 'shared/helpers';
import { ColorSchemeId, ThemeMode } from 'shared/models';
import { DEFAULT_COLOR_SCHEME } from 'shared/constants';

const components = {
  // TODO: move all general styles
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(6),
      }),
    },
  },
  MuiAccordionActions: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: theme.spacing(6),
      }),
    },
  },
};

export const CUSTOM_STYLES = {
  scrollableContentHeight: 'calc(100vh - 250px)',
};

export const createCustomTheme = (mode: ThemeMode, schemeId?: ColorSchemeId): Theme => {
  const palette = getPaletteFromScheme(schemeId ?? DEFAULT_COLOR_SCHEME, mode);

  return createTheme({
    spacing: 4,
    components,
    palette: {
      ...palette,
      mode,
    },
  });
};
