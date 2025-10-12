import React from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { getTestSelectorByModule } from 'shared/helpers';
import { Module, SubModule } from 'shared/types';

const testModule = Module.shared;
const testSubModule = SubModule.header;

type ThemeButtonProps = {
  isDarkTheme: boolean;
} & IconButtonProps;

const ThemeButton: React.FC<ThemeButtonProps> = ({ isDarkTheme, ...props }) => {
  return (
    <IconButton
      data-testid="theme-button"
      data-cy={getTestSelectorByModule(testModule, testSubModule, 'theme-button')}
      aria-label="Theme Button"
      {...props}
    >
      {isDarkTheme ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeButton;
