import React from 'react';
import { useFormContext as reactHookFormContext, useWatch } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { LabelValueFieldProps } from '../form.model';
import { useFormContext } from '../FormContext';

const LabelValueField: React.FC<LabelValueFieldProps> = ({ name, ...props }) => {
  const { register, control } = reactHookFormContext();
  const { module, subModule } = useFormContext();
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
