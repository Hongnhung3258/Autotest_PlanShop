import CartPage from '../pageObjects/CartPage';
import LoginPage from '../pageObjects/LoginPage';
import ShopPage from '../pageObjects/ShopPage';

describe('Cart page tests', () => {
    const cartPage = new CartPage();
    const loginPage = new LoginPage();
    const shopPage = new ShopPage();

    beforeEach(() => {
        cy.visitShopPage();
    });

    it('PS_067: Kiểm tra click vào giỏ hàng khi chưa có sản phẩm nào', () => {
        cy.visitCartPage();
        cartPage.verifyEmptyCartDisplay();
    });

    it('PS_068: Kiểm tra click button "Quay trở lại cửa hàng"', () => {
        cy.visitCartPage();
        cartPage.clickReturnToShop();
    });

    describe('Shopping cart table tests', () => {
        it('PS_069: Kiểm tra hiển thị mặc định giỏ hàng có sản phẩm', () => {
            shopPage.addMultipleProductsToCart();
            cy.visitCartPage();
            cartPage.verifyCartWithProductsDisplay();
        });

        it('PS_070: Kiểm tra click nút "+"', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.clickPlusButton();
        });

        it('PS_071: Kiểm tra click nút "-" khi giỏ hàng có 1 sản phẩm', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.clickMinusButtonSingleProduct();
        });

        it('PS_072: Kiểm tra click nút "-" khi giỏ hàng có nhiều sản phẩm hoặc sản phẩm có số lượng sản phẩm >1', () => {
            shopPage.addMultipleProductsToCart();
            cy.visitCartPage();
            cartPage.clickMinusButtonMultipleProducts();
        });

        it('PS_073: Xóa sản phẩm khi giỏ hàng có 1 sản phẩm', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.removeProductSingleItem();
        });

        it('PS_074: Xóa sản phẩm khi giỏ hàng có nhiều sản phẩm', () => {
            shopPage.addMultipleProductsToCart();
            cy.visitCartPage();
            cartPage.removeProductMultipleItems();
        });

        it('PS_075: Kiểm tra click nút "Khôi phục?"', () => {
            shopPage.addMultipleProductsToCart();
            cy.visitCartPage();
            cartPage.clickUndoLink();
        });

        it('PS_076: Kiểm tra không nhập mã giảm giá', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cy.fixture('coupon').then((coupon) => {
                cartPage.applyEmptyCoupon(coupon.emptyCoupon.coupon);
            });
        });

        it('PS_077: Kiểm tra nhập đúng mã giảm giá', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            
            cy.fixture('coupon').then((coupon) => {
                cartPage.applyValidCoupon(coupon.validCoupon.coupon);
            });
        });

        it('PS_078: Kiểm tra nhập sai mã giảm giá', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            
            cy.fixture('coupon').then((coupon) => {
                cartPage.applyInvalidCoupon(coupon.invalidCoupon.coupon);
            });
        });
    });

    describe('Total cart tests', () => {
        it('PS_079: Kiểm tra hiển thị phần tổng cộng giỏ hàng', () => {
            shopPage.addMultipleProductsToCart();
            cy.visitCartPage();
            cartPage.verifyCartTotalsSection();
        });

        it('PS_080: Kiểm tra click nút "Đổi địa chỉ"', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.clickChangeAddress();
        });

        it('PS_081: Kiểm tra click nút "Tiến hành thanh toán" khi chưa đăng nhập', () => {
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.clickCheckoutNotLoggedIn();
        });

        it.only('PS_082: Kiểm tra click nút "Tiến hành thanh toán" khi đã đăng nhập', () => {
            loginPage.clickLoginMenu();
            cy.fixture('users').then((users) => {
                loginPage.login(users.cartUser.email, users.cartUser.password);
            });
            shopPage.addProductToCart();
            cy.visitCartPage();
            cartPage.clickCheckoutLoggedIn();
        }); 
    });
});
