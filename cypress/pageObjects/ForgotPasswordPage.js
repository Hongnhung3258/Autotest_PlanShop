const USERNAME_TXT_BX_SEL =  'input[name="user_login"]';
const FORGOT_PASSWORD_BTN_SEL =  '.xoo-el-lostpw-btn';
const FORGOT_PASSWORD_LINK = 'a.xoo-el-lostpw-tgr';
const POPUP_SEL = '.xoo-el-srcont';
const MESSAGE = '.xoo-el-form-txt';
const ERROR_MESSAGE = '.xoo-el-notice .xoo-el-notice-error';
const SUCCESS_MESSAGE = '.xoo-el-notice .xoo-el-notice-success';

class ForgotPasswordPage {
  clickForgotPassword() {
    cy.get(FORGOT_PASSWORD_LINK).click();
    cy.get(POPUP_SEL).should('be.visible');
  }

  checkForgotPasswordLayout() {
    cy.get(MESSAGE).should('be.visible')
      .contains('Quên mật khẩu? Vui lòng nhập tên người dùng hoặc địa chỉ email của bạn');
    cy.get(USERNAME_TXT_BX_SEL).should('be.visible');
    cy.get(FORGOT_PASSWORD_BTN_SEL)
      .should('be.visible')
      .contains('Liên kết đặt lại email');
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.checkInvalidField(USERNAME_TXT_BX_SEL, errorMsg);
  }

  checkNoticeError(errorMsg) {
    cy.checkNotice(ERROR_MESSAGE, errorMsg);
  }
  
  pwrecovery() {
    cy.get(SUCCESS_MESSAGE, { timeout: 10000 }).should('be.visible');
  }

  resetPassword(email) {
    if (email) cy.get(USERNAME_TXT_BX_SEL).clear().type(email);
    cy.get(FORGOT_PASSWORD_BTN_SEL).click();
  }

  
  
}

export default ForgotPasswordPage;