import * as React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import { Module, SubModule } from 'shared/models';
import LoadingButton from 'components/UI/LoadingButton';

type DeleteProfileDialogProps = {
  module: Module;
  subModule: SubModule;
  onDelete: () => void;
} & DialogProps;

const DeleteProfileDialog: React.FC<DeleteProfileDialogProps> = ({ module, subModule, onDelete, ...props }) => {
  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (props.onClose) {
      props.onClose(event, reason);
    }
  };

  return (
    <Dialog
      {...props}
      fullWidth
      data-cy={`${module}-${subModule}-dialog`}
      maxWidth="sm"
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onDelete();
          },
        },
      }}
    >
      <DialogTitle data-cy={`${module}-${subModule}-dialog-title`}>Delete Profile</DialogTitle>
      <DialogContent>
        <DialogContentText data-cy={`${module}-${subModule}-dialog-content-text`}>
          Once you delete your profile, there is no going back. Please be certain.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          data-cy={`${module}-${subModule}-dialog-cancel-button`}
          aria-label="Cancel"
          variant="text"
          color="secondary"
          onClick={() => handleClose({}, 'backdropClick')}
        >
          Cancel
        </Button>
        <LoadingButton
          data-cy={`${module}-${subModule}-dialog-action-button`}
          color="error"
          type="submit"
          loadingPosition="end"
          endIcon={<WarningIcon />}
        >
          Acknowledge
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProfileDialog;
