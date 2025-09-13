import './commands';
import "cypress-real-events/support";

// Screenshot configuration - chỉ chụp khi có lỗi
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  capture: 'viewport', // Chụp toàn bộ viewport để có context đầy đủ
  scale: true,
  disableTimersAndAnimations: false, // Giữ animations để thấy được trạng thái thực tế
  blackout: ['.sensitive-data'], // Blackout sensitive information nếu có
  overwrite: true
});

// Global error handler - tự động chụp screenshot khi có uncaught exception
Cypress.on('uncaught:exception', (err, runnable) => {
  // Chụp screenshot khi có uncaught exception
  const timestamp = Date.now();
  const testTitle = runnable.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'uncaught_exception';
  
  cy.screenshot(`FAILED_uncaught_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true
  });
  
  // Log error details
  console.error('Uncaught Exception:', err.message);
  
  // Return false để prevent test từ failing do uncaught exception
  // Nếu bạn muốn test fail khi có uncaught exception, return true hoặc không return gì
  return false;
});

// Global fail handler - chỉ chụp screenshot khi test thực sự fail
Cypress.on('fail', (error) => {
  const timestamp = Date.now();
  const currentTest = Cypress.currentTest;
  const testTitle = currentTest?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown_test';
  
  // Chụp screenshot với tên descriptive
  cy.screenshot(`FAILED_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true,
    onAfterScreenshot: (details) => {
      console.log(`💥 Failure screenshot saved: ${details.path}`);
    }
  });
  
  // Log failure details
  console.error('Test Failed:', {
    test: currentTest?.title,
    error: error.message,
    stack: error.stack
  });
  
  throw error; // Re-throw để test vẫn fail
});

// Custom event listeners for better error tracking
beforeEach(() => {
  // Reset error tracking cho mỗi test
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
  // Chỉ chụp screenshot nếu test failed
  if (this.currentTest.state === 'failed') {
    const timestamp = Date.now();
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Chụp screenshot cuối cùng với context đầy đủ
    cy.screenshot(`FINAL_FAILED_${testTitle}_${timestamp}`, {
      capture: 'viewport',
      overwrite: true,
      onAfterScreenshot: (details) => {
        console.log(`📸 Final failure screenshot: ${details.path}`);
        
        // Log thêm thông tin debugging
        cy.window().then((win) => {
          if (win.errorCount > 0) {
            console.log(`🐛 JavaScript errors detected: ${win.errorCount}`);
          }
        });
      }
    });
    
    // Log failure summary
    console.log(`❌ Test "${this.currentTest.title}" FAILED`);
    console.log(`📁 Screenshots saved in: cypress/screenshots/`);
    
  } else if (this.currentTest.state === 'passed') {
    // KHÔNG chụp screenshot khi test pass
    console.log(`✅ Test "${this.currentTest.title}" PASSED`);
  }
});

// Command timeout handler - chụp screenshot khi command timeout
Cypress.on('command:failed', (err, runnable) => {
  const timestamp = Date.now();
  const testTitle = runnable.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'command_failed';
  
  cy.screenshot(`FAILED_command_timeout_${testTitle}_${timestamp}`, {
    capture: 'viewport',
    overwrite: true
  });
  
  console.error('Command Failed:', err.message);
});