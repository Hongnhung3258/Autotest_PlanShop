import ForgotPasswordPage from '../../pageObjects/ForgotPasswordPage';

describe('Forgot Password Functionality Tests', () => {
  const forgotPasswordPage = new ForgotPasswordPage();

  beforeEach(() => {
    cy.visitPage();
    forgotPasswordPage.clickLoginMenu();
    forgotPasswordPage.clickForgotPassword();
  });

  afterEach(() => {
    cy.closePopup();
  });

  it('PS_039: Kiểm tra màn hình bố cục', () => {
    forgotPasswordPage.checkForgotPasswordLayout();
    cy.task('log', 'Forgot password layout verified.');
  });

  it('PS_040: Kiểm tra trường email là trường bắt buộc', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.emptyEmail.email);
      forgotPasswordPage.checkInvalidFieldEmail('Please fill out this field.', 'user_login');
    });
  });

  it('PS_041: Kiểm tra nhập Username/Email không hợp lệ/chưa đăng ký', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.nonRegisteredEmail.email);
      forgotPasswordPage.checkNoticeError('Tên người dùng hoặc e-mail không hợp lệ.');
    });
  });

  it.only('PS_042: Kiểm tra nhập Username/Email đã đăng ký', () => {
    cy.fixture('forgot').then((forgot) => {
      forgotPasswordPage.resetPassword(forgot.registeredEmail.email);
      forgotPasswordPage.pwrecovery();
    });
  });
});