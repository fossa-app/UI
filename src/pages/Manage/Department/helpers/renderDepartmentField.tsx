import React from 'react';
import Typography from '@mui/material/Typography';
import { Department } from 'shared/types';
import { APP_CONFIG } from 'shared/constants';

interface RenderDepartmentFieldParams {
  department: Department;
  field: keyof Department;
  tooltip?: string;
  onAction?: (department: Department) => void;
}

export const renderDepartmentField = ({ department, field, onAction }: RenderDepartmentFieldParams) => {
  const value = department[field];
  const fieldValue = value ? `${value}` : APP_CONFIG.emptyValue;

  return (
    <Typography
      variant="body1"
      sx={{
        width: 'fit-content',
        cursor: onAction ? 'pointer' : 'text',
      }}
      onClick={() => onAction?.(department)}
    >
      {fieldValue}
    </Typography>
  );
};
