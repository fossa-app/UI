import * as React from 'react';
import Box from '@mui/system/Box';
import Page, { PageTitle, PageSubtitle } from 'components/Page';

const BranchesPage: React.FC = () => {
  return (
    <Box>
      <Page>
        <PageTitle>Branches</PageTitle>
        <PageSubtitle>Manage Branches</PageSubtitle>
      </Page>
    </Box>
  );
};

export default BranchesPage;
