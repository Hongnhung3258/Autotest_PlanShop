const VALIDATION_ERROR_SEL = '.woocommerce-error, .woocommerce-invalid';
const CHECKOUT_PAGE_SEL = '#post-217';
const CUSTOMER_DETAILS_SEL = '#customer_details';
const ENTER_COUPON_LINK_SEL = '.woocommerce-form-coupon-toggle a';
const COUPON_FORM_SEL = '.woocommerce-form-coupon-toggle';

// Customer details
const BILLING_SEL = '.woocommerce-billing-fields';
const BILLING_NAME_SEL = '#billing_last_name_field';
const BILLING_PHONE_SEL = '#billing_phone_field';
const BILLING_EMAIL_SEL = '#billing_email_field';
const BILLING_STATE_SEL = '#billing_state';
const BILLING_CITY_SEL = '#billing_city';
const BILLING_ADDRESS_SEL = '#billing_address_1_field';
const ORDER_NOTES_SEL = '#order_comments';

const INPUT_NAME_SEL = '#billing_last_name';
const INPUT_PHONE_SEL = '#billing_phone';
const INPUT_EMAIL_SEL = '#billing_email';
const INPUT_ADDRESS_SEL = '#billing_address_1';

// Shipping information selectors
const SHIP_TO_DIFFERENT_CHECKBOX_SEL = '#ship-to-different-address-checkbox';
const SHIP_TO_DIFFERENT_TITLE_SEL = '#ship-to-different-address';
const SHIPPING_ADDRESS_FIELDS_SEL = '.shipping_address';
const SHIPPING_NAME_SEL = '#shipping_last_name_field';
const SHIPPING_PHONE_SEL = '#shipping_phone_field';
const SHIPPING_STATE_SEL = '#shipping_state';
const SHIPPING_CITY_SEL = '#shipping_city';
const SHIPPING_ADDRESS_SEL = '#shipping_address_1_field';

// Order review section selectors
const ORDER_REVIEW_SEL = '#order_review';
const ORDER_REVIEW_TITLE_SEL = '#order_review_heading';
const ORDER_TABLE_SEL = '.woocommerce-checkout-review-order-table';
const PRODUCT_ROWS_SEL = '.cart_item';
const SUBTOTAL_ROW_SEL = '.cart-subtotal';
const SHIPPING_COST_ROW_SEL = '.woocommerce-shipping-totals';
const TOTAL_SEL = '.order-total';

const PAYMENT_SECTION_SEL = '#payment';
const BANK_TRANSFER_SEL = '#payment_method_bacs';
const COD_PAYMENT_SEL = '#payment_method_cod';
const MOMO_PAYMENT_SEL = '#payment_method_momo';
const VIETQR_PAYMENT_SEL = '#payment_method_vietqr';

const TERMS_CHECKBOX_SEL = '#terms';
const TERMS_TEXT_SEL = '.woocommerce-terms-and-conditions-checkbox-text';
const PRIVACY_POLICY_LINK_SEL = '.woocommerce-privacy-policy-link';
const PLACE_ORDER_BTN_SEL = '#place_order';


class CheckoutPage {
    verifyCheckoutPage() {
        cy.url().should('include', '/checkout');
        cy.get(CHECKOUT_PAGE_SEL).should('be.visible');
        cy.get('h1').contains('Thanh toán');
        cy.get(COUPON_FORM_SEL).should('be.visible').contains('Bạn có mã ưu đãi?');
        cy.get(ENTER_COUPON_LINK_SEL).should('be.visible').contains('Ấn vào đây để nhập mã');
        cy.get(CUSTOMER_DETAILS_SEL).should('be.visible');
        cy.get(ORDER_REVIEW_SEL).should('be.visible');
    }

    verifyBillingInformationLayout() {
        cy.get(BILLING_SEL).should('be.visible').within(() => {
            cy.get('h3').contains('Thông tin thanh toán');
            cy.get(BILLING_NAME_SEL).should('be.visible').contains('Họ và tên');
            cy.get(BILLING_PHONE_SEL).should('be.visible').contains('Số điện thoại');
            cy.get(BILLING_EMAIL_SEL).should('be.visible').contains('Địa chỉ email');
            cy.get(BILLING_STATE_SEL).should('be.visible');
            cy.get(BILLING_CITY_SEL).should('be.visible');
            cy.get(BILLING_ADDRESS_SEL).should('be.visible').contains('Địa chỉ');
            cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).should('be.visible')
              .and('have.attr', 'type', 'checkbox')
              .and('be.checked');
            cy.get(SHIP_TO_DIFFERENT_TITLE_SEL).contains('Giao hàng đến một địa chỉ khác?');
            cy.get(ORDER_NOTES_SEL).should('be.visible');
        }); 
    }

    verifyOrderReviewLayout() {
        cy.get(ORDER_REVIEW_TITLE_SEL).should('contain.text', 'Đơn hàng của bạn');
        cy.get(ORDER_REVIEW_SEL).should('be.visible').within(() => {
            cy.get(ORDER_TABLE_SEL).should('be.visible').within(() => {
                cy.get('thead th').should('contain.text', 'Sản phẩm');
                cy.get('thead th').should('contain.text', 'Tạm tính');
                cy.get(PRODUCT_ROWS_SEL).should('have.length.at.least', 1);
                cy.get(SUBTOTAL_ROW_SEL).should('be.visible').contains('Tạm tính');
                cy.get(SHIPPING_COST_ROW_SEL).should('be.visible').contains('Vận chuyển');
                cy.get(TOTAL_SEL).should('be.visible').contains('Tổng');
            });
            
            cy.get(PAYMENT_SECTION_SEL).should('be.visible').within(() => {
                cy.get(BANK_TRANSFER_SEL).should('be.visible');
                cy.get(COD_PAYMENT_SEL).should('be.visible');
                cy.get(MOMO_PAYMENT_SEL).should('be.visible');
                cy.get(VIETQR_PAYMENT_SEL).should('be.visible');
            });

            cy.get(PRIVACY_POLICY_LINK_SEL).should('be.visible');
            cy.get(TERMS_CHECKBOX_SEL).should('have.attr', 'type', 'checkbox')
              .and('not.be.checked');
            cy.get(TERMS_TEXT_SEL).contains('Tôi đã đọc và đồng ý với trang web [điều khoản]');
            cy.get(PLACE_ORDER_BTN_SEL).should('be.visible');
        });
    }

    verifyRequiredFieldValidation() {
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).uncheck();
        cy.get(INPUT_NAME_SEL).clear().scrollIntoView();
        cy.get(INPUT_PHONE_SEL).clear().scrollIntoView();
        cy.get(INPUT_EMAIL_SEL).clear().scrollIntoView();
        cy.get(INPUT_ADDRESS_SEL).clear().scrollIntoView();
        cy.get(TERMS_CHECKBOX_SEL).check();
        this.placeOrder();

        cy.get(VALIDATION_ERROR_SEL).should('be.visible');

        cy.get(BILLING_NAME_SEL).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(BILLING_PHONE_SEL).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(BILLING_EMAIL_SEL).should('have.class', 'woocommerce-invalid-required-field');
        cy.get(BILLING_ADDRESS_SEL).should('have.class', 'woocommerce-invalid-required-field');
        
    }

    verifyTermsAndConditionsRequired() {
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).uncheck();
        cy.get(INPUT_NAME_SEL).clear().type('Nhungyanho');
        cy.get(INPUT_PHONE_SEL).clear().type('0386849310');
        cy.selectByIndex(BILLING_CITY_SEL, 12);
        cy.get(INPUT_ADDRESS_SEL).clear().type('Số 32, ngõ 14, Ngô Quyền');
        this.placeOrder();
        cy.get(VALIDATION_ERROR_SEL).should('contain.text', 'Vui lòng đọc và đồng ý điều khoản và điều kiện để tiếp tục đặt hàng.');
    }

    verifyShipToDifferentAddress() {
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).should('be.checked');
        cy.get(SHIPPING_ADDRESS_FIELDS_SEL).should('be.visible');
        
        cy.get(SHIPPING_ADDRESS_FIELDS_SEL).within(() => {
            cy.get(SHIPPING_NAME_SEL).should('be.visible').contains('Tên đầy đủ của người nhận');
            cy.get(SHIPPING_PHONE_SEL).should('be.visible').contains('Số điện thoại người nhận');
            cy.get(SHIPPING_STATE_SEL).should('be.visible')
            cy.get(SHIPPING_CITY_SEL).should('be.visible');
            cy.get(SHIPPING_ADDRESS_SEL).should('be.visible').contains('Địa chỉ');
        });
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).uncheck();
        cy.get(SHIPPING_ADDRESS_FIELDS_SEL).should('not.be.visible');
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).check();
        cy.get(SHIPPING_ADDRESS_FIELDS_SEL).should('be.visible');
    }

    verifyPrivacyPolicyLink() {
        cy.get(PRIVACY_POLICY_LINK_SEL).scrollIntoView();
        cy.get(PRIVACY_POLICY_LINK_SEL)
            .should('be.visible')
            .and('contain.text', 'chính sách riêng tư')
            .and('have.attr', 'target', '_blank');
        cy.get(PRIVACY_POLICY_LINK_SEL).invoke('removeAttr', 'target').click();
        cy.url().should('include', '/privacy-policy/');
        cy.get('h2').contains('Chính sách bảo mật');
    }

    placeOrder() {
        cy.get(PLACE_ORDER_BTN_SEL).click();
    }
}

export default CheckoutPage;