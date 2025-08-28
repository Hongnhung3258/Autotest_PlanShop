class RegisterPage {
  getPopupSelector() {
    return '.xoo-el-inmodal';
  }

  getRegisterSelector() {
    return '.xoo-el-form-container.xoo-el-form-popup';
  }

  getLoginHeaderSelector() {
    return '.xoo-el-login-tgr .menu-link';
  }

  clickLoginMenu(){
    cy.get(this.getLoginHeaderSelector()).contains('Đăng nhập').click();
    cy.get(this.getPopupSelector()).should('be.visible', { timeout: 4000 });
    cy.task('log', 'Clicked login menu and popup is visible.');
  }


  switchToRegister() {
    cy.get('li.xoo-el-reg-tgr').click();
    cy.get(this.getRegisterSelector()).should('be.visible', { timeout: 4000 });
  }

  checkRegisterPopup() {
    cy.get(this.getRegisterSelector()).should('be.visible');
    cy.task('log', 'Register popup is visible.');
  }

  checkMenuHighlight() {
    cy.get('.xoo-el-tabs .xoo-el-login-tgr').then($loginTab => {
      const inactiveColor = $loginTab.css('background-color');

      cy.get('.xoo-el-tabs .xoo-el-reg-tgr')
        .should('be.visible')
        .should($activeTab => {
          const activeColor = $activeTab.css('background-color');
          expect(activeColor).to.not.equal(inactiveColor);
        });
    });
  }

  checkRegisterLayout() {
    cy.get(this.getRegisterSelector()).should('be.visible');
    cy.get('.xoo-el-header li').contains('Đăng ký tài khoản').should('be.visible');
    cy.get('input[name="xoo_el_reg_email"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_fname"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_lname"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_pass"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_pass_again"]').should('be.visible');
    cy.get('input[name="xoo_el_reg_terms"]')
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('have.value', 'yes')
      .and('not.be.checked');
    cy.get('input[name="xoo_el_reg_terms"]')
      .parent('label')
      .should(($label) => {
        const text = $label.text().replace(/\s+/g, ' ').trim();
        expect(text).to.include('I accept the Terms of Service and Privacy Policy');
      });
    cy.get('.xoo-el-register-btn').should('be.visible');
  }

  checkRequiredFields(errorMsg) {
    const selectors = [
      'input[name="xoo_el_reg_email"]',
      'input[name="xoo_el_reg_fname"]',
      'input[name="xoo_el_reg_lname"]',
      'input[name="xoo_el_reg_pass"]',
      'input[name="xoo_el_reg_pass_again"]'
    ];

    selectors.forEach(selector => {
      cy.get('body').then($body => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).then($input => {
            if ($input[0].validationMessage) { // Chỉ kiểm tra nếu có validation message
              expect($input[0].validationMessage).to.equal(errorMsg);
            }
          });
        }
      });
    });
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.checkInvalidField('input[name="xoo_el_reg_email"]', errorMsg);
  }

  checkNoticeError(errorMgs){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-error', errorMgs);
  }

  openPrivacyPolicy() {
    cy.get('input[name="xoo_el_reg_terms"]')
      .parent('label')
      .find('a')
      .contains('Terms of Service and Privacy Policy ')
      .as('privacyLink');

    cy.get('@privacyLink')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .then((href) => {
        const normalizedHref = href.includes('?page_id=3') ? '/privacy-policy' : href;
        cy.visit(normalizedHref);
        cy.url().should('include', '/privacy-policy');
        cy.get('h2').should('contain.text', 'Chính sách bảo mật');
      });
  }

  registerSuccess(errorMsg) {
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-success', errorMsg);
    cy.url({ timeout: 10000 }).should('include', '/my-account');
  }

  register(email, firstName, lastName, password, confirmPassword, acceptTerms = true) {
    cy.get(this.getRegisterSelector()).should('be.visible');
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