import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { LabelValueFieldProps } from '../form.model';

const LabelValueField: React.FC<LabelValueFieldProps> = ({ module, subModule, name, ...props }) => {
  const { register, control } = useFormContext();
  const value = useWatch({ control, name });

  return (
    <>
      <Typography data-cy={`${module}-${subModule}-form-field-label-${name}`} variant="body2" color="textSecondary">
        {props.label}
      </Typography>
      <Typography data-cy={`${module}-${subModule}-form-field-value-${name}`} variant="body1" {...register(name, { ...props.rules })}>
        {value}
      </Typography>
    </>
  );
};

export default LabelValueField;
