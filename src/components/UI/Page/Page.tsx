import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import PageContext from './PageContext';

type PageProps = BoxProps;

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, ...props }) => {
  return (
    <PageContext.Provider value={{}}>
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
    </PageContext.Provider>
  );
};

export default Page;
