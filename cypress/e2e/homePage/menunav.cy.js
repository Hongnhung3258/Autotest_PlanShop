import MenuNavPage from '../../pageObjects/MenuNavPage';

describe('Menu Navigation Functionality Tests', () => {
  const menuNavPage = new MenuNavPage();

  beforeEach(() => {
    cy.visitPage();
  });

  it('PS_043: Kiểm tra điều hướng từ menu "Trang chủ"', () => {
    menuNavPage.verifyHome();
  });

  it('PS_044: Kiểm tra điều hướng từ menu "Cửa hàng"', () => {
    menuNavPage.verifyShop();
  });

  it('PS_045: Kiểm tra điều hướng từ menu "Chăm sóc cây"', () => {
    menuNavPage.verifyPlantCare();
  });

  it('PS_046: Kiểm tra điều hướng từ menu "Liên hệ"', () => {
    menuNavPage.verifyContact();
  });
 
});