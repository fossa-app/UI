import React from 'react';
import Typography from '@mui/material/Typography';
import { Module, SubModule } from 'shared/types';
import { daysUntil } from 'shared/helpers';

interface RenderValidForFieldParams {
  module: Module;
  subModule: SubModule;
  field: string;
  label: string;
  validToDateString?: string;
}

const ERROR_THRESHOLD = 0;
const WARNING_THRESHOLD = 30;

export const renderValidForField = ({ module, subModule, field, label, validToDateString }: RenderValidForFieldParams) => {
  const validForDays = daysUntil(validToDateString);
  const isExpiring = validForDays < WARNING_THRESHOLD;
  const isExpired = validForDays === ERROR_THRESHOLD;
  const color = isExpired ? 'error' : isExpiring ? 'warning' : 'textPrimary';
  const validForDaysText = validForDays > 0 ? `(${validForDays} days left)` : '(expired)';

  return (
    <>
      <Typography data-cy={`${module}-${subModule}-view-details-label-${field}`} variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography data-cy={`${module}-${subModule}-view-details-value-${field}`} variant="body1" color={color}>
        {validToDateString} {validForDaysText}
      </Typography>
    </>
  );
};
