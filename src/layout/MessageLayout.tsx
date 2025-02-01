import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { clearMessages, selectMessage } from 'store/features';
import Snackbar from 'components/UI/Snackbar';

const MessageLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector(selectMessage);

  const handleSnackbarClose = () => {
    dispatch(clearMessages());
  };

  if (!error && !success) {
    return null;
  }

  return (
    <Snackbar
      data-cy={error ? 'error-snackbar' : 'success-snackbar'}
      type={error ? 'error' : 'success'}
      open={!!error || !!success}
      message={error ? error.title : success}
      onClose={handleSnackbarClose}
    />
  );
};

export default MessageLayout;
