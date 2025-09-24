import BasePage from './BasePage';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.loginHeaderSelector = '#menu-item-1194';
    this.loginPopupSelector = '.xoo-el-form-container.xoo-el-form-popup';
    this.headerTabSelector = '.xoo-el-header li';
    this.usernameInputSelector = 'input[name="xoo-el-username"]';
    this.passwordInputSelector = 'input[name="xoo-el-password"]';
    this.loginButtonSelector = '.xoo-el-login-btn';
    this.rememberMeCheckboxSelector = 'input[name="xoo-el-rememberme"]';
    this.textRememberMeSelector = 'label.xoo-el-form-label span';
    this.forgotPasswordLinkSelector = '.xoo-el-lostpw-tgr';
    this.showPasswordButtonSelector = '.xoo-aff-pwtog-show';
    this.hidePasswordButtonSelector = '.xoo-aff-pwtog-hide';
    this.adminToolbarSelector = '#wpadminbar';
    this.adminUsernameMenuSelector = '#menu-item-1171';
    this.adminNewSelector = '#wp-admin-bar-new-content';
    this.adminNewProductSelector = '#wp-admin-bar-new-product';
    this.errorMessageSelector = '.xoo-el-notice .xoo-el-notice-error';
    this.successMessageSelector = '.xoo-el-notice .xoo-el-notice-success';
  }
  
  getForgotPasswordSelector() { return 'div[data-section="lostpw"]'; }

  clickLoginMenu() {
    this.clickButton(this.loginHeaderSelector);
    this.verifyElementVisible(this.loginPopupSelector);
  }

  checkLoginPopup() {
    this.verifyElementVisible(this.loginPopupSelector);
  }

  checkMenuHighlight() {
    cy.get(this.loginHeaderSelector).should('have.class', 'current-menu-item');
  }

  login(email, password) {
    this.verifyElementVisible(this.loginPopupSelector);
    this.clearAndType(this.usernameInputSelector, email);
    this.clearAndType(this.passwordInputSelector, password);
    this.clickButton(this.loginButtonSelector);
  }

  checkLoginIntegration(role) {
    if (role === 'customer') {
      this.verifyCurrentUrl('/shop');
      cy.get(this.loginHeaderSelector).should('not.exist');
      this.verifyElementVisible(this.adminUsernameMenuSelector);
    } else if (role === 'admin') {
      this.verifyCurrentUrl('/shop');
      this.verifyElementVisible(this.adminToolbarSelector);
      this.verifyElementVisible(this.adminUsernameMenuSelector);
    }
  }

  verifyAdminCanAccessProductEdit() {
    this.hoverElement(this.adminNewSelector, 50);
    this.verifyElementVisible(this.adminNewProductSelector);
  }

  verifyAdminToolbar() {
    this.verifyElementVisible(this.adminToolbarSelector);
    cy.get(this.adminToolbarSelector).within(() => {
      cy.contains('Plant Shop').should('be.visible');
      cy.contains('Tạo mới').should('be.visible');
      cy.contains('Sửa với Elementor').should('be.visible');
    });
  }

  checkLoginLayout() {
    this.verifyElementVisible(this.loginPopupSelector);
    this.verifyElementContainsText(this.headerTabSelector, 'Đăng nhập tài khoản');
    this.verifyElementVisible(this.usernameInputSelector);
    this.verifyElementVisible(this.passwordInputSelector);
    this.verifyElementVisible('.xoo-aff-pw-toggle');
    this.verifyElementVisible(this.rememberMeCheckboxSelector);
    
    cy.get(this.rememberMeCheckboxSelector)
      .should('have.attr', 'type', 'checkbox')
      .and('have.attr', 'value', 'forever');
    
    this.verifyElementContainsText(this.textRememberMeSelector, 'Nhớ mật khẩu');
    this.verifyElementContainsText(this.forgotPasswordLinkSelector, 'Quên mật khẩu?');
    this.verifyElementVisible(this.loginButtonSelector);
  }

  hoverLoginButton() {
    this.verifyElementVisible(this.loginPopupSelector);
    this.hoverElement(this.loginButtonSelector, 150);
    cy.get(this.loginButtonSelector).should('have.css', 'background-color', 'rgb(0, 0, 0)');
  }

  hoverForgotPassword() {
    this.verifyElementVisible(this.loginPopupSelector);
    this.hoverElement(this.rememberMeCheckboxSelector, 150);
    cy.get(this.forgotPasswordLinkSelector).should('have.css', 'color', 'rgb(55,146,55');
  }

  checkUsernameDefault() {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.get(this.usernameInputSelector).should('have.value', '');
    cy.get(this.usernameInputSelector).should('have.attr', 'placeholder', 'Username / Email');
  }

  checkInvalidFieldUsername(errorMsg) {
    cy.checkInvalidField(this.usernameInputSelector, errorMsg);
  }

  checkPasswordDefault() {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.get(this.passwordInputSelector).should('have.value', '');
    cy.get(this.passwordInputSelector).should('have.attr', 'placeholder', 'Password');
    cy.get('.xoo-aff-pwtog-show .fa-eye').should('be.visible');
  }

  checkInvalidFieldPassword(errorMsg) {
    cy.checkInvalidField(this.passwordInputSelector, errorMsg);
  }

  checkPasswordMasked() {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.get(this.passwordInputSelector).should('have.attr', 'type', 'password');
    cy.task('log', 'Password field is masked.');
  }

  togglePasswordVisibility() {
    this.verifyElementVisible(this.loginPopupSelector);
    this.clearAndType(this.passwordInputSelector, 'TestPassword123');
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get(this.showPasswordButtonSelector).click({ force: true });
      cy.get(this.passwordInputSelector).should('have.attr', 'type', 'text');
      cy.task('log', 'Password shown');
    });
    
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get(this.hidePasswordButtonSelector).click({ force: true });
      cy.get(this.passwordInputSelector).should('have.attr', 'type', 'password');
      cy.task('log', 'Password hidden');
    });
  }

  pasteIntoFieldUsername(value) {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.pasteIntoField(this.usernameInputSelector, value);
  }

  pasteIntoFieldPassword(value) {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.pasteIntoField(this.passwordInputSelector, value);
  }

  checkNoticeError(errorMsg) {
    cy.checkNotice(this.errorMessageSelector, errorMsg);
  }

  checkNoticeSucc(errorMsg) {
    cy.checkNotice(this.successMessageSelector, errorMsg);
  }

  checkRememberMe() {
    this.verifyElementVisible(this.loginPopupSelector);
    this.checkCheckbox(this.rememberMeCheckboxSelector);
    cy.get(this.rememberMeCheckboxSelector).should('be.checked');
  }

  checkNoRememberMe() {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.get(this.rememberMeCheckboxSelector).should('not.be.checked');
  }

  clickForgotPassword() {
    this.verifyElementVisible(this.loginPopupSelector);
    cy.get(this.forgotPasswordLinkSelector).contains('Quên mật khẩu?').click();
  }

  checkForgotPasswordPage() {
    this.verifyElementVisible(this.getForgotPasswordSelector());
  }
}

export default LoginPage;