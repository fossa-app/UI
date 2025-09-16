import React from 'react';
import Typography from '@mui/material/Typography';
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
      <Typography data-cy={`${module}-${subModule}-view-details-value-${props.name}`} variant="body1">
        {fieldValue ? String(fieldValue) : APP_CONFIG.emptyValue}
      </Typography>
    </>
  );
};

export default LabelValueDetail;
