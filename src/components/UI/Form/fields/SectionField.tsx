import * as React from 'react';
import Typography from '@mui/material/Typography';
import { SectionFieldProps } from '../form.model';

const SectionField: React.FC<SectionFieldProps> = ({ module, subModule, ...props }) => {
  return (
    <Typography
      data-cy={`${module}-${subModule}-form-section-field-${props.name}`}
      variant="h6"
      color="textSecondary"
      sx={{ fontWeight: 500 }}
      {...props}
    >
      {props.label}
    </Typography>
  );
};

export default SectionField;
