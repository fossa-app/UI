import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type LoadingButtonProps = {
  loading?: boolean;
  loadingPosition?: 'start' | 'end';
  spinnerSize?: number;
} & ButtonProps;

const LoadingButton: React.FC<React.PropsWithChildren<LoadingButtonProps>> = ({
  loading = false,
  loadingPosition = 'end',
  spinnerSize = 20,
  children,
  disabled,
  ...props
}) => {
  const isStart = loadingPosition === 'start';
  const isEnd = loadingPosition === 'end';

  return (
    <Button
      {...props}
      aria-label="Loading Button"
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
