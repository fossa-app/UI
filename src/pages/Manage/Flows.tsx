import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { FLOWS } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';
import FlowItem from 'components/UI/FlowItem';
import Page, { PageSubtitle, PageTitle } from 'components/UI/Page';

const testModule = Module.manage;
const testSubModule = SubModule.flows;

const FlowsPage: React.FC = () => {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <>
      <Page module={testModule} subModule={testSubModule} sx={{ display: 'flex', flexDirection: 'column' }}>
        <PageTitle>Flows</PageTitle>
        <PageSubtitle>Manage Flows</PageSubtitle>
      </Page>
      <Grid container spacing={4} sx={{ justifyContent: 'center', mt: 4 }}>
        {FLOWS.map((item) => (
          <Grid size={{ xs: 6, sm: 2 }} key={item.name}>
            <FlowItem
              {...item}
              data-cy={getTestSelectorByModule(testModule, testSubModule, `flow-item-${item.name}`)}
              itemSx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${color}`,
                aspectRatio: '1 / 1',
                width: '100%',
              }}
              iconSx={{ color, justifyContent: 'center' }}
              textSx={{ color, flex: 0, m: 0 }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FlowsPage;
