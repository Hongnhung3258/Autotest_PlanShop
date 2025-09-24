import BasePage from './BasePage';

class CheckoutPage extends BasePage {
    constructor() {
        super();
        
        // Page selectors
        this.checkoutPageSelector = '#post-217';
        this.validationErrorSelector = '.woocommerce-error, .woocommerce-invalid';
        this.customerDetailsSelector = '#customer_details';
        this.orderReviewSelector = '#order_review';
        this.couponFormSelector = '.woocommerce-form-coupon-toggle';
        this.enterCouponLinkSelector = '.woocommerce-form-coupon-toggle a';
        
        // Billing information selectors
        this.billingSelector = '.woocommerce-billing-fields';
        this.billingNameFieldSelector = '#billing_last_name_field';
        this.billingPhoneFieldSelector = '#billing_phone_field';
        this.billingEmailFieldSelector = '#billing_email_field';
        this.billingStateSelector = '#billing_state';
        this.billingCitySelector = '#billing_city';
        this.billingAddressFieldSelector = '#billing_address_1_field';
        this.orderNotesSelector = '#order_comments';
        
        // Input selectors
        this.inputNameSelector = '#billing_last_name';
        this.inputPhoneSelector = '#billing_phone';
        this.inputEmailSelector = '#billing_email';
        this.inputAddressSelector = '#billing_address_1';
        
        // Shipping selectors
        this.shipToDifferentCheckboxSelector = '#ship-to-different-address-checkbox';
        this.shipToDifferentTitleSelector = '#ship-to-different-address';
        this.shippingAddressFieldsSelector = '.shipping_address';
        this.shippingNameFieldSelector = '#shipping_last_name_field';
        this.shippingPhoneFieldSelector = '#shipping_phone_field';
        this.shippingStateSelector = '#shipping_state';
        this.shippingCitySelector = '#shipping_city';
        this.shippingAddressFieldSelector = '#shipping_address_1_field';
        
        // Order review selectors
        this.orderReviewTitleSelector = '#order_review_heading';
        this.orderTableSelector = '.woocommerce-checkout-review-order-table';
        this.productRowsSelector = '.cart_item';
        this.subtotalRowSelector = '.cart-subtotal';
        this.shippingCostRowSelector = '.woocommerce-shipping-totals';
        this.totalSelector = '.order-total';
        
        // Payment selectors
        this.paymentSectionSelector = '#payment';
        this.bankTransferSelector = '#payment_method_bacs';
        this.codPaymentSelector = '#payment_method_cod';
        this.momoPaymentSelector = '#payment_method_momo';
        this.vietqrPaymentSelector = '#payment_method_vietqr';
        
        // Terms and order selectors
        this.termsCheckboxSelector = '#terms';
        this.termsTextSelector = '.woocommerce-terms-and-conditions-checkbox-text';
        this.privacyPolicyLinkSelector = '.woocommerce-privacy-policy-link';
        this.placeOrderBtnSelector = '#place_order';
    }

    verifyCheckoutPage() {
        this.verifyCurrentUrl('/checkout');
        this.verifyElementVisible(this.checkoutPageSelector);
        this.verifyElementContainsText('h1', 'Thanh toán');
        this.verifyElementContainsText(this.couponFormSelector, 'Bạn có mã ưu đãi?');
        this.verifyElementContainsText(this.enterCouponLinkSelector, 'Ấn vào đây để nhập mã');
        this.verifyElementVisible(this.customerDetailsSelector);
        this.verifyElementVisible(this.orderReviewSelector);
    }

    verifyBillingInformationLayout() {
        this.verifyElementVisible(this.billingSelector);
        
        cy.get(this.billingSelector).within(() => {
        this.verifyElementContainsText('h3', 'Thông tin thanh toán');
        this.verifyElementContainsText(this.billingNameFieldSelector, 'Họ và tên');
        this.verifyElementContainsText(this.billingPhoneFieldSelector, 'Số điện thoại');
        this.verifyElementContainsText(this.billingEmailFieldSelector, 'Địa chỉ email');
        this.verifyElementVisible(this.billingStateSelector);
        this.verifyElementVisible(this.billingCitySelector);
        this.verifyElementContainsText(this.billingAddressFieldSelector, 'Địa chỉ');
        });
        
        cy.get(this.shipToDifferentCheckboxSelector)
        .should('be.visible')
        .and('have.attr', 'type', 'checkbox')
        .and('be.checked');
        
        this.verifyElementContainsText(this.shipToDifferentTitleSelector, 'Giao hàng đến một địa chỉ khác?');
        this.verifyElementVisible(this.orderNotesSelector);
    }

    verifyOrderReviewLayout() {
        this.verifyElementContainsText(this.orderReviewTitleSelector, 'Đơn hàng của bạn');
        this.verifyElementVisible(this.orderReviewSelector);
        
        cy.get(this.orderReviewSelector).within(() => {
        this.verifyElementVisible(this.orderTableSelector);
        
        cy.get(this.orderTableSelector).within(() => {
            this.verifyElementContainsText('thead th', 'Sản phẩm');
            this.verifyElementContainsText('thead th', 'Tạm tính');
            cy.get(this.productRowsSelector).should('have.length.at.least', 1);
            this.verifyElementContainsText(this.subtotalRowSelector, 'Tạm tính');
            this.verifyElementContainsText(this.shippingCostRowSelector, 'Vận chuyển');
            this.verifyElementContainsText(this.totalSelector, 'Tổng');
        });
        
        this.verifyElementVisible(this.paymentSectionSelector);
        
        cy.get(this.paymentSectionSelector).within(() => {
            this.verifyElementVisible(this.bankTransferSelector);
            this.verifyElementVisible(this.codPaymentSelector);
            this.verifyElementVisible(this.momoPaymentSelector);
            this.verifyElementVisible(this.vietqrPaymentSelector);
        });

        this.verifyElementVisible(this.privacyPolicyLinkSelector);
        
        cy.get(this.termsCheckboxSelector)
            .should('have.attr', 'type', 'checkbox')
            .and('not.be.checked');
            
        this.verifyElementContainsText(this.termsTextSelector, 'Tôi đã đọc và đồng ý với trang web [điều khoản]');
        this.verifyElementVisible(this.placeOrderBtnSelector);
        });
    }

    placeOrder() {
        this.clickButton(this.placeOrderBtnSelector);
    }

    verifyRequiredFieldValidation() {
        this.uncheckCheckbox(this.shipToDifferentCheckboxSelector);
        cy.get(this.inputNameSelector).clear();
        cy.get(this.inputPhoneSelector).clear();
        cy.get(this.inputEmailSelector).clear();
        cy.get(this.inputAddressSelector).clear();
        this.checkCheckbox(this.termsCheckboxSelector);

        this.verifyElementVisible(this.validationErrorSelector);

        cy.get(this.billingNameFieldSelector).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(this.billingPhoneFieldSelector).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(this.billingEmailFieldSelector).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(this.billingAddressFieldSelector).should('have.class', 'woocommerce-invalid-required-field');
    }

    verifyTermsAndConditionsRequired() {
        this.uncheckCheckbox(this.shipToDifferentCheckboxSelector);
        this.clearAndType(this.inputNameSelector, 'Nhungyanho');
        this.clearAndType(this.inputPhoneSelector, '0386849310');
        cy.selectByIndex(this.billingCitySelector, 12);
        this.clearAndType(this.inputAddressSelector, 'Số 32, ngõ 14, Ngô Quyền');
        this.placeOrder();
        
        this.verifyElementContainsText(this.validationErrorSelector, 'Vui lòng đọc và đồng ý điều khoản và điều kiện để tiếp tục đặt hàng.');
    }

    verifyShipToDifferentAddress() {
        cy.get(this.shipToDifferentCheckboxSelector).should('be.checked');
        this.verifyElementVisible(this.shippingAddressFieldsSelector);
        
        cy.get(this.shippingAddressFieldsSelector).within(() => {
        this.verifyElementContainsText(this.shippingNameFieldSelector, 'Tên đầy đủ của người nhận');
        this.verifyElementContainsText(this.shippingPhoneFieldSelector, 'Số điện thoại người nhận');
        this.verifyElementVisible(this.shippingStateSelector);
        this.verifyElementVisible(this.shippingCitySelector);
        this.verifyElementContainsText(this.shippingAddressFieldSelector, 'Địa chỉ');
        });
        
        this.uncheckCheckbox(this.shipToDifferentCheckboxSelector);
        cy.get(this.shippingAddressFieldsSelector).should('not.be.visible');
        this.checkCheckbox(this.shipToDifferentCheckboxSelector);
        this.verifyElementVisible(this.shippingAddressFieldsSelector);
    }

    verifyPrivacyPolicyLink() {
        this.scrollIntoView(this.privacyPolicyLinkSelector);
        
        cy.get(this.privacyPolicyLinkSelector)
        .should('be.visible')
        .and('contain.text', 'chính sách riêng tư')
        .and('have.attr', 'target', '_blank');
        
        cy.get(this.privacyPolicyLinkSelector).invoke('removeAttr', 'target').click();
        this.verifyCurrentUrl('/privacy-policy/');
        this.verifyElementContainsText('h2', 'Chính sách bảo mật');
    }
}

export default CheckoutPage;