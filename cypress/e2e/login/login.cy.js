import LoginPage from '../../pageObjects/LoginPage';

describe('Login Functionality Tests', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    loginPage.clickLoginMenu();
  });

  afterEach(() => {
    loginPage.closePopup();
  });

  it('PS_001: Kiểm tra hiển thị màn Đăng nhập', () => {
    loginPage.checkLoginPopup();
  });

  it('PS_002: Kiểm tra trạng thái menu', () => {
    loginPage.checkMenuHighlight();
  });

  it('PS_003: Đăng nhập với user là khách hàng (đã có tài khoản)', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
      loginPage.checkLoginSuccess('customer');
    });
  });

  it('PS_004: Đăng nhập với user là admin', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validAdmin.email, users.validAdmin.password);
      loginPage.checkLoginSuccess('admin');
    });
  });

  it('PS_005: Kiểm tra giao diện bố cục', () => {
    loginPage.checkLoginLayout();
  });

  it('PS_006: Kiểm tra enable button "Đăng nhập"', () => {
    loginPage.hoverLoginButton();
  });

  it('PS_007: Kiểm tra enable button "Quên mật khẩu?"', () => {
    loginPage.hoverForgotPassword();
  });

  it('PS_008: Kiểm tra hiển thị giá trị mặc định (trườngUsername)', () => {
    loginPage.checkUsernameDefault();
  });

  it('PS_009: Kiểm tra trường Username là bắt buộc', () => {
    loginPage.login('', '');
    loginPage.checkUsernameRequired('Please fill out this field.');
  });

  it('PS_010: Kiểm tra khi nhập các ký tự đặc biệt (trường Username)', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.specialCharUser.email, users.specialCharUser.password);
      loginPage.checkErrorMessage('Email hoặc tên người dùng không đúng.');
    });
  });

  it('PS_011: Kiểm tra khi nhập các thẻ HTML (trường Username)', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.htmlTagUser.email, users.htmlTagUser.password);
      loginPage.checkErrorMessage('Email hoặc tên người dùng không đúng');
    });
  });

  it('PS_012: Kiểm tra paste nội dung vào trường Username', () => {
    loginPage.pasteIntoField('input[name="xoo-el-username"]', 'test@example.com');
    cy.get('input[name="xoo-el-username"]').should('have.value', 'test@example.com');
  });

  it('PS_013: Kiểm tra hiển thị giá trị mặc định (trường Password)', () => {
    loginPage.checkPasswordDefault();
  });

  it('PS_014: Kiểm tra trường Password là bắt buộc', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, '');
      loginPage.checkPasswordRequired('Please fill out this field.');
    });
  });

  it('PS_015: Kiểm tra mã hóa mật khẩu', () => {
    loginPage.checkPasswordMasked();
  });

  it('PS_016: Kiểm tra click vào icon mắt', () => {
    loginPage.togglePasswordVisibility();
  });

  it('PS_017: Kiểm tra paste nội dung vào Password', () => {
    loginPage.pasteIntoField('input[name="xoo-el-password"]', 'password123');
    cy.get('input[name="xoo-el-password"]').should('have.value', 'password123');
    loginPage.checkPasswordMasked();
  });

  it('PS_018: Kiểm tra để trống Username và Password', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.emptyUser.email, users.emptyUser.password);
     loginPage.checkErrorMessage('Nhập thông tin trước khi đăng nhập');
    });
  });

  it('PS_019: Kiểm tra chỉ nhập Username, không nhập Password', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, '');
      loginPage.checkPasswordRequired('Please fill out this field.');
    });
  });

  it('PS_020: Kiểm tra chỉ nhập Password, không nhập Username', () => {
    cy.fixture('users').then((users) => {
      loginPage.login('', users.validCustomer.password);
      loginPage.checkUsernameRequired('Please fill out this field.');
    });
  });

  it('PS_021: Kiểm tra nhập username hợp lệ nhưng sai mật khẩu', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.invalidPassword.email, users.invalidPassword.password);
      loginPage.checkErrorMessage('Mật khẩu không đúng');
    });
  });

  it('PS_022: Kiểm tra nhập đúng username/email và password', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
      loginPage.checkLoginSuccess('customer');
    });
  });

  it('PS_023: Kiểm tra tích chọn Remember me', () => {
    cy.fixture('users').then((users) => {
      loginPage.checkRememberMe();
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
      loginPage.closePopup();
      loginPage.visit();
      loginPage.clickLoginMenu();
      cy.get('input[name="xoo-el-username"]').should('have.value', users.validCustomer.email);
    });
  });

  it('PS_024: Kiểm tra không tích chọn Remember me', () => {
    cy.fixture('users').then((users) => {
      loginPage.checkNoRememberMe();
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
      loginPage.closePopup();
      loginPage.visit();
      loginPage.clickLoginMenu();
      cy.get('input[name="xoo-el-username"]').should('have.value', '');
    });
  });

  it('PS_025: Kiểm tra click "Forgot Password"', () => {
    loginPage.clickForgotPassword();
    loginPage.checkForgotPasswordPage();
  });
});