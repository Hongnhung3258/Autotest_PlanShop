import ForgotPasswordPage from '../../pageObjects/ForgotPasswordPage';
import LoginPage from '../../pageObjects/LoginPage';

describe('Forgot Password Functionality Tests', () => {
  const forgotPasswordPage = new ForgotPasswordPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visitPage();
    loginPage.clickLoginMenu();
    forgotPasswordPage.clickForgotPassword();
  });

  afterEach(() => {
    cy.closePopup();
  });

  it('PS_038: Kiểm tra màn hình bố cục', () => {
    forgotPasswordPage.checkForgotPasswordLayout();
  });

  it('PS_039: Kiểm tra trường email là trường bắt buộc', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.emptyEmail.email);
      forgotPasswordPage.checkInvalidFieldEmail('Please fill out this field.', 'user_login');
    });
  });

  it('PS_040: Kiểm tra nhập Username/Email không hợp lệ/chưa đăng ký', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.nonRegisteredEmail.email);
      forgotPasswordPage.checkNoticeError('Tên người dùng hoặc e-mail không hợp lệ.');
    });
  });

  it('PS_041: Kiểm tra nhập Username/Email đã đăng ký', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.registeredEmail.email);
      forgotPasswordPage.pwrecovery();
    });
  });
});