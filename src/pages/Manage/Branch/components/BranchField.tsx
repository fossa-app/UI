import * as React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Branch } from 'shared/models';
import { getNestedValue } from 'shared/helpers';

interface RenderBranchFieldProps {
  branch: Branch;
  field: keyof Branch | string;
  tooltip?: string;
  onAction?: (branch: Branch) => void;
}

export const renderBranchField = ({ branch, field, tooltip, onAction }: RenderBranchFieldProps) => {
  const value = getNestedValue(branch, field);
  const fieldValue = value ? `${value}` : '-';
  const isValid = (branch.isValid && value) || !value;

  return (
    <Tooltip title={!isValid && tooltip ? tooltip : ''}>
      <Typography
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
  );
};
