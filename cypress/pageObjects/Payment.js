import BasePage from './BasePage';

class Payment extends BasePage {
  constructor() {
    super();
    
    // Form input selectors
    this.shipToDifferentCheckboxSelector = '#ship-to-different-address-checkbox';
    this.inputNameSelector = '#billing_last_name';
    this.inputPhoneSelector = '#billing_phone';
    this.billingStateSelector = '#billing_state';
    this.billingCitySelector = '#billing_city';
    this.inputAddressSelector = '#billing_address_1';
    this.termsCheckboxSelector = '#terms';
    
    // Shipping selectors
    this.shippingNameFieldSelector = '#shipping_last_name_field';
    this.shippingPhoneFieldSelector = '#shipping_phone_field';
    this.shippingAddressFieldSelector = '#shipping_address_1_field';
    
    // Payment method selectors
    this.bankTransferSelector = '#payment_method_bacs';
    this.codPaymentSelector = '#payment_method_cod';
    this.momoPaymentSelector = '#payment_method_momo';
    this.vietqrPaymentSelector = '#payment_method_vietqr';
    this.placeOrderBtnSelector = '#place_order';
    
    // Success page selectors
    this.successNoticeSelector = '.woocommerce-notice--success.woocommerce-thankyou-order-received';
    this.paymentMethodDisplaySelector = '.woocommerce-order-overview__payment-method strong';
    this.orderDetailSectionSelector = 'section.woocommerce-order-details';
    this.orderTableSelector = '.woocommerce-table--order-details';
    this.customerDetailsSectionSelector = 'section.woocommerce-customer-details';
    this.billingAddressTableSelector = '.woocommerce-column--billing-address';
    this.shippingAddressTableSelector = '.woocommerce-column--shipping-address';
    
    // VietQR specific selectors
    this.vietqrScanSectionSelector = 'section.woocommerce-vietqr-qr-scan';
    this.qrCodeImageSelector = '#qrcode img';
    this.vietqrDetailSectionSelector = 'section.woocommerce-vietqr-bank-details';
    this.vietqrTableSelector = 'table.table-bordered';
    
    // MoMo specific selectors
    this.payBtnSelector = '#pay_btn';
  }

  fillBillingInformation(name, phone, address) {
    this.uncheckCheckbox(this.shipToDifferentCheckboxSelector);
    
    if (name) this.clearAndType(this.inputNameSelector, name);
    if (phone) this.clearAndType(this.inputPhoneSelector, phone);
    
    cy.selectByIndex(this.billingStateSelector, 0);
    cy.selectByIndex(this.billingCitySelector, 12);
    
    if (address) this.clearAndType(this.inputAddressSelector, address);
    
    this.checkCheckbox(this.termsCheckboxSelector);
  }

  selectPaymentMethod(method) {
    const paymentSelectors = {
      'bank': this.bankTransferSelector,
      'cod': this.codPaymentSelector,
      'momo': this.momoPaymentSelector,
      'vietqr': this.vietqrPaymentSelector
    };
    
    if (paymentSelectors[method]) {
      this.checkCheckbox(paymentSelectors[method]);
    } else {
      throw new Error(`Payment method '${method}' not supported. Available: bank, cod, momo, vietqr`);
    }
  }

  fillShippingInformation(shippingInfo) {
    this.clearAndType(this.shippingNameFieldSelector, shippingInfo.name);
    this.clearAndType(this.shippingPhoneFieldSelector, shippingInfo.phone);
    this.clearAndType(this.shippingAddressFieldSelector, shippingInfo.address);
  }

  placeOrder() {
    this.clickButton(this.placeOrderBtnSelector);
  }

  verifyOrderReceived(expectedPaymentMethod) {
    this.verifyCurrentUrl('/checkout/order-received');
    this.verifyElementVisible(this.paymentMethodDisplaySelector);
    this.verifyElementContainsText(this.paymentMethodDisplaySelector, expectedPaymentMethod);
    
    this.verifyElementVisible(this.orderDetailSectionSelector);
    cy.get(this.orderDetailSectionSelector).within(() => {
      this.verifyElementContainsText('h2', 'Chi tiết đơn hàng');
      this.verifyElementVisible(this.orderTableSelector);
    });
    
    this.verifyElementVisible(this.customerDetailsSectionSelector);
    cy.get(this.customerDetailsSectionSelector).within(() => {
      this.verifyElementVisible(this.billingAddressTableSelector);
      this.verifyElementVisible(this.shippingAddressTableSelector);
    });
  }

  verifySuccessMessage() {
    this.verifyElementVisible(this.successNoticeSelector);
    this.verifyElementContainsText(this.successNoticeSelector, 'Cảm ơn bạn. Đơn hàng của bạn đã được nhận.');
  }

  testBankTransferPayment() {
    this.selectPaymentMethod('bank');
    this.placeOrder();
    this.verifySuccessMessage();
    this.verifyOrderReceived('Chuyển khoản ngân hàng trực tiếp');
  }

  testCODPayment() {
    this.selectPaymentMethod('cod');
    this.placeOrder();
    this.verifySuccessMessage();
    this.verifyOrderReceived('Thanh toán khi nhận hàng');
  }

  testMoMoPayment() {
    this.selectPaymentMethod('momo');
    this.placeOrder();
    this.verifyCurrentUrl('/checkout/order-pay');
    this.clickButton(this.payBtnSelector);
    this.verifySuccessMessage();
    this.verifyOrderReceived('Thanh toán qua MoMo');
  }

  testVietQRPayment() {
    this.selectPaymentMethod('vietqr');
    this.placeOrder();
    this.verifySuccessMessage();
    this.verifyOrderReceived('Chuyển khoản ngân hàng (Quét mã QR)');
    
    this.verifyElementVisible(this.vietqrScanSectionSelector);
    cy.get(this.vietqrScanSectionSelector).within(() => {
      this.verifyElementVisible('h2');
      this.verifyElementContainsText('h2', 'Mã QR chuyển khoản ngân hàng');
      this.verifyElementVisible(this.qrCodeImageSelector);
    });
    
    this.verifyElementVisible(this.vietqrDetailSectionSelector);
    cy.get(this.vietqrDetailSectionSelector).within(() => {
      this.verifyElementVisible('h2');
      this.verifyElementContainsText('h2', 'Thông tin chuyển khoản ngân hàng');
      this.verifyElementVisible(this.vietqrTableSelector);
    });
  }
}

export default Payment;