const CART_ICON_SEL = '.ast-site-header-cart';
const CART_COUNT_SEL = '.astra-icon[data-cart-total]';
const DROPDOWN_SEL = '.widget_shopping_cart';
const BTN_SEL = '.woocommerce-mini-cart__buttons a';

// Empty cart selectors
const EMPTY_CART_MESSAGE_SEL = '.ast-mini-cart-message p';

// Cart with products selectors
const PRODUCTS_LIST_SEL = '.woocommerce-mini-cart';
const PRODUCT_NAME_SEL = '.mini_cart_item a:not(.remove)';
const PRODUCT_IMAGE_SEL = '.mini_cart_item img';
const PRODUCT_QUANTITY_SEL = '.quantity';
const REMOVE_ITEM_BTN_SEL = '.remove_from_cart_button';
const CART_TOTAL_SEL = '.woocommerce-mini-cart__total';
const TOTAL_SEL = '.widget_shopping_cart_content > p > span';

class CartMenu {

  hoverCartIcon() {
    cy.get(CART_ICON_SEL).should('be.visible').realHover({ timeout: 500 });
    cy.get(DROPDOWN_SEL).should('be.visible');
  }

  verifyCartIsEmpty() {
    cy.get(CART_COUNT_SEL).should('have.attr', 'data-cart-total', '0');
  }

  verifyEmptyCart() {
    this.hoverCartIcon();
    cy.get(EMPTY_CART_MESSAGE_SEL)
      .should('be.visible')
      .and('contain.text', 'Không có sản phẩm trong giỏ hàng');
    cy.get(BTN_SEL)
      .should('be.visible')
      .and('contain.text', 'Tiếp tục mua sắm');
  }

  clickContinueShopping() {
    this.hoverCartIcon();
    cy.get(BTN_SEL).contains('Tiếp tục mua sắm').click();
    cy.url().should('include', '/shop');
  }


  verifyCartWithProducts() {
    this.hoverCartIcon();
    cy.get(PRODUCTS_LIST_SEL).should('be.visible');
    cy.get(PRODUCTS_LIST_SEL).should('have.length.at.least', 1);
    cy.get(PRODUCTS_LIST_SEL).first().within(() => {
      cy.get(PRODUCT_NAME_SEL).should('be.visible'); // Tên sản phẩm
      cy.get(PRODUCT_IMAGE_SEL).should('be.visible'); // Hình ảnh sản phẩm
      cy.get(PRODUCT_QUANTITY_SEL).should('be.visible'); // Số lượng & giá
      cy.get(REMOVE_ITEM_BTN_SEL).should('be.visible'); // Nút X (xóa)
    });
    cy.get(CART_TOTAL_SEL).should('be.visible').and('contain.text', 'Tổng số phụ');
    cy.get(BTN_SEL).should('be.visible').and('contain.text', 'Xem giỏ hàng');
    cy.get(BTN_SEL).should('be.visible').and('contain.text', 'Thanh toán');
  }

  clickViewCart() {
    this.hoverCartIcon();
    cy.get(BTN_SEL).contains('Xem giỏ hàng').click();
    cy.url().should('include', '/cart');
  }

  clickCheckoutNotLogIn() {
    this.hoverCartIcon();
    cy.get(BTN_SEL).contains('Thanh toán').click();
    cy.url().should('include', '/my-account');
  }

  clickCheckout() {
    this.hoverCartIcon();
    cy.get(BTN_SEL).contains('Thanh toán').click();
    cy.url().should('include', '/checkout');
  }

  removeCart1Item() {
    this.hoverCartIcon();
    cy.get(REMOVE_ITEM_BTN_SEL).first().click();
    cy.get(CART_COUNT_SEL).should('have.attr', 'data-cart-total', '0');

    cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((newCount) => {
      const updatedCount = parseInt(newCount);
      expect(updatedCount).to.equal(0);
      this.hoverCartIcon();
      cy.get(EMPTY_CART_MESSAGE_SEL).should('be.visible');
    });
  }

  removeCartMultiItem() {
    this.hoverCartIcon();
    cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((currentCount) => {
      const initialCount = parseInt(currentCount);

      cy.get(PRODUCT_QUANTITY_SEL).first().invoke('text').then((qtyText) => {
        const productQty = parseInt(qtyText.match(/^\d+/)[0]);
        const expectedCount = initialCount - productQty;

        cy.get(TOTAL_SEL).invoke('text').then((initialTotalText) => {
          const initialTotal = parseInt(initialTotalText.replace(/\./g, ""));
          cy.get(REMOVE_ITEM_BTN_SEL).first().click();
          cy.get(CART_COUNT_SEL).first().should('have.attr', 'data-cart-total', expectedCount.toString());

          if (expectedCount > 0) {
            this.hoverCartIcon();
            cy.get(TOTAL_SEL).should('be.visible').invoke('text').then((newTotalText) => {
              const newTotal = parseInt(newTotalText.replace(/\./g, ""));
              expect(newTotal).to.be.lessThan(initialTotal);
            });
          }
        });
      });
    });
  }

}

export default CartMenu;