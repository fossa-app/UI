import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type LogoProps = BoxProps;

const Logo: React.FC<LogoProps> = ({ sx }) => {
  return (
    <Box
      component="img"
      src="/logo192.png"
      alt="Fossa"
      sx={{
        width: 'auto',
        height: '48px',
        ...sx,
      }}
    />
  );
};

export default Logo;
