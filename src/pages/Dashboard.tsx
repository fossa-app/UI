import * as React from 'react';
import Box from '@mui/system/Box';
import Page, { PageTitle, PageSubtitle } from 'components/Page';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Page>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Manage Dashboard</PageSubtitle>
      </Page>
    </Box>
  );
};

export default DashboardPage;
