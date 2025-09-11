module.exports = {
  projectId: "573x12", // Your Cypress Dashboard Project ID
  e2e: {
    // Base configuration
    baseUrl: 'http://planshop.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    
    // Asset folders
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Video and screenshot settings
    video: true,
    videoCompression: 32, // Optimize video size for CI/CD
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    // Viewport settings
    viewportWidth: 1600,
    viewportHeight: 1080,
    
    // Timeout settings
    defaultCommandTimeout: 6000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    
    // Test settings for CI
    watchForFileChanges: false,
    chromeWebSecurity: false,
    
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
        }
      });

      // Screenshot event handler
      on('after:screenshot', (details) => {
        console.log(`Screenshot saved: ${details.path}`);
        return null;
      });

      // Video event handler  
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          console.log(`Video saved: ${results.video}`);
        }
        
        // Log test results summary
        const { stats } = results;
        console.log(`Test Results for ${spec.name}:`);
        console.log(`   Passed: ${stats.passes}`);
        console.log(`   Failed: ${stats.failures}`);
        console.log(`   Pending: ${stats.pending}`);
        console.log(`   Duration: ${stats.duration}ms`);
        
        return null;
      });

      // Browser launch options for CI
      on('before:browser:launch', (browser, launchOptions) => {
        // Chrome/Chromium options
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--allow-running-insecure-content');
          
          // Headless mode optimizations for CI
          if (process.env.CI) {
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-background-timer-throttling');
            launchOptions.args.push('--disable-backgrounding-occluded-windows');
            launchOptions.args.push('--disable-renderer-backgrounding');
          }
        }
        
        return launchOptions;
      });

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
  }
};