module.exports = {
  projectId: "xnn6up",

  e2e: {
    // Dynamic baseUrl - ưu tiên environment variables
    baseUrl: process.env.CYPRESS_baseUrl || process.env.BASE_URL || 'http://planshop.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Video settings - tối ưu cho CI
    video: true,
    videoCompression: process.env.CI ? 15 : 32, // Nén nhiều hơn trong CI
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    viewportWidth: 1920,
    viewportHeight: 1080,
    
    // Timeouts - tăng cho network conditions khác nhau
    defaultCommandTimeout: process.env.CI ? 8000 : 6000, // CI có thể chậm hơn
    requestTimeout: 15000,        // Tăng từ 10000
    responseTimeout: 30000,
    pageLoadTimeout: 45000,       // Tăng từ 30000 cho CI
    
    watchForFileChanges: false,
    chromeWebSecurity: false,
    
    experimentalRunAllSpecs: true,

    // Reporter config - cải thiện cho CI
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
      // Thêm options cho CI
      reportTitle: 'PlanShop E2E Test Results',
      reportPageTitle: 'Cypress Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false
    },
    
    // Retry logic - cải thiện cho CI
    retries: {
      runMode: process.env.CI ? 2 : 2,  // 2 lần trong CI, 1 lần local
      openMode: 0
    },
    
    env: {
      SHORT_TIMEOUT: 3000,
      MEDIUM_TIMEOUT: 10000,
      LONG_TIMEOUT: 30000,
      RECORD_VIDEO: true,
      TAKE_SCREENSHOTS: true,
      
      // Thêm environment indicators
      CI_MODE: process.env.CI || false,
      BROWSER_NAME: process.env.CYPRESS_BROWSER || 'chrome'
    },
    
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      
      on('task', {
        log(message) {
          console.log(`[${new Date().toISOString()}] ${message}`);
          return null;
        },
        
        logTable(data) {
          console.table(data);
          return null;
        },
        
        failed(message) {
          console.log(`[FAILED] ${message}`);
          return null;
        },

        // Thêm task cho environment info
        getEnvInfo() {
          return {
            nodeVersion: process.version,
            platform: process.platform,
            cypressVersion: config.version,
            baseUrl: config.baseUrl,
            browser: process.env.CYPRESS_BROWSER || 'chrome',
            ci: !!process.env.CI
          };
        }
      });

      on('after:screenshot', (details) => {
        console.log(`Screenshot saved: ${details.path}`);
        return null;
      });

      on('after:run', (results) => {
        console.log('\n' + '='.repeat(60));
        console.log('CYPRESS TEST RESULTS SUMMARY');
        console.log('='.repeat(60));
        console.log(`Environment: ${process.env.CI ? 'CI/CD' : 'Local'}`);
        console.log(`Base URL: ${config.baseUrl}`);
        console.log(`Browser: ${process.env.CYPRESS_BROWSER || 'chrome'}`);
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`Total Passed: ${results.totalPassed}`);
        console.log(`Total Failed: ${results.totalFailed}`);
        console.log(`Total Pending: ${results.totalPending}`);
        console.log(`Total Skipped: ${results.totalSkipped}`);
        console.log(`Duration: ${results.totalDuration}ms`);
        
        if (results.totalFailed > 0) {
          console.log(`\nScreenshots: cypress/screenshots/`);
          console.log(`Videos: cypress/videos/`);
        }
        
        console.log(`\nReports: cypress/reports/`);
        console.log(`Cypress Cloud: https://cloud.cypress.io/projects/xnn6up`);
        console.log('='.repeat(60));
        return null;
      });

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          console.log(`Video: ${results.video}`);
        }
        
        const { stats } = results;
        console.log(`\n${spec.name}:`);
        console.log(`Passed: ${stats.passes}`);
        console.log(`Failed: ${stats.failures}`);
        console.log(`Pending: ${stats.pending}`);
        console.log(`Duration: ${stats.duration}ms`);
        
        return null;
      });

      on('before:browser:launch', (browser, launchOptions) => {
        console.log(`Launching ${browser.name} (${browser.version})`);
        
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--allow-running-insecure-content');
          
          // CI-specific optimizations
          if (process.env.CI) {
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-background-timer-throttling');
            launchOptions.args.push('--disable-backgrounding-occluded-windows');
            launchOptions.args.push('--disable-renderer-backgrounding');
            launchOptions.args.push('--disable-features=TranslateUI');
            launchOptions.args.push('--disable-extensions');
            launchOptions.args.push('--disable-component-extensions-with-background-pages');
          }
        }
        
        return launchOptions;
      });

      // Environment-specific configurations
      if (process.env.CI) {
        config.video = process.env.CYPRESS_video !== 'false';
        config.screenshotOnRunFailure = true;
        config.watchForFileChanges = false;
        config.videoCompression = 15;
        
        // Adjust for slower CI environments
        config.defaultCommandTimeout = 8000;
        config.pageLoadTimeout = 45000;
        config.requestTimeout = 15000;
      }

      // Log environment info
      console.log('\nCypress Configuration:');
      console.log(`   Base URL: ${config.baseUrl}`);
      console.log(`   Environment: ${process.env.CI ? 'CI/CD' : 'Local Development'}`);
      console.log(`   Video Recording: ${config.video ? 'Enabled' : 'Disabled'}`);
      console.log(`   Screenshots: ${config.screenshotOnRunFailure ? 'On Failure' : 'Disabled'}`);

      return config;
    }
  }
};