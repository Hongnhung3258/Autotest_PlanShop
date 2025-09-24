import './commands';
import "cypress-real-events/support";
import 'cypress-mochawesome-reporter/register';                   

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  capture: 'viewport', 
  scale: true,
  disableTimersAndAnimations: false, 
  blackout: ['.sensitive-data'],
  overwrite: true
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught Exception:', err.message);
  return false;
});

beforeEach(() => {
  cy.window().then((win) => {
    win.errorCount = 0;
    win.onerror = (message, source, lineno, colno, error) => {
      win.errorCount++;
      console.error('JavaScript Error:', { message, source, lineno, colno, error });
      return true; 
    };
  });
  
});

afterEach(function() {
  if (this.currentTest.state === 'failed') {
    const timestamp = Date.now();
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    console.log(`Test "${this.currentTest.title}" FAILED`);
    console.log(`Screenshots automatically saved by Cypress in: cypress/screenshots/`);
    
    cy.window().then((win) => {
      if (win.errorCount > 0) {
        console.log(`JavaScript errors detected: ${win.errorCount}`);
      }
    });
    
  } else if (this.currentTest.state === 'passed') {
    console.log(`Test "${this.currentTest.title}" PASSED`);
  }
});