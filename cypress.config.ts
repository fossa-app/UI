import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://we.dev.localhost:4211',
  },
  hosts: {
    'we.dev.localhost': '127.0.0.1',
  },
});
