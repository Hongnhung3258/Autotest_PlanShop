import LoginPage from '../../pageObjects/LoginPage';
import AccountMenu from '../../pageObjects/accountMenu';

describe('Account Menu Tests', () => {
  const loginPage = new LoginPage();
  const accountMenu = new AccountMenu();

  beforeEach(() => {
    cy.visitPage();
    loginPage.clickLoginMenu();
  });

  it.only('PS_056: Kiểm tra hiển thị mặc định', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
      accountMenu.verifyUsernameMenu();
    });
  });

  it('PS_057: Kiểm tra click "Tài khoản của tôi" từ menu', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
    });
    accountMenu.clickMyAccountMenu();
  });

  it('PS_058: Kiểm tra menu "Đăng xuất"', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
    });
    accountMenu.clickLogoutMenu();
    accountMenu.verifyLogoutSuccess();
  });

});
