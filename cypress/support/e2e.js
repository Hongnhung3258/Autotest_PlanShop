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
  
  console.error('Uncaught Exception:', err.message);
  console.log(`📸 Would capture screenshot: FAILED_uncaught_${testTitle}_${timestamp}`);
  
  return false;
});

Cypress.on('fail', (error) => {
  const timestamp = Date.now();
  const currentTest = Cypress.currentTest;
  const testTitle = currentTest?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown_test';
  
  console.error('Test Failed:', {
    test: currentTest?.title,
    error: error.message,
    stack: error.stack
  });
  
  console.log(`📸 Failure detected: FAILED_${testTitle}_${timestamp}`);
  
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
  // FIX: Only take screenshots using built-in Cypress functionality
  if (this.currentTest.state === 'failed') {
    const timestamp = Date.now();
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    console.log(`Test "${this.currentTest.title}" FAILED`);
    console.log(` Screenshots automatically saved by Cypress in: cypress/screenshots/`);
    
    // Log additional debugging info without taking manual screenshots
    cy.window().then((win) => {
      if (win.errorCount > 0) {
        console.log(` JavaScript errors detected: ${win.errorCount}`);
      }
    });
    
  } else if (this.currentTest.state === 'passed') {
    console.log(` Test "${this.currentTest.title}" PASSED`);
  }
});
