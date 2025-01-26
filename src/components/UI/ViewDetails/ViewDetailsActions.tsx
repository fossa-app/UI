import * as React from 'react';
import AccordionActions, { AccordionActionsProps } from '@mui/material/AccordionActions';
import { useViewDetailsContext } from './ViewDetailsContext';

type ViewDetailsActionsProps = AccordionActionsProps;

const ViewDetailsActions: React.FC<React.PropsWithChildren<ViewDetailsActionsProps>> = ({ children, ...props }) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsActions must be used within a ViewDetails component using ViewDetailsContext.');
  }

  return (
    <AccordionActions sx={{ display: 'flex', justifyContent: 'flex-end' }} {...props}>
      {children}
    </AccordionActions>
  );
};

export default ViewDetailsActions;
