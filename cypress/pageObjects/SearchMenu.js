import BasePage from './BasePage';

class SearchFunction extends BasePage {
  constructor() {
    super();
    // Search input selectors
    this.searchInputSelector = 'input[placeholder="Tìm kiếm sản phẩm..."]';
    this.searchIconSelector = '.ywcas-submit-icon';
    
    // Widget and dropdown selectors
    this.searchWidgetSelector = 'section#yith_woocommerce_ajax_search-3';
    this.searchDropdownSelector = '.ywcas-popover-results';
    this.searchResultsGridSelector = '.wp-block-yith-filled-block';
    this.searchResultItemSelector = '.search-result-item';
    this.noResultsDropdownSelector = '.ywcas-popover-results.no-results';
    
    // Result item selectors
    this.resultNameSelector = '.search-result-item__name';
    this.resultPriceSelector = '.search-result-item__price';
    this.resultImageSelector = '.search-result-item__thumbnail img';
    this.addToCartButtonSelector = '.search-result-add-to-cart';
    this.totalResultsLinkSelector = '.ywcas-total-results a';
    this.noResultsMessageSelector = '.ywcas-popover-results p';
    
    // Cart selectors
    this.cartCountSelector = '.astra-icon[data-cart-total]';
    this.cartIconSelector = '.ast-site-header-cart-li a';
  }

  clickInputSearch() {
    this.verifyElementVisible(this.searchWidgetSelector);
    this.clickButton(this.searchInputSelector);
  }

  searchKeyword(keyword) {
    this.clearAndType(this.searchInputSelector, keyword);
  }

  checkSearchLayout() {
    this.verifyElementVisible(this.searchInputSelector);
    cy.get(this.searchInputSelector)
      .should('have.attr', 'placeholder', 'Tìm kiếm sản phẩm...')
      .and('have.value', '');
    this.verifyElementVisible(this.searchIconSelector);
  }

  keywordNotExits(keyword) {
    this.verifyElementVisible(this.searchDropdownSelector);
    this.verifyElementContainsText(this.searchResultsGridSelector, `0 results for "${keyword}"`);
  }
  
  verifySearchResults() {
    this.verifyElementVisible(this.searchDropdownSelector);
    this.verifyElementVisible(this.searchResultsGridSelector);
    cy.get(this.searchResultItemSelector).should('have.length.at.least', 1);
    
    cy.get(this.searchResultItemSelector).first().within(() => {
      this.verifyElementVisible(this.resultNameSelector);
      this.verifyElementVisible(this.resultPriceSelector);
      this.verifyElementVisible(this.resultImageSelector);
      this.verifyElementVisible(this.addToCartButtonSelector);
    });
    
    cy.get(this.totalResultsLinkSelector).should('exist');
  }
  
  verifyNoResults() {
    this.verifyElementVisible(this.noResultsDropdownSelector);
    this.verifyElementContainsText(this.noResultsMessageSelector, 'Không có kết quả. Hãy thử với từ khóa khác!');
  }

  verifyResultPage(keyword) {
    this.clickButton(this.searchIconSelector);
    this.verifyCurrentUrl('/?ywcas=1&post_type=product&lang=vi&s=');
  }

  clickFirstProduct() {
    cy.get(this.searchResultItemSelector).first()
      .find(this.resultNameSelector).click();
    this.verifyCurrentUrl('/product/');
  }

  clickAddToCart() {
    this.getCartCount().then((currentCount) => {
      const initialCount = parseInt(currentCount) || 0;
      
      cy.get(this.searchResultItemSelector).first().within(() => {
        cy.get(this.addToCartButtonSelector).contains('Thêm vào giỏ hàng').click();
      });
      
      cy.reload();
      cy.get(this.cartIconSelector).should('have.attr', 'aria-label', 'View Shopping Cart, 1 items');

      this.getCartCount().then((newCount) => {
        const updatedCount = parseInt(newCount) || 0;
        expect(updatedCount).to.be.greaterThan(initialCount);
      });
    });
  }

  clickSelectOption() {
    cy.get(this.searchResultItemSelector).first().within(() => {
      cy.get(this.addToCartButtonSelector).contains('Lựa chọn tùy chọn').click();
    });
    this.verifyCurrentUrl('/product/');
  }

  clickViewAllProducts() {
    this.clickButton(this.totalResultsLinkSelector);
    this.verifyCurrentUrl('/?ywcas=1&post_type=product&lang=vi&s=');
  }

  verifyKeywordMatchInResults(keyword) {
    cy.get(this.searchResultItemSelector).should('have.length.at.least', 1);
    cy.get(this.searchResultItemSelector).each(($item) => {
      cy.wrap($item).find(this.resultNameSelector).invoke('text').then((productName) => {
        const normalizedKeyword = keyword.toLowerCase().trim();
        const normalizedProductName = this.normalizeText(productName.toLowerCase());
        expect(normalizedProductName).to.include(normalizedKeyword);
      });
    });
  }
}

export default SearchFunction;