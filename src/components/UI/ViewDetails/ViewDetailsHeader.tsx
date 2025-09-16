import React from 'react';
import AccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useViewDetailsContext } from './ViewDetailsContext';

type ViewDetailsHeaderProps = {
  expandIconSxProps?: SxProps<Theme>;
} & AccordionSummaryProps;

const ViewDetailsHeader: React.FC<React.PropsWithChildren<ViewDetailsHeaderProps>> = ({ children, expandIconSxProps, ...props }) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsHeader must be used within a ViewDetails component using ViewDetailsContext.');
  }

  const { module, subModule } = useViewDetailsContext();

  return (
    <AccordionSummary
      data-cy={`${module}-${subModule}-view-details-header`}
      id={`${module}-${subModule}-view-details-header`}
      aria-controls={`${module}-${subModule}-view-details-content`}
      expandIcon={<ExpandMoreIcon sx={expandIconSxProps} />}
      {...props}
    >
      <Typography variant="h6">{children}</Typography>
    </AccordionSummary>
  );
};

export default ViewDetailsHeader;
