import CartMenu from "../../pageObjects/CartMenu";
import LoginPage from '../../pageObjects/LoginPage';
import ShopPage from '../../pageObjects/ShopPage';

describe('Cart Menu Functionality Tests', () => {
  const cartMenu = new CartMenu();
  const loginPage = new LoginPage();
  const shopPage = new ShopPage();

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

  it.only('PS_064: Kiểm tra button "Thanh toán" khi đã chưa đăng nhập', () => {
    loginPage.clickLoginMenu();
    cy.fixture('users').then((users) => {
      loginPage.login(users.validCustomer.email, users.validCustomer.password);
    });
    shopPage.addProductToCart();
    cartMenu.clickCheckout();
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