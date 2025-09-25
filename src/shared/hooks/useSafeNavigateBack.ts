import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';

export const useSafeNavigateBack = (fallback?: string) => {
  const navigate = useNavigate();

  return React.useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallback) {
      navigate(fallback, { replace: true });
    } else {
      navigate(ROUTES.flows.path, { replace: true });
    }
  }, [navigate, fallback]);
};
