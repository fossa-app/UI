import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Module, SubModule } from 'shared/types';
import CopyToClipboard from 'components/UI/CopyToClipboard';

interface CopyableFieldParams {
  module: Module;
  subModule: SubModule;
  text: string;
  label?: string;
}

export const renderCopyableField = ({ module, subModule, label, text }: CopyableFieldParams) => (
  <>
    {label && (
      <Typography data-cy={`${module}-${subModule}-copyable-field-label`} variant="body2" color="textSecondary">
        {label}
      </Typography>
    )}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body1" data-cy={`${module}-${subModule}-copyable-field-value`}>
        {text}
      </Typography>
      <CopyToClipboard data-cy={`${module}-${subModule}-copyable-field-button`} text={text} />
    </Box>
  </>
);
