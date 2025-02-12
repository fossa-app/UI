import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNestedValue } from 'shared/helpers';
import { ViewDetailProps } from '../view-details.model';

const LabelValueDetail = <T,>({ module, subModule, values, ...props }: { values: T } & ViewDetailProps<T>) => {
  const fieldValue = getNestedValue<T>(values, props.name);

  return (
    <>
      <Typography data-cy={`${module}-${subModule}-view-details-label-${props.name}`} variant="body2" color="textSecondary">
        {props.label}
      </Typography>
      <Box data-cy={`${module}-${subModule}-view-details-value-${props.name}`}>
        {props.renderDetailField ? (
          props.renderDetailField(values)
        ) : (
          <Typography variant="body1">{fieldValue ? String(fieldValue) : '-'}</Typography>
        )}
      </Box>
    </>
  );
};

export default LabelValueDetail;
