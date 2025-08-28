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
    cy.get('input[name="user_login"]').should('be.visible');
    cy.get('.xoo-el-lostpw-btn')
      .should('be.visible')
      .and('contain.text', 'Liên kết đặt lại email');
  }

  checkInvalidFieldEmail(errorMsg) {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
    cy.checkInvalidField('input[name="user_login"]', errorMsg);
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
      cy.get('input[name="user_login"]').clear().type(email);
    }
    cy.get('.xoo-el-lostpw-btn').click();
  }

  
  
}

export default ForgotPasswordPage;