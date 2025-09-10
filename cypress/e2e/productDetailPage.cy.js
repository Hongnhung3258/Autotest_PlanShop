import ProductDetailPage from "../pageObjects/ProductDetailPage";
import LoginPage from "../pageObjects/LoginPage";

describe('Product Details Tests', () => {
    const loginPage = new LoginPage();
    const productDetail = new ProductDetailPage();

    beforeEach(() => {
        cy.visitShopPage();
    });

    it.only('PS_113: Kiểm tra hiển thị thông tin sản phẩm không có lựa chọn', () => {
        productDetail.verifyProductWithoutVariations();
    });

    it('PS_114: Kiểm tra hiển thị thông tin sản phẩm có lựa chọn', () => {
        productDetail.verifyProductWithVariations();
    });

    it('PS_115: Kiểm tra xóa lựa chọn sản phẩm', () => {
        productDetail.verifyRemoveProductVariations();
    });

    it('PS_116: Kiểm tra click tab đánh giá khi chưa đăng nhập', () => {
        productDetail.verifyReviewTabNotLoggedIn();
    });

    it('PS_117: Kiểm tra Click các tab Mô tả / Thông tin bổ sung / Đánh giá', () => {
        loginPage.clickLoginMenu();
        cy.fixture('users').then((users) => {
            loginPage.login(users.cartUser.email, users.cartUser.password);
        });
        
        productDetail.verifyAllTabsWhenLoggedIn();
    });

    it('PS_118: Kiểm tra viết đánh giá', () => {
        loginPage.clickLoginMenu();
        cy.fixture('users').then((users) => {
            loginPage.login(users.checkoutUser.email, users.checkoutUser.password);
        });
        
        productDetail.verifyWriteReview();
    });
});