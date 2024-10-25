import axios, { CreateAxiosDefaults } from 'axios';
import { APP_CONFIG, URLS } from 'shared/constants';
import { getBackendOrigin } from 'shared/helpers';

const origin = window.location.origin;
const beOrigin = getBackendOrigin(origin);

const defaultConfigs: CreateAxiosDefaults = {
  baseURL: `${beOrigin}/${URLS.base}`,
  timeout: APP_CONFIG.httpTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
};

const instance = axios.create(defaultConfigs);

export * from 'axios';
export default instance;
