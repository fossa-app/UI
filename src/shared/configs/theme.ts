import { createTheme, PaletteOptions, Theme } from '@mui/material/styles';
import { APP_COLORS } from 'shared/constants';

const lightPalette: PaletteOptions = {
  primary: {
    main: APP_COLORS.light.primary,
    light: '#358297',
    dark: '#21515e',
    contrastText: '#fff',
  },
  secondary: {
    main: APP_COLORS.light.secondary,
    contrastText: '#fff',
  },
  background: {
    default: APP_COLORS.light.background,
    paper: APP_COLORS.light.paper,
  },
  error: {
    main: APP_COLORS.light.error,
  },
  info: {
    main: '#cccccc',
    dark: '#8c8c8c',
    light: '#f2f2f2',
    contrastText: '#000',
  },
  action: {
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

const darkPalette: PaletteOptions = {
  primary: {
    main: '#339966',
    light: '#66cc99',
    dark: '#1a4c34',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ff9900',
    light: '#ffcc66',
    dark: '#b36b00',
    contrastText: '#fff',
  },
  background: {
    default: APP_COLORS.dark.background,
    paper: APP_COLORS.dark.paper,
  },
  error: {
    main: APP_COLORS.dark.error,
  },
  info: {
    main: '#262626',
    light: '#333333',
    dark: '#1a1a1a',
    contrastText: '#fff',
  },
  action: {
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

const spacing = 4;

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

export const lightTheme = createTheme({
  spacing,
  components,
  palette: {
    ...lightPalette,
    mode: 'light',
  },
});

export const darkTheme = createTheme({
  spacing,
  components,
  palette: {
    ...darkPalette,
    mode: 'dark',
  },
});
