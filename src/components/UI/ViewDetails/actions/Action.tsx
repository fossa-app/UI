import React from 'react';
import Button from '@mui/material/Button';
import { ACTION_BUTTON_STYLES } from 'shared/constants';
import { ViewDetailActionProps, ViewDetailActionType } from '../view-details.model';
import { useViewDetailsContext } from '../ViewDetailsContext';

const ViewDetailAction: React.FC<ViewDetailActionProps> = (props: ViewDetailActionProps) => {
  const { module, subModule } = useViewDetailsContext();
  const { actionType, endIcon, ...buttonProps } = props;
  const ariaLabel = props['aria-label'];

  switch (props?.actionType) {
    case ViewDetailActionType.button:
      return (
        <Button {...buttonProps} data-cy={`${module}-${subModule}-view-action-button`} aria-label={ariaLabel} sx={ACTION_BUTTON_STYLES}>
          {props.label}
        </Button>
      );
    default:
      throw new Error('Invalid View Detail Action Type');
  }
};

export default ViewDetailAction;
