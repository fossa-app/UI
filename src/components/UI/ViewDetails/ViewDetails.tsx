import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Module, SubModule } from 'shared/models';
import LinearLoader from '../LinearLoader';
import ViewDetailsContext from './ViewDetailsContext';
import ViewDetailsHeader from './ViewDetailsHeader';
import ViewDetailsContent from './ViewDetailsContent';
import ViewDetailsActions from './ViewDetailsActions';

type ViewDetailsProps = React.PropsWithChildren<{
  module: Module;
  subModule: SubModule;
  loading?: boolean;
}>;

const ViewDetails = ({ module, subModule, loading = false, children }: ViewDetailsProps) => {
  return (
    <ViewDetailsContext.Provider value={{ module, subModule, loading }}>
      <Paper
        data-cy={`${module}-${subModule}-view-details`}
        elevation={3}
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative' }}
      >
        {children}
        <LinearLoader open={loading} />
      </Paper>
    </ViewDetailsContext.Provider>
  );
};

ViewDetails.Header = ViewDetailsHeader;
ViewDetails.Content = ViewDetailsContent;
ViewDetails.Actions = ViewDetailsActions;

export default ViewDetails;
