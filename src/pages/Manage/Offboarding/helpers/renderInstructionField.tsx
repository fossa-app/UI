import React from 'react';
import Typography from '@mui/material/Typography';
import { Module, SubModule } from 'shared/models';

interface RenderInstructionFieldParams {
  module: Module;
  subModule: SubModule;
  field: string;
  text: string;
  color: 'success' | 'error';
}

export const renderInstructionField = ({ module, subModule, field, text, color }: RenderInstructionFieldParams) => {
  return (
    <Typography variant="subtitle2" data-cy={`${module}-${subModule}-form-field-value-${field}`} color={color}>
      {text}
    </Typography>
  );
};
