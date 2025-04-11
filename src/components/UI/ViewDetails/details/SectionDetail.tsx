import * as React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ViewDetailFieldProps } from '../view-details.model';
import { useViewDetailsContext } from '../ViewDetailsContext';

const SectionDetail = <T,>({ ...props }: ViewDetailFieldProps<T>) => {
  const { module, subModule } = useViewDetailsContext();

  return (
    <>
      <Typography
        data-cy={`${module}-${subModule}-view-details-section-${props.name}`}
        variant="h6"
        color="textSecondary"
        sx={{ fontWeight: 500 }}
        {...props}
      >
        {props.label}
      </Typography>
      <Divider />
    </>
  );
};

export default SectionDetail;
