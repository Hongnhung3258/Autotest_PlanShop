import RegisterPage from '../../pageObjects/RegisterPage';

describe('Register Functionality Tests', () => {
  const registerPage = new RegisterPage();

  beforeEach(() => {
    cy.visitPage();
    registerPage.clickLoginMenu();
    registerPage.switchToRegister();
  });

  afterEach(() => {
    cy.closePopup();
  });

  it.only('PS_026: Kiểm tra điều hướng đến màn Đăng ký', () => {
    registerPage.checkRegisterPopup();
  });

  it('PS_027: Kiểm tra trạng thái menu', () => {
    registerPage.checkMenuHighlight();
  });

  it('PS_028: Kiểm tra giao diện bố cục', () => {
    registerPage.checkRegisterLayout();
  });

  it('PS_029: Kiểm tra hiển thị nhập trường bắt buộc', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(register.emptyUser.email, register.emptyUser.firstName, register.emptyUser.lastName, register.emptyUser.password, register.emptyUser.confirmPassword, false);
      registerPage.checkRequiredFields('Please fill out this field.');
    });
  });

  it('PS_030: Kiểm tra nhập email không có @', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(register.invalidEmailUser.email, '', '', '', '');
      registerPage.checkInvalidFieldEmail(`Please include an '@' in the email address. ${register.invalidEmailUser.email} is missing an '@'.`);
    });
  });

  it('PS_031: Kiểm tra nhập email không có phần sau @', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(register.invalidEmail1User.email, '', '', '', '');
      registerPage.checkInvalidFieldEmail(`Please enter a part following '@'. ${register.invalidEmail1User.email} is incomplete.`);
    });
  });

  it('PS_032: Kiểm tra khi nhập mật khẩu xác nhận không chính xác', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(
        register.mismatchPasswordUser.email,
        register.mismatchPasswordUser.firstName,
        register.mismatchPasswordUser.lastName,
        register.mismatchPasswordUser.password,
        register.mismatchPasswordUser.confirmPassword
      );
      registerPage.checkNoticeError("Passwords don't match");
    });
  });

  it('PS_033: Kiểm tra khi không click vào chính sách', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(
        register.newUser.email,
        register.newUser.firstName,
        register.newUser.lastName,
        register.newUser.password,
        register.newUser.confirmPassword,
        false
      );
      registerPage.checkNoticeError('Please check The Terms and Conditions.');
    });
  });

  it('PS_034: Kiểm tra khi nhập mật khẩu ít hơn 6 ký tự', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(
        register.shortPasswordUser.email,
        register.shortPasswordUser.firstName,
        register.shortPasswordUser.lastName,
        register.shortPasswordUser.password,
        register.shortPasswordUser.confirmPassword
      );
      registerPage.checkNoticeError('Password needs to be minimum 6 characters');
    });
  });

  it('PS_035: Kiểm tra đăng ký với email đã tồn tại', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(register.existingEmailUser.email, register.existingEmailUser.firstName, register.existingEmailUser.lastName, register.existingEmailUser.password, register.existingEmailUser.confirmPassword);
      registerPage.checkNoticeError('Một tài khoản đã được đăng ký bằng địa chỉ email của bạn. Vui lòng đăng nhập.');
    });
  });

  it('PS_036: Kiểm tra click vào "Chính sách bảo mật"', () => {
    registerPage.openPrivacyPolicy();
    cy.task('log', 'Privacy Policy link click verified.');
  });

  it('PS_037: Kiểm tra đăng ký thành công', () => {
    cy.fixture('register').then((register) => {
      registerPage.register(
        register.newUser.email,
        register.newUser.firstName,
        register.newUser.lastName,
        register.newUser.password,
        register.newUser.confirmPassword
      );
      registerPage.registerSuccess('Đăng ký thành công!');
    });
  });
});