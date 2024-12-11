import * as React from 'react';
import Box from '@mui/material/Box';
import { Module, SubModule } from 'shared/models';
import Page, { PageTitle } from 'components/UI/Page';
import { createLazyComponent } from 'routes/lazy-loaded-component';

const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });

interface PageLayoutProps {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  withBackButton?: boolean;
  displayNotFoundPage?: boolean;
  onBackButtonClick?: () => void;
}

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  withBackButton = false,
  displayNotFoundPage,
  onBackButtonClick,
  children,
}) => {
  if (displayNotFoundPage) {
    return NotFoundPage;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Page>
        <PageTitle
          data-cy={`${module}-${subModule}-page-layout-title`}
          withBackButton={withBackButton}
          onBackButtonClick={onBackButtonClick}
        >
          {pageTitle}
        </PageTitle>
      </Page>
      {children}
    </Box>
  );
};

export default PageLayout;
