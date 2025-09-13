import './commands';
import "cypress-real-events/support";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  capture: 'viewport', 
  scale: true,
  disableTimersAndAnimations: false, 
  blackout: ['.sensitive-data'], 
  overwrite: true
});

Cypress.on('uncaught:exception', (err, runnable) => {
  const timestamp = Date.now();
  const testTitle = runnable.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'uncaught_exception';
  
  cy.screenshot(`FAILED_uncaught_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true
  });
  
  console.error('Uncaught Exception:', err.message);
  
  return false;
});

Cypress.on('fail', (error) => {
  const timestamp = Date.now();
  const currentTest = Cypress.currentTest;
  const testTitle = currentTest?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown_test';
  
  cy.screenshot(`FAILED_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true,
    onAfterScreenshot: (details) => {
      console.log(`💥 Failure screenshot saved: ${details.path}`);
    }
  });
  
  console.error('Test Failed:', {
    test: currentTest?.title,
    error: error.message,
    stack: error.stack
  });
  
  throw error;
});

beforeEach(() => {
  cy.window().then((win) => {
    win.errorCount = 0;
    win.onerror = (message, source, lineno, colno, error) => {
      win.errorCount++;
      console.error('JavaScript Error:', { message, source, lineno, colno, error });
      return false;
    };
  });
});

afterEach(function() {
  if (this.currentTest.state === 'failed') {
    const timestamp = Date.now();
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    cy.screenshot(`FINAL_FAILED_${testTitle}_${timestamp}`, {
      capture: 'viewport',
      overwrite: true,
      onAfterScreenshot: (details) => {
        console.log(`📸 Final failure screenshot: ${details.path}`);
        
        cy.window().then((win) => {
          if (win.errorCount > 0) {
            console.log(`JavaScript errors detected: ${win.errorCount}`);
          }
        });
      }
    });
    
    console.log(`Test "${this.currentTest.title}" FAILED`);
    console.log(`Screenshots saved in: cypress/screenshots/`);
    
  } else if (this.currentTest.state === 'passed') {
    console.log(`Test "${this.currentTest.title}" PASSED`);
  }
});

Cypress.on('command:failed', (err, runnable) => {
  const timestamp = Date.now();
  const testTitle = runnable.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'command_failed';
  
  cy.screenshot(`FAILED_command_timeout_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true
  });
  
  console.error('Command Failed:', err.message);
});