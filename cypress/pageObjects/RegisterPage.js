class RegisterPage {
  getPopupSelector() {
    return '.xoo-el-form-login'; 
  }

  getRegisterFormSelector() {
    return '.xoo-el-form-register';
  }

  getLoginMenuSelector() {
    return '.xoo-el-login-tgr .menu-link';
  }

  visit() {
    cy.visit('/');
  }

  clickLoginMenu() {
    cy.get(this.getLoginMenuSelector()).contains('Đăng nhập').click();
    cy.get(this.getPopupSelector()).should('be.visible', { timeout: 4000 });
    cy.task('log', 'Clicked login menu and popup is visible.');
  }

  switchToRegister() {
    cy.get('.xoo-el-reg-tgr').click();
    cy.get(this.getRegisterFormSelector()).should('be.visible', { timeout: 4000 });
  }

  closePopup() {
    cy.get('body').then(($body) => {
      const popup = $body.find(this.getPopupSelector());
      const closeButton = $body.find('.xoo-el-close.xoo-el-icon-cross');
      if (popup.length > 0 && popup.is(':visible')) {
        if (closeButton.length > 0) {
          cy.get('span.xoo-el-close.xoo-el-icon-cross').click({ force: true });
          cy.get(this.getPopupSelector()).should('not.be.visible', { timeout: 4000 });
          cy.task('log', 'Popup closed successfully.');
        } else {
          cy.task('log', 'Close button not found, skipping close.');
        }
      } else {
        cy.task('log', 'Popup not found or already hidden, skipping close.');
      }
    });
  }

  checkRegisterPopup() {
    cy.get(this.getRegisterFormSelector()).should('be.visible');
  }

  checkMenuHighlight() {
    cy.get('.xoo-el-reg-tgr').should('have.class', 'xoo-el-active');
  }

  checkRegisterLayout() {
    cy.get(this.getRegisterFormSelector()).should('be.visible');
    cy.get('.xoo-el-header li').contains('Đăng ký tài khoản').should('be.visible');
    cy.get('input[name="xoo_el_reg_email"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_fname"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_lname"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_pass"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_pass_again"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_terms"]').should('be.visible');
    cy.get('.xoo-el-register-btn').should('be.visible');
  }

  checkRequiredFields(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
  }

  checkInvalidEmail(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
  }

  checkExistingEmail(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
  }

  checkFirstNameDefault() {
    cy.get('input[name="xoo_el_reg_fname"]').should('have.value', '');
    cy.get('input[name="xoo_el_reg_fname"]').should('have.attr', 'placeholder', 'First Name');
  }

  checkFirstNameRequired(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo_el_reg_fname"]').should('have.focus');
  }

  checkLastNameDefault() {
    cy.get('input[name="xoo_el_reg_lname"]').should('have.value', '');
    cy.get('input[name="xoo_el_reg_lname"]').should('have.attr', 'placeholder', 'Last Name');
  }

  checkLastNameRequired(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo_el_reg_lname"]').should('have.focus');
  }

  checkPasswordDefault() {
    cy.get('input[name="xoo_el_reg_pass"]').should('have.value', '');
    cy.get('input[name="xoo_el_reg_pass"]').should('have.attr', 'placeholder', 'Password');
    cy.get('.xoo-aff-pwtog-show .fa-eye').should('be.visible');
  }

  checkPasswordRequired(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo_el_reg_pass"]').should('have.focus');
  }

  register(email, firstName, lastName, password, confirmPassword, acceptTerms = true) {
    cy.get(this.getRegisterFormSelector()).should('be.visible');
    if (email) cy.get('input[name="xoo_el_reg_email"]').type(email);
    if (firstName) cy.get('input[name="xoo_el_reg_fname"]').type(firstName);
    if (lastName) cy.get('input[name="xoo_el_reg_lname"]').type(lastName);
    if (password) cy.get('input[name="xoo_el_reg_pass"]').type(password);
    if (confirmPassword) cy.get('input[name="xoo_el_reg_pass_again"]').type(confirmPassword);
    if (acceptTerms) cy.get('input[name="xoo_el_reg_terms"]').check();
    cy.get('.xoo-el-register-btn').click();
    cy.task('log', `Register attempted with email: ${email}`);
  }
}

export default RegisterPage;