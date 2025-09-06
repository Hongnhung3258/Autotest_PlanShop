const EMPTY_CART_MESSAGE_SEL = '.cart-empty.woocommerce-info';
const FILL_CART_MESSAGE_SEL = '.woocommerce-notices-wrapper';
const REMOVE_CART_MESSAGE_SEL = '.woocommerce-notices-wrapper > .woocommerce-message';
const COUPON_ERROR_MESAGE_SEL = '#coupon-error-notice';
const RESTORE_LINK_SEL = '.woocommerce-message a[href*="undo"]';
const RETURN_TO_SHOP_BTN_SEL = '.return-to-shop > a';

const CART_TABLE_PRODUCT_SEL = '.woocommerce-cart-form';
const REMOVE_PRODUCT_BTN_SEL = '.product-remove > a';
const PRODUCT_IMAGE_SEL = '.product-thumbnail img';
const PRODUCT_NAME_SEL = 'td[data-title="Sản phẩm"]';
const PRODUCT_PRICE_SEL = 'td[data-title="Giá"] > span';
const QUANTITY_SEL = 'td[data-title="Số lượng"]';
const SUBTOTAL_SEL = 'td[data-title="Tạm tính"] > span';

const CART_ITEM_SEL = '.cart_item';
const QUANTITY_INPUT_SEL = '.product-quantity input[type="number"]';
const QUANTITY_PLUS_BTN_SEL = '.product-quantity .plus';
const QUANTITY_MINUS_BTN_SEL = '.product-quantity .minus';
const COUPON_SEL = '.coupon';//
const COUPON_INPUT_SEL = '#coupon_code';
const APPLY_COUPON_BTN_SEL = 'button[name="apply_coupon"]';

const CART_TOTALS_TABLE_SEL = '.cart_totals'; 
const SHIPPING_COST_SEL = 'td[data-title="Vận chuyển"]';
const ORDER_TOTAL_SEL = 'td[data-title="Tổng"]';
const CHECKOUT_BTN_SEL = '.checkout-button';
const CART_DISCOUNT = 'tr.cart-discount';
const CHANGE_ADDRESS_BTN_SEL = '.shipping-calculator-button';


class CartPage {
  verifyEmptyCartDisplay() {
    cy.get(EMPTY_CART_MESSAGE_SEL)
      .should('be.visible')
      .and('contain.text', 'Chưa có sản phẩm nào trong giỏ hàng');
    cy.get(RETURN_TO_SHOP_BTN_SEL)
      .should('be.visible')
      .and('contain.text', 'Quay trở lại cửa hàng');
  }

  clickReturnToShop() {
    cy.get(RETURN_TO_SHOP_BTN_SEL).click();
    cy.url().should('include', '/shop');
  }

  verifyCartWithProductsDisplay() {
    cy.get(CART_TABLE_PRODUCT_SEL).should('be.visible');
    cy.get(CART_TABLE_PRODUCT_SEL).within(() => {
      cy.get('thead th').should('contain.text', 'Sản phẩm');
      cy.get('thead th').should('contain.text', 'Giá');
      cy.get('thead th').should('contain.text', 'Số lượng');
      cy.get('thead th').should('contain.text', 'Tạm tính');
    });

    cy.get(CART_ITEM_SEL).should('have.length.at.least', 1);
    cy.get(CART_ITEM_SEL).first().within(() => {
      cy.get(REMOVE_PRODUCT_BTN_SEL).should('be.visible');
      cy.get(PRODUCT_IMAGE_SEL).should('be.visible');
      cy.get(PRODUCT_NAME_SEL).should('be.visible');
      cy.get(PRODUCT_PRICE_SEL).should('be.visible');
      cy.get(QUANTITY_SEL).should('be.visible');
      cy.get(SUBTOTAL_SEL).should('be.visible');
    });
    cy.get(COUPON_SEL).should('be.visible');
  }

  clickPlusButton() {
    cy.get(QUANTITY_INPUT_SEL).first().invoke('val').then((currentQty) => {
      const initialQty = parseInt(currentQty.replace(/[^\d]/g, ''));
      const expectedQty = initialQty + 1;
      cy.get(SUBTOTAL_SEL).invoke('text').then((currentSubTotal) => {
        const initialSubtotal = parseInt(currentSubTotal.replace(/\./g, ''));
        cy.get(QUANTITY_PLUS_BTN_SEL).click();
        cy.get(QUANTITY_INPUT_SEL).first().should('have.value', expectedQty.toString());
        cy.get(SUBTOTAL_SEL).invoke('text').should((newSubTotals) => {
          const newSubTotal = parseInt(newSubTotals.replace(/\./g, ""));
          expect(newSubTotal).to.be.greaterThan(initialSubtotal);
        });
      });
    });
  }

  clickMinusButtonSingleProduct() {
    cy.get(CART_ITEM_SEL).should('have.length', 1);
    cy.get(QUANTITY_INPUT_SEL).first().should('have.value', '1');
    cy.get(QUANTITY_MINUS_BTN_SEL).first().click();
    cy.get(CART_TABLE_PRODUCT_SEL).should('have.class', 'processing');
    cy.get(FILL_CART_MESSAGE_SEL).should('be.visible')
    .and('contain.text', 'Giỏ hàng đã được cập nhật');
    cy.get(FILL_CART_MESSAGE_SEL).should('be.visible')
    .and('contain.text', 'Chưa có sản phẩm nào trong giỏ hàng.');
    cy.get(RETURN_TO_SHOP_BTN_SEL).should('be.visible');
  }

  clickMinusButtonMultipleProducts() {
    cy.get('body').then(($body) => {
      const itemCount = $body.find(CART_ITEM_SEL).length;
      const qty = Number($body.find(QUANTITY_INPUT_SEL).first().val());
      let initialTotalAmount, newTotalAmount;
      cy.get(CART_TOTALS_TABLE_SEL).within(() => {
        cy.get(CART_SUBTOTAL_SEL).invoke('text').then((initialTotal) => {
          initialTotalAmount = parseInt(initialTotal.replace(/\./g, ''));
        });
      });

      if (itemCount >= 2) {
        cy.get(QUANTITY_MINUS_BTN_SEL).first().click();
        cy.get(CART_TABLE_PRODUCT_SEL).should('have.class', 'processing');
        cy.get(FILL_CART_MESSAGE_SEL).should('be.visible')
          .and('contain.text', 'Giỏ hàng đã được cập nhật');
      } else if (qty > 1) {
        cy.get(QUANTITY_MINUS_BTN_SEL).first().click();
        cy.get(CART_TABLE_PRODUCT_SEL).should('have.class', 'processing');
        cy.get(FILL_CART_MESSAGE_SEL).should('be.visible')
          .and('contain.text', 'Giỏ hàng đã được cập nhật');
      }
      cy.get(CART_TOTALS_TABLE_SEL).within(() => {
        cy.get(CART_SUBTOTAL_SEL).invoke('text').should((newTotal) => {
          newTotalAmount = parseInt(newTotal.replace(/\./g, ''));
          expect(newTotalAmount).to.be.lessThan(initialTotalAmount);
        });
      });
    });
  }

  removeProductSingleItem() {
    cy.get(PRODUCT_NAME_SEL).first().invoke('text').then((name) => {
      const nameProduct = name.replace(/\s+/g, ' ').replace(/(^\s|\s$)/g, '');
      cy.get(REMOVE_PRODUCT_BTN_SEL).first().click();
      cy.get(EMPTY_CART_MESSAGE_SEL).should('be.visible')
          .and('contain.text', 'Chưa có sản phẩm nào trong giỏ hàng.');
      cy.get(REMOVE_CART_MESSAGE_SEL).should('be.visible').then(($el) => {
        const text = $el.text().replace(/\s+/g, ' ').trim();
        expect(text).to.equal(`“${nameProduct}” đã xóa. Khôi phục?`);
      });
      cy.get(RESTORE_LINK_SEL).should('be.visible').and('contain.text', 'Khôi phục?');
      cy.get(RETURN_TO_SHOP_BTN_SEL).should('be.visible');
    });
  }

  removeProductMultipleItems() {
    let initialTotalAmount, newTotalAmount;
    cy.get(CART_TOTALS_TABLE_SEL).within(() => {
      cy.get(CART_SUBTOTAL_SEL).invoke('text').then((initialTotal) => {
        initialTotalAmount = parseInt(initialTotal.replace(/\./g, ''));
      });
    });
    cy.get(CART_ITEM_SEL).should('have.length.at.least', 2);
    cy.get(CART_ITEM_SEL).its('length').then((initialCount) => {
      cy.get(REMOVE_PRODUCT_BTN_SEL).first().click();
      cy.get(CART_ITEM_SEL).should('have.length', initialCount - 1);
    });
    cy.get(CART_TOTALS_TABLE_SEL).within(() => {
      cy.get(CART_SUBTOTAL_SEL).invoke('text').should((newTotal) => {
        newTotalAmount = parseInt(newTotal.replace(/\./g, ''));
        expect(newTotalAmount).to.be.lessThan(initialTotalAmount);
      });
    });
  }

  clickUndoLink() {
    cy.get(CART_ITEM_SEL).should('have.length.at.least', 1);
    cy.get(CART_ITEM_SEL).its('length').then((initialCount) => {
      cy.get(REMOVE_PRODUCT_BTN_SEL).first().click();
      cy.get('body').then(($body) => {
        if ($body.find(RESTORE_LINK_SEL).length > 0) {
          cy.get(RESTORE_LINK_SEL).click();
          cy.get(CART_TABLE_PRODUCT_SEL).should('have.class', 'processing');
          cy.get(CART_ITEM_SEL).should('have.length', initialCount);
        }
      });
    });
  }

  applyEmptyCoupon(couponCode) {
    cy.get(COUPON_INPUT_SEL).type(couponCode);
    cy.get(APPLY_COUPON_BTN_SEL).click();

    cy.get(COUPON_ERROR_MESAGE_SEL).should('contain.text', 'Vui lòng nhập mã ưu đãi.');
  }

  applyValidCoupon(couponCode) {
    cy.get(ORDER_TOTAL_SEL).invoke('text').then((initialTotal) => {
      const initialAmount = parseInt(initialTotal.replace(/\./g, ''));

      cy.get(COUPON_INPUT_SEL).type(couponCode);
      cy.get(APPLY_COUPON_BTN_SEL).click();

      cy.get(CART_TOTALS_TABLE_SEL).should('have.class', 'processing');
      cy.get(FILL_CART_MESSAGE_SEL).should('contain.text', 'Mã ưu đãi đã được áp dụng thành công.');
      cy.get(CART_DISCOUNT).should('be.visible');
      cy.get(ORDER_TOTAL_SEL).invoke('text').then((newTotal) => {
        const newAmount = parseInt(newTotal.replace(/\./g, ''));
        expect(newAmount).to.be.lessThan(initialAmount);
      });
    });
  }

  applyInvalidCoupon(couponCode) {
    cy.get(COUPON_INPUT_SEL).type(couponCode);
    cy.get(APPLY_COUPON_BTN_SEL).click();
    
    cy.get(COUPON_ERROR_MESAGE_SEL).should('contain.text', `Không thể áp dụng mã giảm giá "${couponCode.toLowerCase()}" vì mã này không tồn tại.`);
  }

  verifyCartTotalsSection() {
    cy.get(CART_TOTALS_TABLE_SEL).should('be.visible').within(() => {
      cy.contains('Tổng cộng giỏ hàng').should('be.visible');
      cy.get(SUBTOTAL_SEL).should('be.visible');
      cy.get(SHIPPING_COST_SEL).should('be.visible');
      cy.get(ORDER_TOTAL_SEL).should('be.visible');
    });
  }

  clickChangeAddress() {
    cy.get(CHANGE_ADDRESS_BTN_SEL).click();
    cy.get('#shipping-calculator-form').should('be.visible');
    
    cy.get('#calc_shipping_country').should('be.visible');
    cy.get('#calc_shipping_state').should('be.visible');
    cy.get('#calc_shipping_city').should('be.visible');
  }

  clickCheckoutNotLoggedIn() {
    cy.get(CHECKOUT_BTN_SEL).click();
    cy.url().should('include', '/my-account');
  }

  clickCheckoutLoggedIn() {
    cy.get(CHECKOUT_BTN_SEL).click();
    cy.url().should('include', '/checkout');
  }
}

export default CartPage;