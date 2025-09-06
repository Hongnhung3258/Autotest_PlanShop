const SEARCH_INPUT_SEL = 'input[placeholder="Tìm kiếm sản phẩm..."]';
const SEARCH_ICON_SEL = '.ywcas-submit-icon';
const TOTAL_RESULTS_LINK_SEL = '.ywcas-total-results a';
const RESULT_NAME_SEL = '.search-result-item__name';
const RESULT_PRICE_SEL = '.search-result-item__price';
const RESULT_IMG_SEL = '.search-result-item__thumbnail img';
const ADD_TO_CART_BTN_SEL = '.search-result-add-to-cart';
const CART_COUNT_SEL = '.astra-icon[data-cart-total]';
const CART_ICON_SEL = '.ast-site-header-cart-li a';
const NO_RESULTS_MESSAGE_SEL = '.ywcas-popover-results p';

class SearchFunction {
  // Selectors chính
  getSearchWidgetSelector() {
    return 'section#yith_woocommerce_ajax_search-3';
  }

  // Popup kết quả tìm kiếm
  getSearchDropdownSelector() {
    return '.ywcas-popover-results';
  }

  getSearchResultsGridSelector() {
    return '.wp-block-yith-filled-block';
  }

  getSearchResultItemSelector() {
    return '.search-result-item';
  }

  getNoResultsDropdownSelector() {
    return '.ywcas-popover-results.no-results';
  }

  clickInputSearch() {
    cy.get(this.getSearchWidgetSelector()).should('be.visible');
    cy.get(SEARCH_INPUT_SEL).click();
  }

  searchKeyword(keyword) {
    cy.get(SEARCH_INPUT_SEL).clear().type(keyword);
  }

  checkSearchLayout() {
    cy.get(SEARCH_INPUT_SEL)
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Tìm kiếm sản phẩm...')
      .and('have.value', '');
    cy.get(SEARCH_ICON_SEL).should('be.visible');
  }

  keywordNotExits(keyword) {
    cy.get(this.getSearchDropdownSelector(), { timeout: 5000 }).should('be.visible');
    cy.get(this.getSearchResultsGridSelector()).should('contain.text', `0 results for "${keyword}"`);
  }
  
  verifySearchResults() {
    cy.get(this.getSearchDropdownSelector(), { timeout: 5000 }).should('be.visible');
    cy.get(this.getSearchResultsGridSelector()).should('be.visible');
    cy.get(this.getSearchResultItemSelector()).should('have.length.at.least', 1);
    cy.get(this.getSearchResultItemSelector()).first().within(() => {
      cy.get(RESULT_NAME_SEL).should('be.visible');
      cy.get(RESULT_PRICE_SEL).should('be.visible');
      cy.get(RESULT_IMG_SEL).should('be.visible');
      cy.get(ADD_TO_CART_BTN_SEL).should('be.visible');
    });
    cy.get(TOTAL_RESULTS_LINK_SEL).should('exist');
  }
  
  verifyNoResults() {
    cy.get(this.getNoResultsDropdownSelector(), { timeout: 5000 }).should('be.visible');
    cy.get(NO_RESULTS_MESSAGE_SEL)
      .should('contain.text', 'Không có kết quả. Hãy thử với từ khóa khác!');
  }

  verifyResultPage(keyword) {
    cy.get(SEARCH_ICON_SEL).click();
    cy.url().should('include', '/?ywcas=1&post_type=product&lang=vi&s=');
  }

  clickFirstProduct() {
    cy.get(this.getSearchResultItemSelector()).first()
      .find(RESULT_NAME_SEL).click();
    cy.url().should('include', '/product/');
  }

  clickAddToCart() {
    cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((currentCount) => {
      const initialCount = parseInt(currentCount) || 0;
      
      cy.get(this.getSearchResultItemSelector()).first().within(() => {
        cy.get(ADD_TO_CART_BTN_SEL).contains('Thêm vào giỏ hàng').click();
      });
      cy.reload();
      cy.get(CART_ICON_SEL).should('have.attr', 'aria-label', 'View Shopping Cart, 1 items');

      cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((newCount) => {
        const updatedCount = parseInt(newCount) || 0;
        
        expect(updatedCount).to.be.greaterThan(initialCount);
      });
    });
  }

  clickSelectOption() {
    cy.get(this.getSearchResultItemSelector()).first().within(() => {
      cy.get(ADD_TO_CART_BTN_SEL).contains('Lựa chọn tùy chọn').click();
    });
    cy.url().should('include', '/product/');
  }

  clickViewAllProducts() {
    cy.get(TOTAL_RESULTS_LINK_SEL).click();
    cy.url().should('include', '/?ywcas=1&post_type=product&lang=vi&s=');
  }

  verifyKeywordMatchInResults(keyword) {
    cy.get(this.getSearchResultItemSelector()).should('have.length.at.least', 1);
    cy.get(this.getSearchResultItemSelector()).each(($item) => {
      cy.wrap($item).find(RESULT_NAME_SEL).invoke('text').then((productName) => {
        const normalizedKeyword = keyword.toLowerCase().trim();
        const normalizedProductName = productName.toLowerCase().trim();
        expect(normalizedProductName).to.include(normalizedKeyword);
      });
    });
  }
}

export default SearchFunction;