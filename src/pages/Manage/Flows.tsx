import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { useAppSelector } from 'store';
import { selectFlows } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { convertFlowsMapToArray } from 'shared/helpers';
import Page, { PageSubtitle, PageTitle } from 'components/UI/Page';
import FlowGroup from 'components/Flow/FlowGroup';

const testModule = Module.manage;
const testSubModule = SubModule.flows;

const FlowsPage: React.FC = () => {
  const flowsMap = useAppSelector(selectFlows);
  const flows = React.useMemo(() => convertFlowsMapToArray(flowsMap), [flowsMap]);

  return (
    <>
      <Page module={testModule} subModule={testSubModule} sx={{ display: 'flex', flexDirection: 'column' }}>
        <PageTitle>Flows</PageTitle>
        <PageSubtitle>Manage Flows</PageSubtitle>
      </Page>
      <Grid container spacing={4} sx={{ justifyContent: 'center', mt: 4 }}>
        {flows.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }} key={item.name}>
            <FlowGroup {...item} module={testModule} subModule={testSubModule} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FlowsPage;
