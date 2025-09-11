const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base configuration
    baseUrl: 'http://planshop.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',
    fixturesFolder: 'cypress/fixtures',
    
    video: true,
    videoCompression: 32, 
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    viewportWidth: 1600,
    viewportHeight: 1080,
    
    defaultCommandTimeout: 6000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    
    // Test settings
    watchForFileChanges: false, // Disable for CI
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    
    // Retry settings for CI stability
    retries: {
      runMode: 2, // Retry failed tests in CI
      openMode: 0  // No retries in interactive mode
    },
    
    // Environment variables
    env: {
      // Custom timeouts
      SHORT_TIMEOUT: 3000,
      MEDIUM_TIMEOUT: 10000,
      LONG_TIMEOUT: 30000,
      
      // Test data
      VALID_EMAIL: 'test@planshop.com',
      VALID_PASSWORD: 'password123',
      
      // Feature flags
      RECORD_VIDEO: true,
      TAKE_SCREENSHOTS: true
    },
    
    setupNodeEvents(on, config) {
      // Task definitions
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        logTable(data) {
          console.table(data);
          return null;
        },
        
        cleanupDatabase() {
          console.log('Database cleanup completed');
          return null;
        }
      });

      on('after:screenshot', (details) => {
        console.log(`📸 Screenshot saved: ${details.path}`);
        return null;
      });

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          console.log(`🎥 Video saved: ${results.video}`);
        }
        
        const { stats } = results;
        console.log(`Test Results for ${spec.name}:`);
        console.log(`Passed: ${stats.passes}`);
        console.log(`Failed: ${stats.failures}`);
        console.log(`Pending: ${stats.pending}`);
        console.log(`Duration: ${stats.duration}ms`);
        
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
        
        if (browser.family === 'firefox') {
          launchOptions.preferences['media.navigator.permission.disabled'] = true;
        }
        
        return launchOptions;
      });

      // Environment-specific configuration
      const environmentName = config.env.ENVIRONMENT || 'development';
      
      switch (environmentName) {
        case 'production':
          config.baseUrl = 'https://planshop.com/';
          config.defaultCommandTimeout = 10000;
          break;
        case 'staging':
          config.baseUrl = 'https://staging.planshop.com/';
          config.defaultCommandTimeout = 8000;
          break;
        case 'development':
        default:
          config.baseUrl = 'http://planshop.com/';
          config.defaultCommandTimeout = 6000;
          break;
      }

      // CI-specific optimizations
      if (process.env.CI) {
        config.video = process.env.CYPRESS_video !== 'false';
        config.screenshotOnRunFailure = true;
        config.watchForFileChanges = false;
        
        // Reduce video quality in CI to save space
        config.videoCompression = 15;
      }

      return config;
    }
  },

  // Component testing (if needed in future)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  }
});