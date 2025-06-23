import { COLOR_SCHEME_KEYS, COLOR_SCHEMES } from 'shared/themes';

export type ThemeMode = 'light' | 'dark';
export type ColorSchemeId = keyof typeof COLOR_SCHEMES;
export type ColorSchemeKey = (typeof COLOR_SCHEME_KEYS)[number];

export type ColorScheme = {
  label: string;
  mode: ThemeMode;
} & Record<ColorSchemeKey, string>;
