import axios, { CreateAxiosDefaults } from 'axios';
import { APP_CONFIG, ENDPOINTS } from 'shared/constants';
import { getBackendOrigin } from 'shared/helpers';

const origin = window.location.origin;
const beOrigin = getBackendOrigin(origin);

const defaultConfigs: CreateAxiosDefaults = {
  baseURL: `${beOrigin}/${ENDPOINTS.base}`,
  timeout: APP_CONFIG.httpTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
  // BE sends big numbers in the response, parsing manually in AxiosInterceptor
  transformResponse: [(response) => response],
};

const instance = axios.create(defaultConfigs);

export * from 'axios';
export default instance;
