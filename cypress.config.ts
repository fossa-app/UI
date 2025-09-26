import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  retries: 2,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://we.dev.localhost:4211',
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      serverBaseUrl: 'http://we.dev.localhost:5210/api/1',
      fusionAuthBaseUrl: 'http://localhost:9011',
    },
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--reduce-motion');
        }
        return launchOptions;
      });
    },
  },
  hosts: {
    'we.dev.localhost': '127.0.0.1',
    localhost: '127.0.0.1',
  },
});
