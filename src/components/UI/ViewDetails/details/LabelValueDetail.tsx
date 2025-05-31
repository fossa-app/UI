import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getNestedValue } from 'shared/helpers';
import { APP_CONFIG } from 'shared/constants';
import { ViewDetailFieldProps } from '../view-details.model';
import { useViewDetailsContext } from '../ViewDetailsContext';

const LabelValueDetail = <T,>({ values, ...props }: { values: T } & ViewDetailFieldProps<T>) => {
  const fieldValue = getNestedValue<T>(values, props.name);
  const { module, subModule } = useViewDetailsContext();

  return (
    <>
      <Typography data-cy={`${module}-${subModule}-view-details-label-${props.name}`} variant="body2" color="textSecondary">
        {props.label}
      </Typography>
      <Box data-cy={`${module}-${subModule}-view-details-value-${props.name}`}>
        {/* TODO: move this part to the view detail content level like in the form content */}
        {props.renderDetailField ? (
          props.renderDetailField(values)
        ) : (
          <Typography variant="body1">{fieldValue ? String(fieldValue) : APP_CONFIG.emptyValue}</Typography>
        )}
      </Box>
    </>
  );
};

export default LabelValueDetail;
