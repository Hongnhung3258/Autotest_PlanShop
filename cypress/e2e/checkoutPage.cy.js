// checkoutPage.cy.js - Test implementation
import CheckoutPage from '../pageObjects/CheckoutPage';
import ShopPage from '../pageObjects/ShopPage';
import LoginPage from '../pageObjects/LoginPage';

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
    const checkoutPage = new CheckoutPage();
    const loginPage = new LoginPage();
    const shopPage = new ShopPage();

    beforeEach(() => {
        cy.visitPage();
        loginPage.clickLoginMenu();
        cy.fixture('users').then((users) => {
            loginPage.login(users.checkoutUser.email, users.checkoutUser.password);
        });
        cy.visitShopPage();
        shopPage.addProductToCart2();
        cy.visitCheckoutPage();
        cy.fixture('users').then((users) => {
            checkoutPage.fillBillingInformation({
                name: users.checkoutUser.name,
                phone: users.checkoutUser.phone,
                email: users.checkoutUser.email,
                address: users.checkoutUser.address
            });
        });
    });

    it.only('PS_109: Kiểm tra thanh toán với phương thức "Chuyển khoản ngân hàng trực tiếp"', () => {
        checkoutPage.tetBankTransferPayment();
    });

    it('PS_108: Kiểm tra thanh toán với phương thức "Thanh toán khi nhận hàng"', () => {
        checkoutPage.testCODPayment();
    });

    it('PS_109: Kiểm tra thanh toán với phương thức "Thanh toán qua MoMo"', () => {
        checkoutPage.testMoMoPayment();
    });

    it('PS_110: Kiểm tra thanh toán với phương thức "Chuyển khoản ngân hàng (Quét QR)"', () => {
        checkoutPage.testVietQRPayment();
    });
});

    describe('Complete Checkout Flow Tests', () => {
        it('PS_108: Kiểm tra quy trình checkout hoàn chỉnh', () => {
            cy.fixture('users').then((users) => {
                // Fill billing information
                checkoutPage.fillBillingInformation({
                    name: users.checkoutUser.name,
                    phone: users.checkoutUser.phone,
                    email: users.checkoutUser.email,
                    address: users.checkoutUser.address
                });

                // Fill shipping information
                checkoutPage.fillShippingInformation({
                    name: users.checkoutUser.shippingName,
                    phone: users.checkoutUser.shippingPhone,
                    address: users.checkoutUser.shippingAddress
                });

                // Select payment method
                checkoutPage.selectPaymentMethod('cod');

                // Accept terms and place order
                checkoutPage.acceptTermsAndConditions();
                checkoutPage.placeOrder();

                // Verify successful order placement
                cy.url().should('include', '/checkout/order-received');
                cy.contains('Cảm ơn bạn. Đơn hàng của bạn đã được nhận').should('be.visible');
            });
        });

        it('PS_109: Kiểm tra checkout với coupon code', () => {
            // Apply coupon first
            cy.get('.showcoupon').click();
            cy.get('#coupon_code').type('PLANSHOP5%');
            cy.get('button[name="apply_coupon"]').click();
            
            // Wait for coupon to be applied
            cy.get('.woocommerce-message').should('contain', 'Mã ưu đãi được áp dụng');

            // Continue with normal checkout flow
            cy.fixture('users').then((users) => {
                checkoutPage.fillBillingInformation({
                    name: users.checkoutUser.name,
                    phone: users.checkoutUser.phone,
                    email: users.checkoutUser.email,
                    address: users.checkoutUser.address
                });

                checkoutPage.selectPaymentMethod('cod');
                checkoutPage.acceptTermsAndConditions();
                checkoutPage.placeOrder();

                // Verify order placed with discount
                cy.url().should('include', '/checkout/order-received');
            });
        });
    });

