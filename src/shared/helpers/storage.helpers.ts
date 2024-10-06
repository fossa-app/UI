import { User } from 'oidc-client-ts';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';

export const saveToLocalStorage = <T>(key: string, value: T) => {
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

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getUserFromLocalStorage = (clientId: string): User => {
  const oidcKey = `oidc.user:${OIDC_INITIAL_CONFIG.authority}:${clientId}`;

  return getFromLocalStorage<User>(oidcKey);
};

export const decodeJwt = (token?: string): Record<string, any> | null => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    const decodedPayload = atob(payload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
