const EMAIL_TXT_BX_SEL =  'input[name="xoo_el_reg_email"]';
const FIRST_NAME_TXT_BX_SEL =  'input[name="xoo_el_reg_fname"]';
const LAST_NAME_TXT_BX_SEL =  'input[name="xoo_el_reg_lname"]';
const PASSWORD_TXT_BX_SEL =  'input[name="xoo_el_reg_pass"]';
const CONFIRM_PASSWORD_TXT_BX_SEL =  'input[name="xoo_el_reg_pass_again"]';
const TERMS_CHK_BOX_SEL = '.xoo-aff-required.xoo-aff-checkbox_single label';
const CHECK_BOX_SEL = 'input[name="xoo_el_reg_terms"]';
const PRIVACY_POLICY_LINK = '.xoo-aff-required.xoo-aff-checkbox_single a';
const REGISTER_BTN_SEL =  '.xoo-el-register-btn';
const POPUP_SEL = '.xoo-el-srcont';
const ERROR_MESSENGER = '.xoo-el-notice .xoo-el-notice-error';
const SUCCESS_MESSENGER = '.xoo-el-notice .xoo-el-notice-success';
const TAB_SIGN_UP_SEL = '.xoo-el-tabs [data-tab="register"]';

class RegisterPage {
  switchToRegister() {
    cy.get(TAB_SIGN_UP_SEL).click();
    cy.get(POPUP_SEL).should('be.visible');
  }

  checkMenuHighlight() {
    cy.get(TAB_SIGN_UP_SEL).then($loginTab => {
      const inactiveColor = $loginTab.css('background-color');
      this.switchToRegister();
      cy.get(TAB_SIGN_UP_SEL).then($activeTab => {
          const activeColor = $activeTab.css('background-color');
          expect(activeColor).to.not.equal(inactiveColor);
        });
    });
  }

  checkRegisterLayout() {
    this.switchToRegister();
    cy.get(TAB_SIGN_UP_SEL).contains('Đăng ký tài khoản').should('be.visible');
    cy.get(EMAIL_TXT_BX_SEL).should('be.visible');
    cy.get(FIRST_NAME_TXT_BX_SEL).should('be.visible');
    cy.get(LAST_NAME_TXT_BX_SEL).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).should('be.visible');
    cy.get(CONFIRM_PASSWORD_TXT_BX_SEL).should('be.visible');
    cy.get(CHECK_BOX_SEL)
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('not.be.checked');
    cy.get(TERMS_CHK_BOX_SEL).should('contain.text','I accept the');
    cy.get(PRIVACY_POLICY_LINK).should('be.visible').contains('Terms of Service and Privacy Policy');
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
    cy.checkNotice(ERROR_MESSENGER, errorMgs);
  }

  openPrivacyPolicy() {
    this.switchToRegister();
    cy.get(PRIVACY_POLICY_LINK).invoke('removeAttr', 'target').click();
    cy.url().should('include', '/privacy-policy');
    cy.get('h2').should('contain.text', 'Chính sách bảo mật');
  }

  registerSuccess(errorMsg) {
    cy.checkNotice(SUCCESS_MESSENGER, errorMsg);
    cy.url({ timeout: 10000 }).should('include', '/my-account');
  }

  register(email, firstName, lastName, password, confirmPassword, acceptTerms = true) {
    this.switchToRegister();
    if (email) cy.get(EMAIL_TXT_BX_SEL).type(email);
    if (firstName) cy.get(FIRST_NAME_TXT_BX_SEL).type(firstName);
    if (lastName) cy.get(LAST_NAME_TXT_BX_SEL).type(lastName);
    if (password) cy.get(PASSWORD_TXT_BX_SEL).type(password);
    if (confirmPassword) cy.get(CONFIRM_PASSWORD_TXT_BX_SEL).type(confirmPassword);
    if (acceptTerms) cy.get(CHECK_BOX_SEL).check();
    cy.get(REGISTER_BTN_SEL).click();
  }
}

export default RegisterPage;