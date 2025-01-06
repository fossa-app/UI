import { User } from 'oidc-client-ts';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';

export const saveToLocalStorage = <T = unknown>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = <T = unknown>(key: string): T | null => {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getUserFromLocalStorage = (clientId: string): User | null => {
  const oidcKey = `oidc.user:${OIDC_INITIAL_CONFIG.authority}:${clientId}`;

  return getFromLocalStorage<User>(oidcKey);
};
