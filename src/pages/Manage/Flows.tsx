import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { ALL_FLOWS } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import Page, { PageSubtitle, PageTitle } from 'components/UI/Page';
import FlowGroup from 'components/Flow/FlowGroup';

const testModule = Module.manage;
const testSubModule = SubModule.flows;

const FlowsPage: React.FC = () => {
  return (
    <>
      <Page module={testModule} subModule={testSubModule} sx={{ display: 'flex', flexDirection: 'column' }}>
        <PageTitle>Flows</PageTitle>
        <PageSubtitle>Manage Flows</PageSubtitle>
      </Page>
      <Grid container spacing={4} sx={{ justifyContent: 'center', mt: 4 }}>
        {ALL_FLOWS.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }} key={item.name}>
            <FlowGroup
              {...item}
              module={testModule}
              subModule={testSubModule}
              // TODO: move styles to FlowGroup component
              buttonProps={{
                sx: {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                },
              }}
              iconProps={{ sx: { justifyContent: 'center' } }}
              textProps={{ sx: { flex: 0, m: 0 } }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FlowsPage;
