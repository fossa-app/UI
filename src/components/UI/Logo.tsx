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
        width: 48,
        height: 48,
        ...sx,
      }}
    />
  );
};

export default Logo;
