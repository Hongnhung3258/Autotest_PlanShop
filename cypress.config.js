module.exports = {
  e2e: {
    baseUrl: 'http://planshop.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    trashAssetsBeforeRuns: true,
    defaultCommandTimeout: 6000,
    screenshotOnRunFailure: true, // Bật screenshot cho mọi lỗi
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      on('after:screenshot', (details) => {
        console.log(`Screenshot saved: ${details.path}`);
        return null;
      });
    }
  }
};