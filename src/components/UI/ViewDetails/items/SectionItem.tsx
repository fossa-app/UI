import * as React from 'react';
import Typography from '@mui/material/Typography';
import { ViewItemProps } from '../view-details.model';

const SectionItem = <T,>({ module, subModule, ...props }: ViewItemProps<T>) => {
  return (
    <Typography
      data-cy={`${module}-${subModule}-view-details-section-${props.name}`}
      variant="h6"
      color="textSecondary"
      sx={{ mt: 4, fontWeight: 500 }}
    >
      {props.label}
    </Typography>
  );
};

export default SectionItem;
