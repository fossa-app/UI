import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box, { BoxProps } from '@mui/material/Box';
import { Module, SubModule } from 'shared/models';
import Page from 'components/UI/Page';
import { createLazyComponent } from 'routes/lazy-loaded-component';

const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });

type PageLayoutProps = {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  withBackButton?: boolean;
  displayNotFoundPage?: boolean;
} & BoxProps;

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  withBackButton = false,
  displayNotFoundPage,
  children,
  ...props
}) => {
  const navigate = useNavigate();

  if (displayNotFoundPage) {
    return NotFoundPage;
  }

  const handleBackButtonClick = () => {
    navigate(-1);
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
