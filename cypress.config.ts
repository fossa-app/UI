import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  retries: 3,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://we.dev.localhost:4211',
    env: {
      serverBaseUrl: 'http://we.dev.localhost:5210/api/1',
      fusionAuthBaseUrl: 'http://localhost:9011',
    },
  },
  hosts: {
    'we.dev.localhost': '127.0.0.1',
    localhost: '127.0.0.1',
  },
});
