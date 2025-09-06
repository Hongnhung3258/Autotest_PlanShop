const USERNAME_TXT_BX_SEL =  'input[name="xoo-el-username"]';
const PASSWORD_TXT_BX_SEL =  'input[name="xoo-el-password"]';
const SHOW_PASSWORD_BTN_SEL =  '.xoo-aff-pwtog-show';
const HIDE_PASSWORD_BTN_SEL =  '.xoo-aff-pwtog-hide';
const REMEMBER_ME_CHK_BOX_SEL =  'input[name="xoo-el-rememberme"]';
const FORGOT_PASSWORD_LINK_SEL =  '.xoo-el-lostpw-tgr';
const LOGIN_BTN_SEL =  '.xoo-el-login-btn';
class LoginPage {
  getPopupSelector() {
    return '.xoo-el-inmodal';
  }

  getLoginSelector() {
    return '.xoo-el-form-container.xoo-el-form-popup';
  }

  getLoginHeaderSelector() {
    return '.xoo-el-login-tgr .menu-link';
  }
  
  getForgotPasswordSelector() {
    return 'div[data-section="lostpw"]';
  }

  clickLoginMenu(){
    cy.get(this.getLoginHeaderSelector()).contains('Đăng nhập').click();
    cy.get(this.getPopupSelector()).should('be.visible', { timeout: 4000 });
    cy.task('log', 'Clicked login menu and popup is visible.');
  }

  checkLoginPopup() {
    cy.get(this.getPopupSelector()).should('be.visible');
  }

  checkMenuHighlight() {
    cy.get(this.getLoginHeaderSelector()).contains('Đăng nhập').should('have.class', 'current-menu-item');
  }

  login(email, password) {
    cy.get(this.getLoginHeaderSelector()).should('be.visible');
    if (email) cy.get(USERNAME_TXT_BX_SEL).type(email);
    if (password) cy.get(PASSWORD_TXT_BX_SEL).type(password);
    cy.get(LOGIN_BTN_SEL).click();
  }

  checkLoginSuccess(role) {
    if (role === 'customer') {
      cy.url().should('include', '/shop');
    } else if (role === 'admin') {
      cy.url().should('include', '/shop');
      cy.get('#wpadminbar').should('be.visible');
    }
  }

  checkLoginLayout() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('.xoo-el-header li').contains('Đăng nhập tài khoản').should('be.visible');
    cy.get(USERNAME_TXT_BX_SEL).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).should('be.visible');
    cy.get('.xoo-aff-pw-toggle').should('be.visible');
    cy.get(REMEMBER_ME_CHK_BOX_SEL).should('be.visible');
    cy.get(REMEMBER_ME_CHK_BOX_SEL)
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('have.attr', 'value', 'forever');
    cy.get('label.xoo-el-form-label span')
      .should('be.visible')
      .and('contain.text', 'Nhớ mật khẩu');
    cy.get(FORGOT_PASSWORD_LINK_SEL)
      .should('be.visible')
      .and('contain.text', 'Quên mật khẩu?')
      .and('have.attr', 'href', '#');
    cy.get(LOGIN_BTN_SEL).should('be.visible');
  }

  hoverLoginButton() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(LOGIN_BTN_SEL).trigger('mouseover');
    cy.get(LOGIN_BTN_SEL).should('have.css', 'background-color', 'rgb(0, 0, 0)');
  }

  hoverForgotPassword() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(REMEMBER_ME_CHK_BOX_SEL).trigger('mouseover');
    cy.get(FORGOT_PASSWORD_LINK_SEL).should('have.css', 'color', 'rgb(0, 0, 255)');
  }

  checkUsernameDefault() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(USERNAME_TXT_BX_SEL).should('have.value', '');
    cy.get(USERNAME_TXT_BX_SEL).should('have.attr', 'placeholder', 'Username / Email');
  }

  checkInvalidFieldUsername(errorMsg){
    cy.checkInvalidField(USERNAME_TXT_BX_SEL, errorMsg);
  }

  checkPasswordDefault() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).should('have.value', '');
    cy.get(PASSWORD_TXT_BX_SEL).should('have.attr', 'placeholder', 'Password');
    cy.get('.xoo-aff-pwtog-show .fa-eye').should('be.visible');
  }

  checkInvalidFieldPassword(errorMsg){
    cy.checkInvalidField(PASSWORD_TXT_BX_SEL, errorMsg);
  }

  checkPasswordMasked() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).should('have.attr', 'type', 'password');
    cy.task('log', 'Password field is masked.');
  }

  togglePasswordVisibility() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(PASSWORD_TXT_BX_SEL).clear().type('TestPassword123');
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get(SHOW_PASSWORD_BTN_SEL).click({ force: true });
      cy.get(PASSWORD_TXT_BX_SEL).should('have.attr', 'type', 'text');
      cy.task('log', 'Password shown');
    });
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get(HIDE_PASSWORD_BTN_SEL).click({ force: true });
      cy.get(PASSWORD_TXT_BX_SEL).should('have.attr', 'type', 'password');
      cy.task('log', 'Password hidden');
    });
  }

  pasteIntoFieldUsername(value) {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.pasteIntoField(USERNAME_TXT_BX_SEL, value);
  }

  pasteIntoFieldPassword(value) {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.pasteIntoField(PASSWORD_TXT_BX_SEL, value);
  }

  checkNoticeError(errorMsg){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-error', errorMsg);
  }

  checkNoticeSucc(errorMsg){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-success', errorMsg);
  }

  checkRememberMe() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(REMEMBER_ME_CHK_BOX_SEL).check();
    cy.get(REMEMBER_ME_CHK_BOX_SEL).should('be.checked');
    
  }

  checkNoRememberMe() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(REMEMBER_ME_CHK_BOX_SEL).should('not.be.checked');
  }

  clickForgotPassword() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get(FORGOT_PASSWORD_LINK_SEL).contains('Quên mật khẩu?').click();
  }

  checkForgotPasswordPage() {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
  }
}

export default LoginPage;