// Configuration Playwright de base
// Pour lancer : npx playwright test

module.exports = {
  testDir: './tests-e2e',
  timeout: 10000,
  retries: 0,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
};
