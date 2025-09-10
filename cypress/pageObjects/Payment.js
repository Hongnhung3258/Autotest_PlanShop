const SHIP_TO_DIFFERENT_CHECKBOX_SEL = '#ship-to-different-address-checkbox';
const INPUT_NAME_SEL = '#billing_last_name';
const INPUT_PHONE_SEL = '#billing_phone';
const BILLING_STATE_SEL = '#billing_state';
const BILLING_CITY_SEL = '#billing_city';
const INPUT_ADDRESS_SEL = '#billing_address_1';
const TERMS_CHECKBOX_SEL = '#terms';

const SHIPPING_NAME_SEL = '#shipping_last_name_field';
const SHIPPING_PHONE_SEL = '#shipping_phone_field';
const SHIPPING_ADDRESS_SEL = '#shipping_address_1_field';

const BANK_TRANSFER_SEL = '#payment_method_bacs';
const COD_PAYMENT_SEL = '#payment_method_cod';
const MOMO_PAYMENT_SEL = '#payment_method_momo';
const VIETQR_PAYMENT_SEL = '#payment_method_vietqr';
const PLACE_ORDER_BTN_SEL = '#place_order';

const NOTICE_SEL = '.woocommerce-thankyou-order-received';
const PAYMENT_METHOD_SEL = '.woocommerce-order-overview__payment-method strong';

const ODER_DETAIL_SEL = 'section.woocommerce-order-details';
const ORDER_TABLE_SEL = '.woocommerce-table--order-details';

const CUSTOMER_DETAILS_SEL = 'section.woocommerce-customer-details';
const BILLING_ADDRESS_TABLE_SEL = '.woocommerce-column--billing-address';
const SHIPPING_ADDRESS_TABLE_SEL = '.woocommerce-column--shipping-address';

const VIETQR_SCAN_SEL = 'section.woocommerce-vietqr-qr-scan';
const IMG_QR_SEL = '#qrcode img';
const VIETQR_DETAIL_SEL = 'section.woocommerce-vietqr-bank-details';
const TABLE_VIETQR_SEL = '.table .table-bordered';

const PAY_BTN = '#pay_btn';

class Payment {
    fillBillingInformation(name, phone, address) {
        cy.get(SHIP_TO_DIFFERENT_CHECKBOX_SEL).uncheck();
        if (name) cy.get(INPUT_NAME_SEL).clear().type(name);
        if (phone) cy.get(INPUT_PHONE_SEL).clear().type(phone);
        cy.selectByIndex(BILLING_STATE_SEL, 0);
        cy.selectByIndex(BILLING_CITY_SEL, 12);
        if (address) cy.get(INPUT_ADDRESS_SEL).clear().type(address);
        cy.get(TERMS_CHECKBOX_SEL).check();
    }

    selectPaymentMethod(method) {
        const paymentSelectors = {
            'bank': BANK_TRANSFER_SEL,
            'cod': COD_PAYMENT_SEL,
            'momo': MOMO_PAYMENT_SEL,
            'vietqr': VIETQR_PAYMENT_SEL
        };
        cy.get(paymentSelectors[method]).check();
    }

    fillShippingInformation(shippingInfo) {
        cy.get(SHIPPING_NAME_SEL).clear().type(shippingInfo.name);
        cy.get(SHIPPING_PHONE_SEL).clear().type(shippingInfo.phone);
        cy.get(SHIPPING_ADDRESS_SEL).clear().type(shippingInfo.address);
    }


    formReceived(PM){
        cy.url().should('include', '/checkout/order-received');
        cy.get(PAYMENT_METHOD_SEL).should('be.visible').contains(PM);
        cy.get(ODER_DETAIL_SEL).should('be.visible').within(() => {
            cy.get('h2').contains('Chi tiết đơn hàng');
            cy.get(ORDER_TABLE_SEL).should('be.visible');
        });
        cy.get(CUSTOMER_DETAILS_SEL).should('be.visible').within(() => {
            cy.get(BILLING_ADDRESS_TABLE_SEL).should('be.visible');
            cy.get(SHIPPING_ADDRESS_TABLE_SEL).should('be.visible');
        });
    }

    testBankTransferPayment() {
        this.selectPaymentMethod('bank');
        cy.get(PLACE_ORDER_BTN_SEL).click();
        cy.get(NOTICE_SEL).contains('Cảm ơn bạn. Đơn hàng của bạn đã được nhận.');
        this.formReceived('Chuyển khoản ngân hàng trực tuyến');
    }

    testCODPayment() {
        this.selectPaymentMethod('cod');
        cy.get(PLACE_ORDER_BTN_SEL).click();
        cy.get(NOTICE_SEL).contains('Cảm ơn bạn. Đơn hàng của bạn đã được nhận.');
        this.formReceived('Thanh toán khi nhận hàng');
    }

    testMoMoPayment() {
        this.selectPaymentMethod('momo');
        cy.get(PLACE_ORDER_BTN_SEL).click();
        cy.url().should('include', '/checkout/order-pay');
        cy.get(PAY_BTN).click();
        cy.get(NOTICE_SEL).contains('Cảm ơn bạn. Đơn hàng của bạn đã được nhận.');
        this.formReceived('Thanh toán qua MoMo');
    }

    testVietQRPayment() {
        this.selectPaymentMethod('vietqr');
        cy.get(PLACE_ORDER_BTN_SEL).click();
        cy.get(NOTICE_SEL).contains('Cảm ơn bạn. Đơn hàng của bạn đã được nhận.');
        this.formReceived('Chuyển khoản ngân hàng (Quét mã QR)')
        cy.get(VIETQR_SCAN_SEL).should('be.visible').within(() => {
            cy.get('h2').should('be.visible').contains('Mã QR chuyển khoản ngân hàng');
            cy.get(IMG_QR_SEL).should('be.visible')
        });
        cy.get(VIETQR_DETAIL_SEL).should('be.visible').within(() => {
            cy.get('h2').should('be.visible').contains('Thông tin chuyển khoản ngân hàng');
            cy.get(TABLE_VIETQR_SEL).should('be.visible');
        });

    }
}

export default Payment;