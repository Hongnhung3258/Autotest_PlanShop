import RegisterPage from '../../pageObjects/RegisterPage';

describe('Register Functionality Tests', () => {
  const registerPage = new RegisterPage();

  beforeEach(() => {
    registerPage.visit();
    registerPage.clickLoginMenu();
    registerPage.switchToRegister();
  });

  afterEach(() => {
    registerPage.closePopup();
  });

  it.only('PS_026: Kiểm tra điều hướng đến màn Đăng ký', () => {
    registerPage.checkRegisterPopup();
    cy.task('log', 'Register popup is visible.');
  });

  it('PS_027: Kiểm tra trạng thái menu', () => {
    registerPage.checkMenuHighlight();
    cy.task('log', 'Register menu item is highlighted.');
  });

  it('PS_028: Kiểm tra giao diện bố cục', () => {
    registerPage.checkRegisterLayout();
    cy.task('log', 'Register layout verified.');
  });

  it('PS_029: Kiểm tra hiển thị nhập trường bắt buộc', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.emptyUser.email, users.emptyUser.firstName, users.emptyUser.lastName, users.emptyUser.password, users.emptyUser.confirmPassword, false);
      registerPage.checkRequiredFields('Vui lòng điền vào trường này');
      cy.task('log', 'Required fields error verified.');
    });
  });

  it('PS_030: Kiểm tra nhập email không đúng định dạng', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.invalidEmailUser.email, users.invalidEmailUser.firstName, users.invalidEmailUser.lastName, users.invalidEmailUser.password, users.invalidEmailUser.confirmPassword);
      registerPage.checkInvalidEmail('Vui lòng bao gồm "@" trong địa chỉ email');
      cy.task('log', 'Invalid email error verified.');
    });
  });

  it('PS_031: Kiểm tra nhập email đã tồn tại', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.existingEmailUser.email, users.existingEmailUser.firstName, users.existingEmailUser.lastName, users.existingEmailUser.password, users.existingEmailUser.confirmPassword);
      registerPage.checkExistingEmail('Email đã tồn tại');
      cy.task('log', 'Existing email error verified.');
    });
  });

  it('PS_032: Kiểm tra hiển thị giá trị mặc định First Name', () => {
    registerPage.checkFirstNameDefault();
    cy.task('log', 'First Name default state verified.');
  });

  it('PS_033: Kiểm tra First Name là trường bắt buộc', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.newUser.email, '', users.newUser.lastName, users.newUser.password, users.newUser.confirmPassword);
      registerPage.checkFirstNameRequired('Vui lòng điền vào trường này');
      cy.task('log', 'First Name required error verified.');
    });
  });

  it('PS_034: Kiểm tra hiển thị giá trị mặc định Last Name', () => {
    registerPage.checkLastNameDefault();
    cy.task('log', 'Last Name default state verified.');
  });

  it('PS_035: Kiểm tra Last Name là trường bắt buộc', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.newUser.email, users.newUser.firstName, '', users.newUser.password, users.newUser.confirmPassword);
      registerPage.checkLastNameRequired('Vui lòng điền vào trường này');
      cy.task('log', 'Last Name required error verified.');
    });
  });

  it('PS_036: Kiểm tra hiển thị giá trị mặc định Password', () => {
    registerPage.checkPasswordDefault();
    cy.task('log', 'Password default state verified.');
  });

  it('PS_037: Kiểm tra Password là trường bắt buộc', () => {
    cy.fixture('register').then((users) => {
      registerPage.register(users.newUser.email, users.newUser.firstName, users.newUser.lastName, '', users.newUser.confirmPassword);
      registerPage.checkPasswordRequired('Vui lòng điền vào trường này');
      cy.task('log', 'Password required error verified.');
    });
  });
});