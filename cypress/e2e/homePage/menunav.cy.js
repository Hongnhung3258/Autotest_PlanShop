import MenuNav from '../../pageObjects/MenuNav';

describe('Menu Navigation Functionality Tests', () => {
  const menuNav = new MenuNav();

  beforeEach(() => {
    cy.visitPage();
  });

  it('PS_042: Kiểm tra điều hướng từ menu "Trang chủ"', () => {
    menuNav.verifyHome();
  });

  it('PS_043: Kiểm tra điều hướng từ menu "Cửa hàng"', () => {
    menuNav.verifyShop();
  });

  it('PS_044: Kiểm tra điều hướng từ menu "Chăm sóc cây"', () => {
    menuNav.verifyPlantCare();
  });

  it('PS_045: Kiểm tra điều hướng từ menu "Liên hệ"', () => {
    menuNav.verifyContact();
  });
 
});