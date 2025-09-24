import BasePage from './BasePage';

class CartMenu extends BasePage {
  constructor() {
    super();
    this.cartIconSelector = '.ast-site-header-cart';
    this.cartCountSelector = '.astra-icon[data-cart-total]';
    this.dropdownSelector = '.widget_shopping_cart';
    this.emptyCartMessageSelector = '.ast-mini-cart-message p';
    this.continueShoppingButtonSelector = '.woocommerce-mini-cart__buttons a';
    this.productsListSelector = '.woocommerce-mini-cart';
    this.productNameSelector = '.mini_cart_item a:not(.remove)';
    this.productImageSelector = '.mini_cart_item img';
    this.productQuantitySelector = '.quantity';
    this.removeItemButtonSelector = '.remove_from_cart_button';
    this.cartTotalSelector = '.woocommerce-mini-cart__total';
    this.totalPriceSelector = '.widget_shopping_cart_content > p > span';
  }

  hoverCartIcon() {
    this.verifyElementVisible(this.cartIconSelector);
    this.hoverElement(this.cartIconSelector, 500);
    this.verifyElementVisible(this.dropdownSelector);
  }

  verifyCartIsEmpty() {
    cy.get(this.cartCountSelector).should('have.attr', 'data-cart-total', '0');
  }

  verifyEmptyCart() {
    this.hoverCartIcon();
    this.verifyElementContainsText(this.emptyCartMessageSelector, 'Không có sản phẩm trong giỏ hàng');
    this.verifyElementContainsText(this.continueShoppingButtonSelector, 'Tiếp tục mua sắm');
  }

  clickContinueShopping() {
    this.hoverCartIcon();
    cy.get(this.continueShoppingButtonSelector).contains('Tiếp tục mua sắm').click();
    this.verifyCurrentUrl('/shop');
  }

  verifyCartWithProducts() {
    this.hoverCartIcon();
    this.verifyElementVisible(this.productsListSelector);
    cy.get(this.productsListSelector).should('have.length.at.least', 1);
    
    cy.get(this.productsListSelector).first().within(() => {
      cy.get(this.productNameSelector).should('be.visible');
      cy.get(this.productImageSelector).should('be.visible');
      cy.get(this.productQuantitySelector).should('be.visible');
      cy.get(this.removeItemButtonSelector).should('be.visible');
    });
    
    this.verifyElementContainsText(this.cartTotalSelector, 'Tổng số phụ');
    this.verifyElementContainsText(this.continueShoppingButtonSelector, 'Xem giỏ hàng');
    this.verifyElementContainsText(this.continueShoppingButtonSelector, 'Thanh toán');
  }

  clickViewCart() {
    this.hoverCartIcon();
    cy.get(this.continueShoppingButtonSelector).contains('Xem giỏ hàng').click();
    this.verifyCurrentUrl('/cart');
  }

  clickCheckoutNotLogIn() {
    this.hoverCartIcon();
    cy.get(this.continueShoppingButtonSelector).contains('Thanh toán').click();
    this.verifyCurrentUrl('/my-account');
  }

  clickCheckout() {
    this.hoverCartIcon();
    cy.get(this.continueShoppingButtonSelector).contains('Thanh toán').click();
    this.verifyCurrentUrl('/checkout');
  }

  removeCart1Item() {
    this.hoverCartIcon();
    this.clickFirstButton(this.removeItemButtonSelector);
    cy.get(this.cartCountSelector).should('have.attr', 'data-cart-total', '0');

    this.getCartCount().then((newCount) => {
      const updatedCount = parseInt(newCount);
      expect(updatedCount).to.equal(0);
      this.hoverCartIcon();
      this.verifyElementVisible(this.emptyCartMessageSelector);
    });
  }

  removeCartMultiItem() {
    this.hoverCartIcon();
    this.getCartCount().then((currentCount) => {
      const initialCount = parseInt(currentCount);

      cy.get(this.productQuantitySelector).first().invoke('text').then((qtyText) => {
        const productQty = parseInt(qtyText.match(/^\d+/)[0]);
        const expectedCount = initialCount - productQty;

        cy.get(this.totalPriceSelector).invoke('text').then((initialTotalText) => {
          const initialTotal = this.extractPrice(initialTotalText);
          this.clickFirstButton(this.removeItemButtonSelector);
          cy.get(this.cartCountSelector).first().should('have.attr', 'data-cart-total', expectedCount.toString());

          if (expectedCount > 0) {
            this.hoverCartIcon();
            cy.get(this.totalPriceSelector).should('be.visible').invoke('text').then((newTotalText) => {
              const newTotal = this.extractPrice(newTotalText);
              expect(newTotal).to.be.lessThan(initialTotal);
            });
          }
        });
      });
    });
  }
}

export default CartMenu;