import * as React from 'react';
import Typography from '@mui/material/Typography';
import { SectionFieldProps } from '../form.model';

const SectionField: React.FC<SectionFieldProps> = ({ module, subModule, name, ...props }) => {
  return (
    <Typography
      data-cy={`${module}-${subModule}-section-field-${name}`}
      variant="h6"
      color="textSecondary"
      sx={{ mt: 4, fontWeight: 500 }}
      {...props}
    >
      {props.label}
    </Typography>
  );
};

export default SectionField;
