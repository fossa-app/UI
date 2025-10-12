import React from 'react';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import { Module, SubModule } from 'shared/types';
import LinearLoader from '../LinearLoader';
import ViewDetailsContext from './ViewDetailsContext';
import ViewDetailsHeader from './ViewDetailsHeader';
import ViewDetailsContent from './ViewDetailsContent';
import ViewDetailsActions from './ViewDetailsActions';

type ViewDetailsProps = React.PropsWithChildren<
  {
    module: Module;
    subModule: SubModule;
    loading?: boolean;
    defaultExpanded?: boolean;
  } & AccordionProps
>;

const ViewDetails = ({ module, subModule, loading = false, defaultExpanded = true, children, ...props }: ViewDetailsProps) => {
  return (
    <ViewDetailsContext.Provider value={{ module, subModule, loading }}>
      <Accordion
        square
        disableGutters
        data-cy={`${module}-${subModule}-view-details`}
        elevation={4}
        defaultExpanded={defaultExpanded}
        sx={{ position: 'relative' }}
        {...props}
      >
        {children}
        <LinearLoader open={loading} />
      </Accordion>
    </ViewDetailsContext.Provider>
  );
};

ViewDetails.Header = ViewDetailsHeader;
ViewDetails.Content = ViewDetailsContent;
ViewDetails.Actions = ViewDetailsActions;

export default ViewDetails;
