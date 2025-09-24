import BasePage from './BasePage';

class CartPage extends BasePage {
  constructor() {
    super();
    
    // Empty cart selectors
    this.emptyCartMessageSelector = '.cart-empty.woocommerce-info';
    this.returnToShopButtonSelector = '.return-to-shop > a';
    
    // Cart messages selectors
    this.fillCartMessageSelector = '.woocommerce-notices-wrapper';
    this.removeCartMessageSelector = '.woocommerce-notices-wrapper > .woocommerce-message';
    this.restoreLinkSelector = '.woocommerce-message a[href*="undo"]';
    
    // Cart table selectors
    this.cartTableProductSelector = '.woocommerce-cart-form';
    this.cartItemSelector = '.cart_item';
    this.removeProductButtonSelector = '.product-remove > a';
    this.productImageSelector = '.product-thumbnail img';
    this.productNameSelector = 'td[data-title="Sản phẩm"]';
    this.productPriceSelector = 'td[data-title="Giá"] > span';
    this.quantitySelector = 'td[data-title="Số lượng"]';
    this.subtotalSelector = 'td[data-title="Tạm tính"] > span';
    
    // Quantity controls selectors
    this.quantityInputSelector = '.product-quantity input[type="number"]';
    this.quantityPlusButtonSelector = '.product-quantity .plus';
    this.quantityMinusButtonSelector = '.product-quantity .minus';
    
    // Coupon selectors
    this.couponSelector = '.coupon';
    this.couponInputSelector = '#coupon_code';
    this.applyCouponButtonSelector = 'button[name="apply_coupon"]';
    this.couponErrorMessageSelector = '#coupon-error-notice';
    this.cartDiscountSelector = 'tr.cart-discount';
    
    // Cart totals selectors
    this.cartTotalsTableSelector = '.cart_totals';
    this.shippingCostSelector = 'td[data-title="Vận chuyển"]';
    this.orderTotalSelector = 'td[data-title="Tổng"]';
    this.checkoutButtonSelector = '.checkout-button';
    this.changeAddressButtonSelector = '.shipping-calculator-button';
  }

  verifyEmptyCartDisplay() {
    this.verifyElementContainsText(this.emptyCartMessageSelector, 'Chưa có sản phẩm nào trong giỏ hàng');
    this.verifyElementContainsText(this.returnToShopButtonSelector, 'Quay trở lại cửa hàng');
  }

  clickReturnToShop() {
    this.clickButton(this.returnToShopButtonSelector);
    this.verifyCurrentUrl('/shop');
  }

  verifyCartWithProductsDisplay() {
    this.verifyElementVisible(this.cartTableProductSelector);
    cy.get(this.cartTableProductSelector).within(() => {
      cy.get('thead th').should('contain.text', 'Sản phẩm');
      cy.get('thead th').should('contain.text', 'Giá');
      cy.get('thead th').should('contain.text', 'Số lượng');
      cy.get('thead th').should('contain.text', 'Tạm tính');
    });

    cy.get(this.cartItemSelector).should('have.length.at.least', 1);
    cy.get(this.cartItemSelector).first().within(() => {
      this.verifyElementVisible(this.removeProductButtonSelector);
      this.verifyElementVisible(this.productImageSelector);
      this.verifyElementVisible(this.productNameSelector);
      this.verifyElementVisible(this.productPriceSelector);
      this.verifyElementVisible(this.quantitySelector);
      this.verifyElementVisible(this.subtotalSelector);
    });
    
    this.verifyElementVisible(this.couponSelector);
  }

  clickPlusButton() {
    cy.get(this.quantityInputSelector).first().invoke('val').then((currentQty) => {
      const initialQty = parseInt(currentQty.replace(/[^\d]/g, ''));
      const expectedQty = initialQty + 1;
      
      cy.get(this.subtotalSelector).invoke('text').then((currentSubTotal) => {
        const initialSubtotal = this.extractPrice(currentSubTotal);
        this.clickButton(this.quantityPlusButtonSelector);
        cy.get(this.quantityInputSelector).first().should('have.value', expectedQty.toString());
        
        cy.get(this.subtotalSelector).invoke('text').should((newSubTotals) => {
          const newSubTotal = this.extractPrice(newSubTotals);
          expect(newSubTotal).to.be.greaterThan(initialSubtotal);
        });
      });
    });
  }

  clickMinusButtonSingleProduct() {
    cy.get(this.cartItemSelector).should('have.length', 1);
    cy.get(this.quantityInputSelector).first().should('have.value', '1');
    this.clickButton(this.quantityMinusButtonSelector);
    cy.get(this.cartTableProductSelector).should('have.class', 'processing');
    
    this.verifyElementContainsText(this.fillCartMessageSelector, 'Giỏ hàng đã được cập nhật');
    this.verifyElementContainsText(this.fillCartMessageSelector, 'Chưa có sản phẩm nào trong giỏ hàng.');
    this.verifyElementVisible(this.returnToShopButtonSelector);
  }

 clickMinusButtonMultipleProducts() {
  cy.get(this.cartItemSelector).its('length').then((itemCount) => {
    cy.get(this.quantityInputSelector).first().invoke('val').then((val) => {
      const qty = Number(val);

      cy.get(this.cartTotalsTableSelector)
        .find(this.subtotalSelector)
        .invoke('text')
        .then((initialTotalText) => {
          const initialTotalAmount = this.extractPrice(initialTotalText);

          if (itemCount >= 2 || qty > 1) {
            this.clickFirstButton(this.quantityMinusButtonSelector);
            cy.get(this.cartTableProductSelector).should('have.class', 'processing');
            this.verifyElementContainsText(this.fillCartMessageSelector, 'Giỏ hàng đã được cập nhật');
          }

          cy.get(this.cartTotalsTableSelector)
            .find(this.subtotalSelector)
            .invoke('text')
            .then((newTotalText) => {
              const newTotalAmount = this.extractPrice(newTotalText);
              expect(newTotalAmount).to.be.lessThan(initialTotalAmount);
            });
        });
    });
  });
}


  removeProductSingleItem() {
    cy.get(this.productNameSelector).first().invoke('text').then((name) => {
      const nameProduct = this.normalizeText(name);
      this.clickButton(this.removeProductButtonSelector);
      this.verifyElementContainsText(this.emptyCartMessageSelector, 'Chưa có sản phẩm nào trong giỏ hàng.');
      
       cy.get(this.removeCartMessageSelector).should('be.visible').then(($el) => {
        const actualText = $el.text().replace(/\s+/g, ' ').replace(/[“”]/g, '"').trim();
        expect(actualText).to.include(`"${nameProduct}" đã xóa. Khôi phục?`);
      });
      
      this.verifyElementContainsText(this.restoreLinkSelector, 'Khôi phục?');
      this.verifyElementVisible(this.returnToShopButtonSelector);
    });
  }

  removeProductMultipleItems() {
    let initialTotalAmount, newTotalAmount;
    cy.get(this.cartTotalsTableSelector).within(() => {
      cy.get(this.subtotalSelector).invoke('text').then((initialTotal) => {
        initialTotalAmount = this.extractPrice(initialTotal);
        });
    });
      cy.get(this.cartItemSelector).should('have.length.at.least', 2);
      cy.get(this.cartItemSelector).its('length').then((initialCount) => {
        this.clickFirstButton(this.removeProductButtonSelector);
        cy.get(this.cartItemSelector).should('have.length', initialCount - 1);
      });

      cy.get(this.cartTotalsTableSelector).within(() => {
        cy.get(this.subtotalSelector).invoke('text').should((newTotal) => {
          newTotalAmount = this.extractPrice(newTotal);
          expect(newTotalAmount).to.be.lessThan(initialTotalAmount);
      });
    });
  }

  clickUndoLink() {
  cy.get(this.cartItemSelector).should('have.length.at.least', 1)
    .then(($items) => {
      const initialCount = $items.length;

      this.clickFirstButton(this.removeProductButtonSelector);
      cy.get('body').find(this.restoreLinkSelector).then(($el) => {
        if ($el.length > 0) {
          cy.get(this.restoreLinkSelector).click();
          cy.get(this.cartTableProductSelector).should('have.class', 'processing');
          cy.get(this.cartItemSelector, { timeout: 10000 })
            .should('have.length', initialCount);
        }
      });
    });
}

  applyEmptyCoupon(couponCode) {
    this.clearAndType(this.couponInputSelector, couponCode);
    this.clickButton(this.applyCouponButtonSelector);
    this.verifyElementContainsText(this.couponErrorMessageSelector, 'Vui lòng nhập mã ưu đãi.');
  }

  applyValidCoupon(couponCode) {
    cy.get(this.orderTotalSelector).invoke('text').then((initialTotal) => {
      const initialAmount = this.extractPrice(initialTotal);

      this.clearAndType(this.couponInputSelector, couponCode);
      this.clickButton(this.applyCouponButtonSelector);

      cy.get(this.cartTotalsTableSelector).should('have.class', 'processing');
      this.verifyElementContainsText(this.fillCartMessageSelector, 'Mã ưu đãi đã được áp dụng thành công.');
      this.verifyElementVisible(this.cartDiscountSelector);
      
      cy.get(this.orderTotalSelector).invoke('text').then((newTotal) => {
        const newAmount = this.extractPrice(newTotal);
        expect(newAmount).to.be.lessThan(initialAmount);
      });
    });
  }

  applyInvalidCoupon(couponCode) {
    this.clearAndType(this.couponInputSelector, couponCode);
    this.clickButton(this.applyCouponButtonSelector);
    this.verifyElementContainsText(
      this.couponErrorMessageSelector, 
      `Không thể áp dụng mã giảm giá "${couponCode.toLowerCase()}" vì mã này không tồn tại.`
    );
  }

  verifyCartTotalsSection() {
    this.verifyElementVisible(this.cartTotalsTableSelector);
    
    cy.get(this.cartTotalsTableSelector).within(() => {
      cy.contains('Tổng cộng giỏ hàng').should('be.visible');
      verifyElementVisible(this.subtotalSelector);
      verifyElementVisible(this.shippingCostSelector);
      verifyElementVisible(this.orderTotalSelector);
    });
  }

  clickChangeAddress() {
    this.clickButton(this.changeAddressButtonSelector);
    this.verifyElementVisible('#shipping-calculator-form');
    this.verifyElementVisible('#calc_shipping_country');
    this.verifyElementVisible('#calc_shipping_state');
    this.verifyElementVisible('#calc_shipping_city');
  }

  clickCheckoutNotLoggedIn() {
    this.clickButton(this.checkoutButtonSelector);
    this.verifyCurrentUrl('/my-account');
  }

  clickCheckoutLoggedIn() {
    this.clickButton(this.checkoutButtonSelector);
    this.verifyCurrentUrl('/checkout');
  }
}

export default CartPage;