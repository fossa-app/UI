import * as React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Branch, Module, SubModule } from 'shared/models';
import { getNestedValue } from 'shared/helpers';
import { APP_CONFIG } from 'shared/constants';

interface RenderBranchFieldParams {
  module: Module;
  subModule: SubModule;
  field: keyof Branch | string;
  label?: string;
  branch?: Branch;
  tooltip?: string;
  onAction?: (branch?: Branch) => void;
}

export const renderBranchField = ({ module, subModule, branch, field, label, tooltip, onAction }: RenderBranchFieldParams) => {
  const value = getNestedValue(branch, field);
  const fieldValue = value ? `${value}` : APP_CONFIG.emptyValue;
  const isValid = (branch?.isValid && value) || !value;

  return (
    <>
      {label && (
        <Typography data-cy={`${module}-${subModule}-view-details-label-${field}`} variant="body2" color="textSecondary">
          {label}
        </Typography>
      )}
      <Tooltip title={!isValid && tooltip ? tooltip : ''}>
        <Typography
          data-cy={`${module}-${subModule}-view-details-value-${field}`}
          variant="body1"
          {...(!isValid && { 'data-invalid': true })}
          sx={{
            color: isValid ? 'inherit' : (theme) => theme.palette.error.main,
            width: 'fit-content',
            cursor: onAction ? 'pointer' : 'text',
          }}
          onClick={() => onAction?.(branch)}
        >
          {fieldValue}
        </Typography>
      </Tooltip>
    </>
  );
};
