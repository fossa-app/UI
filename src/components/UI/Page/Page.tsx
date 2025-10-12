import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Module, SubModule } from 'shared/types';
import PageContext from './PageContext';
import PageTitle from './PageTitle';
import PageSubtitle from './PageSubtitle';

type PageProps = React.PropsWithChildren<{
  module: Module;
  subModule: SubModule;
}> &
  BoxProps;

const Page = ({ module, subModule, children, ...props }: PageProps) => {
  return (
    <PageContext.Provider value={{ module, subModule }}>
      <Box
        data-cy={`${module}-${subModule}-page`}
        {...props}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          my: 4,
          ...props.sx,
        }}
      >
        {children}
      </Box>
    </PageContext.Provider>
  );
};

Page.Title = PageTitle;
Page.Subtitle = PageSubtitle;

export default Page;
