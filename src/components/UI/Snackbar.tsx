import * as React from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import MuiSnackbar, { SnackbarProps as MuiSnackbarProps, SnackbarCloseReason } from '@mui/material/Snackbar';
import { APP_CONFIG } from 'shared/constants';

type SnackbarProps = {
  type: AlertColor;
  message: string;
  onClose: () => void;
} & MuiSnackbarProps;

const Snackbar: React.FC<SnackbarProps> = ({ open = false, message = '', type, onClose, ...props }) => {
  const onSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  return (
    <MuiSnackbar open={open} autoHideDuration={APP_CONFIG.snackbarAutoHideDuration} onClose={onSnackbarClose} {...props}>
      <MuiAlert severity={type} onClose={onSnackbarClose}>
        {message}
      </MuiAlert>
    </MuiSnackbar>
  );
};

export default Snackbar;
