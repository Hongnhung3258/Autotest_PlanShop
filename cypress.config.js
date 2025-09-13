module.exports = {
  projectId: "573x12",
  e2e: {
    baseUrl: 'http://planshop.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    viewportWidth: 1920,
    viewportHeight: 1080,
    
    defaultCommandTimeout: 6000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    
    watchForFileChanges: false,
    chromeWebSecurity: false,
    
    retries: {
      runMode: 2, 
      openMode: 0  
    },
    
    env: {
      SHORT_TIMEOUT: 3000,
      MEDIUM_TIMEOUT: 10000,
      LONG_TIMEOUT: 30000,
      
      RECORD_VIDEO: true,
      TAKE_SCREENSHOTS: true
    },
    
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        logTable(data) {
          console.table(data);
          return null;
        }
      });

      on('after:screenshot', (details) => {
        console.log(`Screenshot saved: ${details.path}`);
        return null;
      });

      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        logTable(data) {
          console.table(data);
          return null;
        },
        
        failed(message) {
          console.log('Test Failed:', message);
          return null;
        }
      });

      on('after:run', (results) => {
        if (results.totalFailed > 0) {
          console.log(`Total Failed Tests: ${results.totalFailed}`);
          console.log(`Screenshots saved in: cypress/screenshots/`);
        }
        return null;
      });

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          console.log(`Video saved: ${results.video}`);
        }
        
        const { stats } = results;
        console.log(`Test Results for ${spec.name}:`);
        console.log(`  Passed: ${stats.passes}`);
        console.log(`  Failed: ${stats.failures}`);
        console.log(`  Pending: ${stats.pending}`);
        console.log(`  Duration: ${stats.duration}ms`);

        return null;
      });

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--allow-running-insecure-content');
          
          if (process.env.CI) {
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-background-timer-throttling');
            launchOptions.args.push('--disable-backgrounding-occluded-windows');
            launchOptions.args.push('--disable-renderer-backgrounding');
          }
        }
        
        return launchOptions;
      });

      if (process.env.CI) {
        config.video = process.env.CYPRESS_video !== 'false';
        config.screenshotOnRunFailure = true;
        config.watchForFileChanges = false;
        
        config.videoCompression = 15;
      }

      return config;
    }
  }
};