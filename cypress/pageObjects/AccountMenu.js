const USERNAME_MENU_SEL = '#menu-item-1171';
const USER_SUBMENU_SEL = '#menu-item-1171 ul';
const MY_ACCOUNT_SEL = '#menu-item-1196';
const LOGOUT_MENU_SEL = '#menu-item-1175';

class AccountMenu {

  verifyUsernameMenu() {
    cy.get(USERNAME_MENU_SEL).realHover({timeout: 150});
    cy.get(USER_SUBMENU_SEL).should('be.visible')
    cy.get(MY_ACCOUNT_SEL).should('be.visible').and('contain.text', 'Tài khoản của tôi');
    cy.get(LOGOUT_MENU_SEL).should('be.visible').and('contain.text', 'Đăng xuất');
  }

  clickMyAccountMenu() {
    cy.get(USERNAME_MENU_SEL).realHover({timeout: 150});
    cy.get(USER_SUBMENU_SEL).should('be.visible')
    cy.get(MY_ACCOUNT_SEL).click();
    cy.url().should('include', '/my-account');
    cy.get('h2')
      .should('be.visible')
      .and('contain.text', 'Tài khoản của bạn');
  }

  clickLogoutMenu() {
    cy.get(USERNAME_MENU_SEL).realHover({timeout: 150});
    cy.get(USER_SUBMENU_SEL).should('be.visible')
    cy.get(LOGOUT_MENU_SEL).click();
  }

  verifyLogoutSuccess() {
    cy.url().should('eq', 'http://planshop.com/');
    cy.get(USERNAME_MENU_SEL).should('not.exist');
  }
}

export default AccountMenu;