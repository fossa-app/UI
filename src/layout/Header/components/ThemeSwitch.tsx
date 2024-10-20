import * as React from 'react';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface ThemeSwitchProps {
  isDarkTheme: boolean;
  onThemeChange: () => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDarkTheme, onThemeChange }) => {
  return (
    <FormControlLabel
      control={<Switch data-testid="theme-switch" size="small" checked={isDarkTheme} onChange={onThemeChange} />}
      labelPlacement="start"
      label={
        <Typography noWrap variant="body2">
          Dark theme
        </Typography>
      }
    />
  );
};

export default ThemeSwitch;
