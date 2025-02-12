import * as React from 'react';
import Typography from '@mui/material/Typography';
import { ViewDetailProps } from '../view-details.model';

const SectionDetail = <T,>({ module, subModule, ...props }: ViewDetailProps<T>) => {
  return (
    <Typography
      data-cy={`${module}-${subModule}-view-details-section-${props.name}`}
      variant="h6"
      color="textSecondary"
      sx={{ fontWeight: 500 }}
      {...props}
    >
      {props.label}
    </Typography>
  );
};

export default SectionDetail;
