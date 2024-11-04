import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { clearError, selectError } from 'store/features';
import Snackbar from 'components/UI/Snackbar';

const ErrorLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(selectError);

  const handleSnackbarClose = () => {
    dispatch(clearError());
  };

  if (!error) {
    return null;
  }

  return <Snackbar type="error" open={!!error} message={error.title} onClose={handleSnackbarClose} />;
};

export default ErrorLayout;
