import CheckoutPage from '../pageObjects/CheckoutPage';
import ShopPage from '../pageObjects/ShopPage';
import LoginPage from '../pageObjects/LoginPage';
import Payment from '../pageObjects/Payment';

describe('Checkout Page Tests', () => {
    const checkoutPage = new CheckoutPage();
    const loginPage = new LoginPage();

    beforeEach(() => {
        cy.visitPage();
        loginPage.clickLoginMenu();
        cy.fixture('users').then((users) => {
            loginPage.login(users.checkoutUser.email, users.checkoutUser.password);
        });
        cy.visitCheckoutPage();
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    })

    it('PS_0102: Kiểm tra bố cục màn hình "Thanh toán"', () => {
        checkoutPage.verifyCheckoutPage();
    });
    
    it('PS_103: Kiểm tra màn hình bố cục "Thông tin thanh toán"', () => {
        checkoutPage.verifyBillingInformationLayout();
    });

    it('PS_104: Kiểm tra màn hình bố cục "Đơn hàng của bạn"', () => {
        checkoutPage.verifyOrderReviewLayout();
    });

    it('PS_105: Kiểm tra hiển thị nhập trường bắt buộc', () => {
       checkoutPage.verifyRequiredFieldValidation();
    });

    it('PS_106: Kiểm tra khi không tick vào "Tôi đã đọc và đồng ý với trang web [điều khoản]"', () => {
        checkoutPage.verifyTermsAndConditionsRequired();
    });

    it('PS_107: Kiểm tra tick vào "Giao hàng đến một địa chỉ khác"', () => {
        checkoutPage.verifyShipToDifferentAddress();
    });

    it('PS_108: Kiểm tra click vào [chính sách riêng tư]', () => {
        checkoutPage.verifyPrivacyPolicyLink();
    });
});

describe('Payment Method Tests', () => {
    const loginPage = new LoginPage();
    const shopPage = new ShopPage();
    const payment = new Payment();

    beforeEach(() => {
        cy.visitShopPage();
        shopPage.addProductToCart2();
        loginPage.clickLoginMenu();
        cy.fixture('users').then((users) => {
            loginPage.login(users.checkoutUserNoProduct.email, users.checkoutUserNoProduct.password);
        });
        
        cy.visitCheckoutPage();
        cy.fixture('users').then((users) => {
            payment.fillBillingInformation(
                users.checkoutUserNoProduct.name, 
                users.checkoutUserNoProduct.phone,
                users.checkoutUserNoProduct.address
            );
        });
    });

    it('PS_109: Kiểm tra thanh toán với phương thức "Chuyển khoản ngân hàng trực tiếp"', () => {
        payment.testBankTransferPayment();
    });

    it('PS_110: Kiểm tra thanh toán với phương thức "Thanh toán khi nhận hàng"', () => {
        payment.testCODPayment();
    });

    it('PS_111: Kiểm tra thanh toán với phương thức "Thanh toán qua MoMo"', () => {
        payment.testMoMoPayment();
    });

    it('PS_112: Kiểm tra thanh toán với phương thức "Chuyển khoản ngân hàng (Quét QR)"', () => {
        payment.testVietQRPayment();
    });
});
