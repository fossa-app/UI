import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { clearMessages, selectMessage } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';
import Snackbar from 'components/UI/Snackbar';

const MessageLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector(selectMessage);
  const type = error ? 'error' : 'success';
  const testSelector = getTestSelectorByModule(Module.shared, SubModule.snackbar, type);

  const handleSnackbarClose = () => {
    dispatch(clearMessages());
  };

  if (!error && !success) {
    return null;
  }

  return (
    <Snackbar
      data-cy={testSelector}
      type={type}
      open={!!error || !!success}
      message={error ? error.title : success}
      onClose={handleSnackbarClose}
    />
  );
};

export default MessageLayout;
