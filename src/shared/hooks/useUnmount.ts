import React from 'react';

export const useUnmount = (callback: () => void): void => {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
};
