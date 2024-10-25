import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type PageProps = BoxProps;

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      sx={{
        textAlign: 'center',
        my: 4,
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Page;
