import MenuNav from '../pageObjects/MenuNav';
import SearchMenu from '../pageObjects/SearchMenu';
import LoginPage from '../pageObjects/LoginPage';
import AccountMenu from '../pageObjects/accountMenu';
import CartMenu from "../pageObjects/CartMenu";
import ShopPage from '../pageObjects/ShopPage';

describe('Home page tests', () => {
  const loginPage = new LoginPage();
  const menuNav = new MenuNav();
  const shopPage = new ShopPage();
  const accountMenu = new AccountMenu();
  const cartMenu = new CartMenu();
  const searchPage = new SearchMenu();

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

  describe('Search menu tests', () => {
    beforeEach(() => {
      searchPage.clickInputSearch();
    });

    it('PS_046: Kiểm tra hiển thị mặc định ô tìm kiếm', () => {
      searchPage.checkSearchLayout();
    });

    it('PS_047: Kiểm tra nhập từ khóa tìm kiếm không tồn tại', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.invalidKeyword.keyword);
        searchPage.keywordNotExits(search.invalidKeyword.keyword, {timeout: 4000});
      });
    });

    it('PS_048: Kiểm tra tìm kiếm với từ khóa hợp lệ', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.validKeyword.keyword);
        searchPage.verifySearchResults();
      });
    });

    it('PS_049: Kiểm tra nhập tìm kiếm toàn space hoặc ký tự đặc biệt', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.spaceKeyword.keyword);
        searchPage.verifyNoResults();
      });
    });

    it('PS_050: Kiểm tra khi nhập đúng 1 phần từ khóa', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
        searchPage.verifySearchResults();
        searchPage.verifyKeywordMatchInResults(search.exactlyPartKeyword.keyword);
      });
    });

    it('PS_051: Kiểm tra click vào 1 sản phẩm trong danh sách', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.validKeyword.keyword);
        searchPage.clickFirstProduct();
      });
    });

    it('PS_052: Kiểm tra click nút "Thêm vào giỏ hàng"', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.validKeyword.keyword);
        searchPage.clickAddToCart();
      });
    });

    it('PS_053: Kiểm tra click nút "Lựa chọn tùy chọn"', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
        searchPage.clickSelectOption();
      });
    });

    it('PS_054: Kiểm tra click "Xem tất cả sản phẩm"', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
        searchPage.clickViewAllProducts();
      });
    });
    
    it('PS_055: Kiểm tra kết quả tìm kiếm', () => {
      cy.fixture('search').then((search) => {
        searchPage.searchKeyword(search.validKeyword.keyword);
        searchPage.verifyResultPage(search.validKeyword.keyword);
      });
    });
  });
 
  describe('Account menu tests', () => {
    beforeEach(() => {
      loginPage.clickLoginMenu();
    });

    it('PS_056: Kiểm tra hiển thị mặc định', () => {
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

  describe('Cart menu tests', () => {
    beforeEach(() => {
      cy.visitShopPage();
    });

    it('PS_059: Kiểm tra hover vào giỏ hàng khi chưa có sản phẩm nào', () => {
      cartMenu.verifyCartIsEmpty();
      cartMenu.verifyEmptyCart();
    });

    it('PS_060: Kiểm tra click button "Tiếp tục mua sắm"', () => {
      cartMenu.verifyCartIsEmpty();
      cartMenu.clickContinueShopping();
    });

    it('PS_061: Kiểm tra hover vào giỏ hàng khi có sẵn sản phẩm', () => {
      shopPage.addProductToCart();
      cartMenu.verifyCartWithProducts();
    });

    it('PS_062: Kiểm tra button "Xem giỏ hàng"', () => {
      shopPage.addProductToCart();
      cartMenu.clickViewCart();
    });

    it('PS_063: Kiểm tra button "Thanh toán" khi chưa đăng nhập', () => {
      shopPage.addProductToCart();
      cartMenu.clickCheckoutNotLogIn();
    });

    it('PS_064: Kiểm tra button "Thanh toán" khi đã chưa đăng nhập', () => {
      loginPage.clickLoginMenu();
      cy.fixture('users').then((users) => {
        loginPage.login(users.validCustomer.email, users.validCustomer.password);
        shopPage.addProductToCart();
        cartMenu.clickCheckout();
      });
    });

    it('PS_065: Xóa sản phẩm trong giỏ hàng có một sản phẩm', () => {
      shopPage.addProductToCart();
      cartMenu.removeCart1Item();
    });

    it('PS_066: Xóa sản phẩm trong giỏ hàng có nhiều sản phẩm sản phẩm', () => {
      shopPage.addMultipleProductsToCart();
      cartMenu.removeCartMultiItem();
    });
  });
});