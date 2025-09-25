import BasePage from './BasePage.js';

class AccountMenu extends BasePage {
  constructor() {
    super();
    this.loginMenuSelector = '#menu-item-1194';
    this.usernameMenuSelector = '#menu-item-1171';
    this.userSubmenuSelector = '#menu-item-1171 ul';
    this.myAccountSelector = '#menu-item-1196';
    this.logoutMenuSelector = '#menu-item-1175';
    this.accountHeadingSelector = 'h2';
    this.myAccountText = 'Tài khoản của tôi';
    this.logoutText = 'Đăng xuất';
    this.accountPageHeadingText = 'Tài khoản của bạn';
  }

  verifyUsernameMenu() {
    this.hoverElement(this.usernameMenuSelector);
    this.verifyElementVisible(this.userSubmenuSelector);
    this.verifyElementContainsText(this.myAccountSelector, this.myAccountText);
    this.verifyElementContainsText(this.logoutMenuSelector, this.logoutText);
  }

  clickMyAccountMenu() {
    this.hoverElement(this.usernameMenuSelector);
    this.verifyElementVisible(this.userSubmenuSelector);
    this.clickButton(this.myAccountSelector);
    this.verifyCurrentUrl('/my-account');
    this.verifyElementContainsText(this.accountHeadingSelector, this.accountPageHeadingText);
  }

  clickLogoutMenu() {
    this.hoverElement(this.usernameMenuSelector);
    this.verifyElementVisible(this.userSubmenuSelector);
    this.clickButton(this.logoutMenuSelector);
  }

  verifyLogoutSuccess() {
    cy.url().should('eq', 'https://planshop.com/');
    cy.get(this.usernameMenuSelector).should('not.exist');
    this.verifyElementContainsText(this.loginMenuSelector, 'Đăng nhập');
  }
}

export default AccountMenu;