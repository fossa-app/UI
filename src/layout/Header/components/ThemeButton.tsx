import * as React from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

type ThemeButtonProps = {
  isDarkTheme: boolean;
} & IconButtonProps;

const ThemeButton: React.FC<ThemeButtonProps> = ({ isDarkTheme, ...props }) => {
  return (
    <IconButton data-testid="theme-button" {...props}>
      {isDarkTheme ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeButton;
