import * as React from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import MuiSnackbar, { SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';

type SnackbarProps = {
  open: boolean;
  type: AlertColor;
  message?: string;
  onClose: () => void;
} & MuiSnackbarProps;

const Snackbar: React.FC<SnackbarProps> = ({ open = false, message = '', type, onClose, ...props }) => {
  const onSnackbarClose = (): void => {
    onClose();
  };

  return (
    <MuiSnackbar open={open} autoHideDuration={5000} onClose={onSnackbarClose} {...props}>
      <MuiAlert severity={type}>{message}</MuiAlert>
    </MuiSnackbar>
  );
};

export default Snackbar;
