class LoginPage {
  getPopupSelector() {
    return '.xoo-el-form-login'; 
  }

  getLoginMenuSelector() {
    return '.xoo-el-login-tgr .menu-link'; 
  }

  visit() {
    cy.visit('/');
  }

  clickLoginMenu() {
    cy.get(this.getLoginMenuSelector()).contains('Đăng nhập').click();
    cy.get(this.getPopupSelector()).should('be.visible', { timeout: 6000 });
    cy.task('log', 'Clicked login menu and popup is visible.');
  }

  closePopup() {
    cy.get('body').then(($body) => {
      const popup = $body.find(this.getPopupSelector());
      const closeButton = $body.find('.xoo-el-close.xoo-el-icon-cross');
      if (popup.length > 0 && popup.is(':visible')) {
        if (closeButton.length > 0) {
          cy.get('span.xoo-el-close.xoo-el-icon-cross').click({ force: true });
          cy.get(this.getPopupSelector()).should('not.be.visible', { timeout: 6000 });
          cy.task('log', 'Popup closed successfully.');
        } else {
          cy.task('log', 'Close button not found, skipping close.');
        }
      } else {
        cy.task('log', 'Popup not found or already hidden, skipping close.');
      }
    });
  }

  checkLoginPopup() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.task('log', 'Login popup is visible.');
  }

  checkMenuHighlight() {
    cy.get(this.getLoginMenuSelector()).contains('Đăng nhập').should('have.class', 'current-menu-item');
    cy.task('log', 'Login menu item is highlighted.');
  }

  login(email, password) {
    cy.get(this.getPopupSelector()).should('be.visible');
    if (email) cy.get('input[name="xoo-el-username"]').type(email);
    if (password) cy.get('input[name="xoo-el-password"]').type(password);
    cy.get('.xoo-el-login-btn').click();
    cy.task('log', `Login attempted with email: ${email}`);
  }

  checkLoginSuccess(role) {
    if (role === 'customer') {
      cy.url().should('include', '/shop');
      cy.task('log', 'Customer login successful, redirected to /shop.');
    } else if (role === 'admin') {
      cy.url().should('include', '/shop');
      cy.get('#wpadminbar').should('be.visible');
      cy.task('log', 'Admin login successful, redirected to /shop with admin bar visible.');
    }
  }

   checkLoginLayout() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('.xoo-el-header li').contains('Đăng nhập tài khoản').should('be.visible');
    cy.get('input[name="xoo-el-username"]').should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').should('be.visible');
    cy.get('label.xoo-el-form-label').should('be.visible').within(() => {
      cy.get('input[name="xoo-el-rememberme"]').should('have.attr', 'type', 'checkbox').and('have.attr', 'value', 'forever');
      cy.get('span').contains('Nhớ mật khẩu').should('be.visible');
    });
    cy.get('.xoo-el-lostpw-tgr').contains('Quên mật khẩu?').should('be.visible');
    cy.get('.xoo-el-login-btn').should('be.visible');
    
    cy.task('log', 'Login layout verified, including remember me checkbox.');
  }

  hoverLoginButton() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('.xoo-el-login-btn').trigger('mouseover');
    cy.get('.xoo-el-login-btn').should('have.css', 'background-color');
    cy.task('log', 'Hovered over login button.');
  }

  hoverForgotPassword() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('.xoo-el-lostpw-tgr').trigger('mouseover');
    cy.get('.xoo-el-lostpw-tgr').should('have.css', 'color');
    cy.task('log', 'Hovered over forgot password link.');
  }

  checkUsernameDefault() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('input[name="xoo-el-username"]').should('have.value', '');
    cy.get('input[name="xoo-el-username"]').should('have.attr', 'placeholder', 'Username / Email');
    cy.task('log', 'Username field default state verified.');
  }

  checkUsernameRequired(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo-el-username"]').should('have.focus');
    cy.task('log', `Username required error: ${errorMsg}`);
  }

  checkPasswordDefault() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('have.value', '');
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'placeholder', 'Password');
    cy.get('.xoo-aff-pwtog-show .fa-eye').should('be.visible');
    cy.task('log', 'Password field default state verified.');
  }

  checkPasswordRequired(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo-el-password"]').should('have.focus');
    cy.task('log', `Password required error: ${errorMsg}`);
  }

  checkPasswordMasked() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'password');
    cy.task('log', 'Password field is masked.');
  }

  togglePasswordVisibility() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('.xoo-aff-pwtog-show .fa-eye').click();
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'text');
    cy.get('.xoo-aff-pwtog-hide .fa-eye-slash').click();
    cy.get('input[name="xoo-el-password"]').should('have.attr', 'type', 'password');
    cy.task('log', 'Password visibility toggled.');
  }

  checkShortPassword(errorMsg) {
    cy.get('.xoo-el-notice').should('contain.text', errorMsg);
    cy.get('input[name="xoo-el-password"]').should('have.focus');
    cy.task('log', `Short password error: ${errorMsg}`);
  }

  pasteIntoField(field, value) {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get(field).invoke('val', value).trigger('input');
    cy.task('log', `Pasted value ${value} into field ${field}`);
  }

  checkErrorMessage(msg) {
    cy.get('.xoo-el-notice').should('contain.text', msg);
    cy.task('log', `Error message verified: ${msg}`);
  }

  checkRememberMe() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').check();
    cy.get('input[name="xoo-el-rememberme"]').should('be.checked');
    cy.task('log', 'Remember me checkbox checked.');
  }

  checkNoRememberMe() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('input[name="xoo-el-rememberme"]').should('not.be.checked');
    cy.task('log', 'Remember me checkbox not checked.');
  }

  clickForgotPassword() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('.xoo-el-lostpw-tgr').contains('Quên mật khẩu?').click();
    cy.task('log', 'Clicked forgot password link.');
  }

  checkForgotPasswordPage() {
    cy.get(this.getPopupSelector()).should('be.visible');
    cy.get('form.xoo-el-form-lostpw').should('be.visible');
    cy.task('log', 'Forgot password page displayed.');
  }
}

export default LoginPage;