import * as React from 'react';
import Box from '@mui/material/Box';
import { Module, SubModule } from 'shared/models';
import Page, { PageTitle } from 'components/UI/Page';
import NotFoundPage from 'pages/NotFound';

interface FormLayoutProps {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  withBackButton?: boolean;
  displayNotFoundPage?: boolean;
  onBackButtonClick?: () => void;
}

const FormLayout: React.FC<React.PropsWithChildren<FormLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  withBackButton = false,
  displayNotFoundPage,
  onBackButtonClick,
  children,
}) => {
  if (displayNotFoundPage) {
    return <NotFoundPage />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Page>
        <PageTitle
          data-cy={`${module}-${subModule}-form-layout-title`}
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

export default FormLayout;
