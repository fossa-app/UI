import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { useAppSelector } from 'store';
import { selectFlows, selectUserRoles } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { convertFlowsMapToArray } from 'shared/helpers';
import { APP_CONFIG } from 'shared/constants';
import Page from 'components/UI/Page';
import FlowGroup from 'components/Flow/FlowGroup';

const testModule = Module.manage;
const testSubModule = SubModule.flows;

const FlowsPage: React.FC = () => {
  const flowsMap = useAppSelector(selectFlows);
  const userRoles = useAppSelector(selectUserRoles);
  const flows = React.useMemo(() => convertFlowsMapToArray(flowsMap), [flowsMap]);

  return (
    <>
      <Page module={testModule} subModule={testSubModule} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Page.Title>Flows</Page.Title>
        <Page.Subtitle>Manage Flows</Page.Subtitle>
      </Page>
      <Grid container spacing={4} sx={{ mt: 4, mx: 'auto' }}>
        {flows.map((item) => (
          <Grid size="auto" key={item.name} sx={{ width: { xs: '100%', sm: `calc((${APP_CONFIG.containerWidth}px / 4) - 12px)` } }}>
            <FlowGroup {...item} roles={userRoles} module={testModule} subModule={testSubModule} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FlowsPage;
