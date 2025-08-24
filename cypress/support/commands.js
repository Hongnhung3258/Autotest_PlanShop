Cypress.Commands.add('login', (email, password) => {
  cy.get('.xoo-el-form-container.xoo-el-form-popup').should('be.visible', { timeout: 4000 });
  cy.get('input[name="xoo-el-username"]').type(email);
  cy.get('input[name="xoo-el-password"]').type(password);
  cy.get('.xoo-el-login-btn').click();
});