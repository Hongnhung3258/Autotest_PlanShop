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
    if (email) cy.get('input[name="xoo-el-username"]').type(email);
    if (password) cy.get('input[name="xoo-el-password"]').type(password);
    cy.get('.xoo-el-login-btn').click();
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
    cy.get('input[name="xoo-el-username"]').should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]')
      .should('be.visible')
      .and('have.attr', 'type', 'checkbox')
      .and('have.attr', 'value', 'forever');
    cy.get('label.xoo-el-form-label span')
      .should('be.visible')
      .and('contain.text', 'Nhớ mật khẩu');
    cy.get('a.xoo-el-lostpw-tgr')
      .should('be.visible')
      .and('contain.text', 'Quên mật khẩu?')
      .and('have.attr', 'href', '#');
    cy.get('.xoo-el-login-btn').should('be.visible');
  }

  hoverLoginButton() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('.xoo-el-login-btn').trigger('mouseover');
    cy.get('.xoo-el-login-btn').should('have.css', 'background-color', 'rgb(0, 0, 0)');
  }

  hoverForgotPassword() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('.xoo-el-lostpw-tgr').trigger('mouseover');
    cy.get('.xoo-el-lostpw-tgr').should('have.css', 'color', 'rgb(0, 0, 255)');
  }

  checkUsernameDefault() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-username"]').should('have.value', '');
    cy.get('input[name="xoo-el-username"]').should('have.attr', 'placeholder', 'Username / Email');
  }

  checkInvalidFieldUsername(errorMsg){
    cy.checkInvalidField('input[name="xoo-el-username"]', errorMsg);
  }

  checkPasswordDefault() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('have.value', '');
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'placeholder', 'Password');
    cy.get('.xoo-aff-pwtog-show .fa-eye').should('be.visible');
  }

  checkInvalidFieldPassword(errorMsg){
    cy.checkInvalidField('input[name="xoo-el-password"]', errorMsg);
  }

  checkPasswordMasked() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'password');
    cy.task('log', 'Password field is masked.');
  }

  togglePasswordVisibility() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-password"]').clear().type('TestPassword123');
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get('.xoo-aff-pwtog-show').click({ force: true });
      cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'text');
      cy.task('log', 'Password shown');
    });
    cy.get('.xoo-el-password_cont').within(() => {
      cy.get('.xoo-aff-pwtog-hide').click({ force: true });
      cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'password');
      cy.task('log', 'Password hidden');
    });
  }

  pasteIntoFieldUsername(value) {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.pasteIntoField('input[name="xoo-el-username"]', value);
  }

  pasteIntoFieldPassword(value) {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.pasteIntoField('input[name="xoo-el-password"]', value);
  }

  checkNoticeError(errorMsg){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-error', errorMsg);
  }

  checkNoticeSucc(errorMsg){
    cy.checkNotice('.xoo-el-notice .xoo-el-notice-success', errorMsg);
  }

  checkRememberMe() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').check();
    cy.get('input[name="xoo-el-rememberme"]').should('be.checked');
    
  }

  checkNoRememberMe() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').should('not.be.checked');
  }

  clickForgotPassword() {
    cy.get(this.getLoginSelector()).should('be.visible');
    cy.get('.xoo-el-lostpw-tgr').contains('Quên mật khẩu?').click();
  }

  checkForgotPasswordPage() {
    cy.get(this.getForgotPasswordSelector()).should('be.visible');
  }
}

export default LoginPage;