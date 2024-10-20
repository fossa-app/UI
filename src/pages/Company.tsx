import * as React from 'react';
import Box from '@mui/system/Box';
import Page, { PageSubtitle, PageTitle } from 'components/Page';

const CompanyPage: React.FC = () => {
  return (
    <Box>
      <Page>
        <PageTitle>Company</PageTitle>
        <PageSubtitle>Manage Companies</PageSubtitle>
      </Page>
    </Box>
  );
};

export default CompanyPage;
