import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export type LoadingButtonProps = {
  loading?: boolean;
  spinnerSize?: number;
} & ButtonProps;

const LoadingButton: React.FC<React.PropsWithChildren<LoadingButtonProps>> = ({
  loading = false,
  spinnerSize = 20,
  children,
  disabled,
  ...props
}) => {
  const isStart = props.loadingPosition === 'start';
  const isEnd = props.loadingPosition === 'end';

  return (
    <Button
      {...props}
      variant="contained"
      disabled={disabled || loading}
      startIcon={
        isStart && loading ? <CircularProgress data-cy="loading-button-start-icon" size={spinnerSize} color="inherit" /> : props.startIcon
      }
      endIcon={isEnd && loading ? <CircularProgress data-cy="loading-button-end-icon" size={spinnerSize} color="inherit" /> : props.endIcon}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
