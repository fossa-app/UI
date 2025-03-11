import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Module, SubModule } from 'shared/models';
import PageContext from './PageContext';

type PageProps = {
  module: Module;
  subModule: SubModule;
} & BoxProps;

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ module, subModule, children, ...props }) => {
  return (
    <PageContext.Provider value={{ module, subModule }}>
      <Box
        data-cy={`${module}-${subModule}-page`}
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
