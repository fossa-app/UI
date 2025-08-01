import * as React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from 'components/UI/LoadingButton';
import { ICONS } from 'shared/constants';
import { FormActionProps, FormActionType } from '../form.model';
import { useFormContext } from '../FormContext';

const FormAction: React.FC<FormActionProps> = (props: FormActionProps) => {
  const { module, subModule } = useFormContext();
  const { actionType, endIcon, ...buttonProps } = props;
  const Icon = endIcon ? ICONS[endIcon as keyof typeof ICONS] : null;
  const ariaLabel = props['aria-label'];

  switch (props.actionType) {
    case FormActionType.button:
      return (
        <Button {...buttonProps} data-cy={`${module}-${subModule}-form-${props.name}-button`} aria-label={ariaLabel}>
          {props.label}
        </Button>
      );
    case FormActionType.loadingButton:
      return (
        <LoadingButton
          {...buttonProps}
          data-cy={`${module}-${subModule}-form-${props.name}-button`}
          loading={props.loading}
          endIcon={Icon ? <Icon /> : null}
          aria-label={ariaLabel}
        >
          {props.label}
        </LoadingButton>
      );
    default:
      throw new Error('Invalid Form Action Type');
  }
};

export default FormAction;
