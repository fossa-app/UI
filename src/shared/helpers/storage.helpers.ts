import { User } from 'oidc-client-ts';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = <T>(key: string) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return {} as T;
  }

  try {
    return JSON.parse(data) as T;
  } catch (error) {
    return {} as T;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const getUserFromLocalStorage = (clientId: string): User => {
  const oidcKey = `oidc.user:${OIDC_INITIAL_CONFIG.authority}:${clientId}`;

  return getFromLocalStorage<User>(oidcKey);
};
