import { PaletteOptions } from '@mui/material/styles';
import { COLOR_SCHEMES } from 'shared/themes';
import { ColorSchemeId, ThemeMode } from 'shared/types';

export const getPaletteFromScheme = (schemeId: ColorSchemeId, mode: ThemeMode): PaletteOptions => {
  const themeGroup = COLOR_SCHEMES[schemeId];

  const scheme = themeGroup[mode];

  if (!scheme) {
    const fallbackEntry = Object.entries(COLOR_SCHEMES).find(([, val]) => val[mode]);

    if (!fallbackEntry) {
      throw new Error(`No color scheme found for mode: ${mode}`);
    }

    const [fallbackId, fallbackTheme] = fallbackEntry;
    console.warn(`Scheme "${schemeId}" doesn't support mode "${mode}", using fallback "${fallbackId}"`);

    return createPaletteFromScheme(fallbackTheme[mode], mode);
  }

  return createPaletteFromScheme(scheme, mode);
};

const createPaletteFromScheme = (
  scheme: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    error: string;
    info: string;
  },
  mode: ThemeMode
): PaletteOptions => ({
  primary: { main: scheme.primary, contrastText: '#fff' },
  secondary: { main: scheme.secondary, contrastText: '#000' },
  background: { default: scheme.background, paper: scheme.paper },
  error: { main: scheme.error },
  info: { main: scheme.info, contrastText: '#000' },
  action: {
    disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.38)',
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
});
