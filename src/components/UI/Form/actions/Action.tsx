import * as React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from 'components/UI/LoadingButton';
import { ICONS } from 'shared/constants';
import { ActionProps, ActionType } from '../form.model';
import { useFormContext } from '../FormContext';

const Action = (props: ActionProps) => {
  const { module, subModule } = useFormContext();
  const { actionType, endIcon, ...buttonProps } = props;
  const Icon = endIcon ? ICONS[endIcon as keyof typeof ICONS] : null;
  const ariaLabel = props['aria-label'];

  switch (props?.actionType) {
    case ActionType.button:
      return (
        <Button {...buttonProps} data-cy={`${module}-${subModule}-form-cancel-button`} aria-label={ariaLabel}>
          {props.label}
        </Button>
      );
    case ActionType.loadingButton:
      return (
        <LoadingButton
          {...buttonProps}
          data-cy={`${module}-${subModule}-form-action-button`}
          loading={props.loading}
          endIcon={Icon ? <Icon /> : null}
          aria-label={ariaLabel}
        >
          {props.label}
        </LoadingButton>
      );
    default:
      throw new Error('Invalid Action Type');
  }
};

export default Action;
