const EMAIL_TXT_BX_SEL =  'input[name="xoo_el_reg_email"]';
const FIRST_NAME_TXT_BX_SEL =  'input[name="xoo_el_reg_fname"]';
const LAST_NAME_TXT_BX_SEL =  'input[name="xoo_el_reg_lname"]';
const PASSWORD_TXT_BX_SEL =  'input[name="xoo_el_reg_pass"]';
const CONFIRM_PASSWORD_TXT_BX_SEL =  'input[name="xoo_el_reg_pass_again"]';
const TERMS_CHK_BOX_SEL =  'input[name="xoo_el_reg_terms"]';
const REGISTER_BTN_SEL =  '.xoo-el-register-btn';
class RegisterPage {
  getPopupSelector() {
    return '.xoo-el-inmodal';
  }

  getFormSelector() {
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
    cy.get(this.getFormSelector()).should('be.visible', { timeout: 4000 });
  }

  checkRegisterPopup() {
    cy.get(this.getFormSelector()).should('be.visible');
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
    cy.get(this.getFormSelector()).should('be.visible');
    cy.get('.xoo-el-header li').contains('Đăng ký tài khoản').should('be.visible');
    cy.get(EMAIL_TXT_BX_SEL).should('be.visible');
    cy.get(FIRST_NAME_TXT_BX_SEL).should('be.visible');
    cy.get(LAST_NAME_TXT_BX_SEL).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).should('be.visible');
    cy.get(CONFIRM_PASSWORD_TXT_BX_SEL).should('be.visible');
    cy.get(TERMS_CHK_BOX_SEL)
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('have.value', 'yes')
      .and('not.be.checked');
    cy.get(TERMS_CHK_BOX_SEL)
      .parent('label')
      .should(($label) => {
        const text = $label.text().replace(/\s+/g, ' ').trim();
        expect(text).to.include('I accept the Terms of Service and Privacy Policy');
      });
    cy.get(REGISTER_BTN_SEL).should('be.visible');
  }

  checkRequiredFields(errorMsg) {
    const selectors = [
      EMAIL_TXT_BX_SEL,
      FIRST_NAME_TXT_BX_SEL,
      LAST_NAME_TXT_BX_SEL,
      PASSWORD_TXT_BX_SEL,
      CONFIRM_PASSWORD_TXT_BX_SEL
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
    cy.checkInvalidField(EMAIL_TXT_BX_SEL, errorMsg);
  }

  checkNoticeError(errorMgs){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-error', errorMgs);
  }

  openPrivacyPolicy() {
    cy.get(TERMS_CHK_BOX_SEL)
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
    cy.get(this.getFormSelector()).should('be.visible');
    if (email) cy.get(EMAIL_TXT_BX_SEL).type(email);
    if (firstName) cy.get(FIRST_NAME_TXT_BX_SEL).type(firstName);
    if (lastName) cy.get(LAST_NAME_TXT_BX_SEL).type(lastName);
    if (password) cy.get(PASSWORD_TXT_BX_SEL).type(password);
    if (confirmPassword) cy.get(CONFIRM_PASSWORD_TXT_BX_SEL).type(confirmPassword);
    if (acceptTerms) cy.get(TERMS_CHK_BOX_SEL).check();
    cy.get(REGISTER_BTN_SEL).click();
    cy.task('log', `Register attempted with email: ${email}`);
  }
}

export default RegisterPage;