import React from 'react';
import { APP_CONFIG } from 'shared/constants';

export const useDebounce = <T>(value: T, delay = APP_CONFIG.searchDebounceTime): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
