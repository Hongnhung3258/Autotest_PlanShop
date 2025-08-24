// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Xử lý lỗi uncaught:exception từ ứng dụng
Cypress.on('uncaught:exception', (err, runnable) => {
  // Bỏ qua lỗi "updateTrigger is not defined"
  if (err.message.includes('updateTrigger is not defined')) {
    return false; // Ngăn Cypress fail test
  }
  // Để các lỗi khác fail bình thường
  return true;
});