import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Module, SubModule } from 'shared/types';
import Page from 'components/UI/Page';
import { createLazyComponent } from 'routes/lazy-loaded-component';
import { useSafeNavigateBack } from 'shared/hooks';

const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });

type BaseProps = {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  displayNotFoundPage?: boolean;
} & BoxProps;

type WithBackButton = {
  withBackButton: true;
  fallbackRoute: string;
};

type WithoutBackButton = {
  withBackButton?: false;
  fallbackRoute?: never;
};

type PageLayoutProps = BaseProps & (WithBackButton | WithoutBackButton);

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  fallbackRoute,
  withBackButton = false,
  displayNotFoundPage,
  children,
  ...props
}) => {
  const safeNavigateBack = useSafeNavigateBack(fallbackRoute);

  if (displayNotFoundPage) {
    return NotFoundPage;
  }

  const handleBackButtonClick = () => {
    safeNavigateBack();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ...props.sx }} {...props}>
      <Page module={module} subModule={subModule} sx={{ minHeight: 48 }}>
        <Page.Title withBackButton={withBackButton} onBackButtonClick={handleBackButtonClick}>
          {pageTitle}
        </Page.Title>
      </Page>
      {children}
    </Box>
  );
};

export default PageLayout;
