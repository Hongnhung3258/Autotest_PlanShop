const USERNAME_TXT_BX_SEL =  'input[name="user_login"]';
const FORGOT_PASSWORD_BTN_SEL =  '.xoo-el-lostpw-btn';
class ForgotPasswordPage {
  getPopupSelector() {
    return '.xoo-el-inmodal';
  }

  getForgotPasswordSelector() {
    return '.xoo-el-form-container.xoo-el-form-popup';
  }

  getLoginHeaderSelector() {
    return '.xoo-el-login-tgr .menu-link';
  }

  visit() {
    cy.visit('/');
  }

  clickLoginMenu() {
    cy.get(this.getLoginHeaderSelector()).contains('Đăng nhập').click();
    cy.get(this.getPopupSelector()).should('be.visible', { timeout: 4000 });
    cy.task('log', 'Clicked login menu and popup is visible.');
  }

  clickForgotPassword() {
    cy.get('.xoo-el-lostpw-tgr').contains('Quên mật khẩu').click();
    cy.get(this.getForgotPasswordSelector()).should('be.visible', { timeout: 4000 });
  }

  checkForgotPasswordLayout() {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
    cy.get('.xoo-el-form-txt')
      .should('be.visible')
      .and('contain.text', 'Quên mật khẩu? Vui lòng nhập tên người dùng hoặc địa chỉ email của bạn');
    cy.get(USERNAME_TXT_BX_SEL).should('be.visible');
    cy.get(FORGOT_PASSWORD_BTN_SEL)
      .should('be.visible')
      .and('contain.text', 'Liên kết đặt lại email');
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
    cy.checkInvalidField(USERNAME_TXT_BX_SEL, errorMsg);
  }

  checkNoticeError(errorMsg) {
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-error', errorMsg);
  }
  
  pwrecovery() {
    cy.get('.xoo-el-notice .xoo-el-notice-success', { timeout: 10000 }).should('be.visible');
  }

  resetPassword(email) {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
    if (email) {
      cy.get(USERNAME_TXT_BX_SEL).clear().type(email);
    }
    cy.get(FORGOT_PASSWORD_BTN_SEL).click();
  }

  
  
}

export default ForgotPasswordPage;