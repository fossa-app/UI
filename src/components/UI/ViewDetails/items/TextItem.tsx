import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNestedValue } from 'shared/helpers';
import { ViewItemProps } from '../view-details.model';

const TextItem = <T,>({ module, subModule, values, ...props }: { values: T } & ViewItemProps<T>) => {
  const fieldValue = getNestedValue(values, props.name) as T;

  return (
    <>
      <Typography data-cy={`${module}-${subModule}-view-details-item-label-${props.name}`} variant="body2" color="textSecondary">
        {props.label}
      </Typography>
      <Box data-cy={`${module}-${subModule}-view-details-item-value-${props.name}`}>
        {props.renderDetailField ? (
          props.renderDetailField(values)
        ) : (
          <Typography variant="body1">{fieldValue ? String(fieldValue) : '-'}</Typography>
        )}
      </Box>
    </>
  );
};

export default TextItem;
