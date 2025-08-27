Cypress.Commands.add('login', (email, password) => {
  cy.get('.xoo-el-form-container.xoo-el-form-popup').should('be.visible', { timeout: 4000 });
  cy.get('input[name="xoo-el-username"]').type(email);
  cy.get('input[name="xoo-el-password"]').type(password);
  cy.get('.xoo-el-login-btn').click();
});

Cypress.Commands.add('register', (email, firstName, lastName, password, confirmPassword) => {
  cy.get('.xoo-el-form-container.xoo-el-form-popup').should('be.visible', { timeout: 4000 });
  cy.get('input[name="xoo_el_reg_email"]').type(email);
  cy.get('input[name="xoo_el_reg_fname"]').type(firstName);
  cy.get('input[name="xoo_el_reg_lname"]').type(lastName);
  cy.get('input[name="xoo_el_reg_pass"]').type(password);
  cy.get('input[name="xoo_el_reg_pass_again"]').type(confirmPassword);
  cy.get('input[name="xoo_el_reg_terms"]').check();
  cy.get('.xoo-el-register-btn').click();
});