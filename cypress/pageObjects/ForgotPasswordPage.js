import BasePage from './BasePage';

class ForgotPasswordPage extends BasePage {
  constructor() {
    super();
    
    this.usernameInputSelector = 'input[name="user_login"]';
    this.forgotPasswordButtonSelector = '.xoo-el-lostpw-btn';
    this.forgotPasswordLinkSelector = 'a.xoo-el-lostpw-tgr';
    this.popupSelector = '.xoo-el-srcont';
    this.instructionMessageSelector = '.xoo-el-form-txt';
    this.errorMessageSelector = '.xoo-el-notice .xoo-el-notice-error';
    this.successMessageSelector = '.xoo-el-notice .xoo-el-notice-success';
  }

  clickForgotPassword() {
    this.clickButton(this.forgotPasswordLinkSelector);
    this.verifyElementVisible(this.popupSelector);
  }

  checkForgotPasswordLayout() {
    this.verifyElementVisible(this.instructionMessageSelector);
    this.verifyElementContainsText(
      this.instructionMessageSelector, 
      'Quên mật khẩu? Vui lòng nhập tên người dùng hoặc địa chỉ email của bạn'
    );
    this.verifyElementVisible(this.usernameInputSelector);
    this.verifyElementVisible(this.forgotPasswordButtonSelector);
    this.verifyElementContainsText(this.forgotPasswordButtonSelector, 'Liên kết đặt lại email');
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.checkInvalidField(this.usernameInputSelector, errorMsg);
  }

  checkNoticeError(errorMsg) {
    cy.checkNotice(this.errorMessageSelector, errorMsg);
  }
  resetPassword(email) {
    this.clearAndType(this.usernameInputSelector, email);
    this.clickButton(this.forgotPasswordButtonSelector);
  }
  pwrecovery() {
    this.verifyElementVisible(this.successMessageSelector);
  }
  
}

export default ForgotPasswordPage;