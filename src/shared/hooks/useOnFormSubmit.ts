import React from 'react';

export const useOnFormSubmitEffect = (updateStatus: string, formSubmitted: boolean, onSuccess: () => void) => {
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      onSuccess();
    }
  }, [updateStatus, formSubmitted, onSuccess]);
};
