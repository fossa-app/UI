import * as React from 'react';
import Box from '@mui/material/Box';
import Page, { PageTitle } from 'components/UI/Page';

interface FormLayoutProps {
  pageTitle: string;
  withBackButton?: boolean;
  onBackButtonClick?: () => void;
}

const FormLayout: React.FC<React.PropsWithChildren<FormLayoutProps>> = ({
  pageTitle,
  withBackButton = false,
  onBackButtonClick,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Page>
        <PageTitle withBackButton={withBackButton} onBackButtonClick={onBackButtonClick}>
          {pageTitle}
        </PageTitle>
      </Page>
      {children}
    </Box>
  );
};

export default FormLayout;
