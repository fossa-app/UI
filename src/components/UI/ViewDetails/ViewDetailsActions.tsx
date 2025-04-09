import * as React from 'react';
import AccordionActions, { AccordionActionsProps } from '@mui/material/AccordionActions';
import { useViewDetailsContext } from './ViewDetailsContext';
import { ViewDetailActionProps } from './view-details.model';
import ViewDetailAction from './actions';

type WithActions = {
  actions: ViewDetailActionProps[];
  children?: never;
};

type WithChildren = {
  children: React.ReactNode;
  actions?: never;
};

type ViewDetailsActionsProps = (WithActions | WithChildren) & AccordionActionsProps;

const ViewDetailsActions: React.FC<ViewDetailsActionsProps> = ({ actions, children, ...props }) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsActions must be used within a ViewDetails component using ViewDetailsContext.');
  }

  if (actions?.length && children) {
    throw new Error('ViewDetailsActions cannot accept both actions and children. Please provide only one.');
  }

  return (
    <AccordionActions sx={{ display: 'flex', justifyContent: 'flex-end' }} {...props}>
      {actions ? actions.map((action) => <ViewDetailAction key={action.name} {...action} />) : children}
    </AccordionActions>
  );
};

export default ViewDetailsActions;
