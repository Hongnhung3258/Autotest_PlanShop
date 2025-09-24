import BasePage from './BasePage';

class ShopPage extends BasePage {
  constructor() {
    super();
    // Product selectors - specific product IDs
    this.product1Selector = '.astra-shop-summary-wrap [data-product_id="1342"]';
    this.product2Selector = '.astra-shop-summary-wrap [data-product_id="844"]';
    this.product3Selector = '.astra-shop-summary-wrap [data-product_id="1322"]';
    this.product4Selector = '.astra-shop-summary-wrap [data-product_id="1501"]';
    this.product5Selector = '.astra-shop-summary-wrap [data-product_id="1505"]';
    this.productGeneralSelector = '.astra-shop-summary-wrap [data-product_id="1338"]';
    this.viewProductSelector = '.astra-shop-thumbnail-wrap a';
    
    // Product detail page selectors
    this.productTitleSelector = 'h1.product_title.entry-title';
    this.variationSelectSelector = '.variations select';
    this.addToCartVariationButtonSelector = '.woocommerce-variation-add-to-cart button[type="submit"]';
    this.successMessageSelector = '.woocommerce-notices-wrapper .woocommerce-message';
    this.viewCartButtonSelector = '.woocommerce-message .button.wc-forward';
    
    // Navigation menu selectors
    this.shopMenuSelector = '#menu-item-22';
    this.pottedPlantsNavSelector = '#menu-item-1004';
    this.airPlantsNavSelector = '#menu-item-1006';
    this.potsAndPlantersNavSelector = '#menu-item-1007';
    this.careToolsNavSelector = '#menu-item-1005';
    
    // Filter and sorting selectors
    this.sortSelectSelector = '.woocommerce-ordering select[name="orderby"]';
    this.priceSelector = '.price .woocommerce-Price-amount';
    this.itemProductSelector = '.products.columns-3 li';
    
    // Pagination selectors
    this.paginationNavSelector = '.woocommerce-pagination';
    this.pageNumbersSelector = '.page-numbers';
    this.currentPageSelector = '.page-numbers.current';
    this.nextPageSelector = '.next.page-numbers';
    this.previousPageSelector = '.prev.page-numbers';
    this.pageNumberLinkSelector = 'a.page-numbers:not(.prev):not(.next)';
    
    // Cart selector
    this.cartCountSelector = '.astra-icon[data-cart-total]';
  }

  addProductToCart() {
    this.clickButton(this.product1Selector);
    cy.get(this.product1Selector).should('have.class', 'added');
    this.verifyCartCountGreaterThan(0);
  }

  addProductToCart2() {
    this.clickButton(this.productGeneralSelector);
    cy.get(this.productGeneralSelector).should('have.class', 'added');
    this.verifyCartCountGreaterThan(0);
  }

  addMultipleProductsToCart() {
    this.clickButton(this.product1Selector);
    cy.get(this.product1Selector).should('have.class', 'added');
    
    this.clickButton(this.product2Selector);
    cy.get(this.product2Selector).should('have.class', 'added');
    this.verifyCartCountGreaterThan(0);
  }

  addSelectedProductToCart() {
    this.clickButton(this.product3Selector);
    this.verifyCurrentUrl('/product/');
    
    cy.get(this.productTitleSelector).invoke('text').then((name) => {
      const nameProduct = this.normalizeText(name);
      
      cy.selectByIndex(this.variationSelectSelector, 1);
      
      cy.get(this.addToCartVariationButtonSelector)
        .should('not.have.class', 'disabled')
        .and('not.have.class', 'wc-variation-selection-needed');
      
      this.clickButton(this.addToCartVariationButtonSelector);
      
      cy.get(this.successMessageSelector).should('be.visible').then(($el) => {
        const text = $el.text().replace(/\s+/g, ' ').replace(/[“”]/g, '"').trim();
        expect(text).to.include(`"${nameProduct}" đã được thêm vào giỏ hàng. Xem giỏ hàng`);
        
        this.verifyElementVisible(this.viewCartButtonSelector);
        cy.get(this.viewCartButtonSelector).should('have.text', 'Xem giỏ hàng');
      });
      
      this.verifyCartCountGreaterThan(0);
    });
  }

  addProductSoldOut() {
    this.scrollIntoView(this.product4Selector);
    cy.get(this.product4Selector)
      .should('contain.text', 'Đọc tiếp')
      .and('not.have.class', 'add_to_cart_button')
      .and('have.class', 'product_type_simple');
    this.clickButton(this.product4Selector);
    this.verifyCurrentUrl('/product/');
  }

  addSelectedProductSoldOut() {
    this.scrollIntoView(this.product5Selector);
    this.clickButton(this.product5Selector);
    this.verifyCurrentUrl('/product/');
    
    cy.get(this.addToCartVariationButtonSelector)
      .should('have.class', 'disabled')
      .and('have.class', 'wc-variation-selection-needed')
      .and('contain.text', 'Thêm vào giỏ hàng');
    
    this.ifElementExists(this.variationSelectSelector, () => {
      cy.get(this.variationSelectSelector).select(1);
      cy.get(this.addToCartVariationButtonSelector).should('have.class', 'disabled');
    });
  }

  viewProduct() {
    this.clickFirstButton(this.viewProductSelector);
    this.verifyCurrentUrl('/product');
  }

  navigateToCategory(category) {
    const config = {
        pottedPlants: {
        selector: this.pottedPlantsNavSelector,
        url: '/product-category/all-potted-plants',
        heading: 'Cây trồng trong chậu'
        },
        airPlants: {
        selector: this.airPlantsNavSelector,
        url: '/product-category/air-plants',
        heading: 'Cây trồng trong không khí'
        },
        potsAndPlanters: {
        selector: this.potsAndPlantersNavSelector,
        url: '/product-category/pots-planters',
        heading: 'Chậu trồng cây'
        },
        careTools: {
        selector: this.careToolsNavSelector,
        url: '/product-category/care-tools',
        heading: 'Dụng cụ chăm sóc'
        }
    };

    const { selector, url, heading } = config[category];

    this.hoverElement(this.shopMenuSelector, 150);
    this.clickButton(selector);
    this.verifyCurrentUrl(url);
    this.verifyElementContainsText('h1', heading);
}


  sortByPopularity() {
    cy.url().then((currentUrl) => {
      if (currentUrl.includes('/shop') && !currentUrl.includes('orderby=')) {
        cy.selectByIndex(this.sortSelectSelector, 0);
        this.verifyCurrentUrl('/');
      } else {
        cy.selectByIndex(this.sortSelectSelector, 0);
        this.verifyCurrentUrl('orderby=popularity');
      }
    });
  }

  sortByRating() {
    cy.selectByIndex(this.sortSelectSelector, 1);
    this.verifyCurrentUrl('orderby=rating');
  }

  sortByNewest() {
    cy.selectByIndex(this.sortSelectSelector, 2);
    this.verifyCurrentUrl('orderby=date');
  }

  sortByPriceLowToHigh() {
    cy.selectByIndex(this.sortSelectSelector, 3);
    this.verifyCurrentUrl('orderby=price');
    
    cy.get(this.itemProductSelector).then(($products) => {
      const productPrices = [];
      $products.each((index, product) => {
        const $priceElements = Cypress.$(product).find(this.priceSelector);
        let maxPrice = 0;
        
        $priceElements.each((priceIndex, priceElement) => {
          const priceText = Cypress.$(priceElement).text();
          const price = this.extractPrice(priceText);
          if (price > maxPrice) {
            maxPrice = price;
          }
        });
        
        if (maxPrice > 0) {
          productPrices.push(maxPrice);
        }
      });
      
      for (let i = 1; i < Math.min(4, productPrices.length); i++) {
        expect(productPrices[i]).to.be.at.least(productPrices[i-1]);
      }
    });
  }

  sortByPriceHighToLow() {
    cy.selectByIndex(this.sortSelectSelector, 4);
    this.verifyCurrentUrl('orderby=price-desc');
    
    cy.get(this.itemProductSelector).then(($products) => {
      const productPrices = [];
      $products.each((index, product) => {
        const $priceElements = Cypress.$(product).find(this.priceSelector);
        let maxPrice = 0;
        
        $priceElements.each((priceIndex, priceElement) => {
          const priceText = Cypress.$(priceElement).text();
          const price = this.extractPrice(priceText);
          if (price > maxPrice) {
            maxPrice = price;
          }
        });
        
        if (maxPrice > 0) {
          productPrices.push(maxPrice);
        }
      });
      
      for (let i = 1; i < Math.min(4, productPrices.length); i++) {
        expect(productPrices[i]).to.be.at.most(productPrices[i-1]);
      }
    });
  }

  checkPaginationDisplay() {
    this.scrollIntoView(this.paginationNavSelector);
    this.verifyElementVisible(this.paginationNavSelector);
    cy.get(this.pageNumbersSelector).should('have.length.at.least', 2);
    
    cy.get(this.pageNumberLinkSelector).then(($pages) => {
      const pageCount = $pages.length;
      expect(pageCount).to.be.at.least(2);
    });
    
    cy.get(this.currentPageSelector)
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(84, 180, 53)');
  }

  checkFirstPagePagination() {
    this.scrollIntoView(this.paginationNavSelector);
    this.verifyElementVisible(this.paginationNavSelector);
    cy.get(this.currentPageSelector)
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(84, 180, 53)');
    cy.get(this.previousPageSelector).should('not.exist');
    this.verifyElementVisible(this.nextPageSelector);
  }

  checkLastPagePagination() {
    this.scrollIntoView(this.paginationNavSelector);
    this.verifyElementVisible(this.paginationNavSelector);
    this.clickButton(this.pageNumberLinkSelector + ':last');
    cy.get(this.currentPageSelector)
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(84, 180, 53)');
    cy.get(this.nextPageSelector).should('not.exist');
    this.verifyElementVisible(this.previousPageSelector);
  }

  clickMiddlePage() {
    cy.get(this.pageNumberLinkSelector).then(($pages) => {
      const middlePageIndex = 1;
      const $targetPage = $pages.eq(middlePageIndex);
      
      cy.wrap($targetPage).invoke('text').then((pageText) => {
        const targetPageNum = parseInt(pageText.trim());
        cy.wrap($targetPage).click();
        this.verifyCurrentUrl(`/page/${targetPageNum}`);
        
        this.verifyElementVisible(this.previousPageSelector);
        this.verifyElementVisible(this.nextPageSelector);
        cy.get(this.currentPageSelector)
          .should('be.visible')
          .and('have.css', 'background-color', 'rgb(84, 180, 53)')
          .and('contain.text', targetPageNum.toString());
      });
    });
  }

  goToNextPage() {
    this.verifyElementVisible(this.paginationNavSelector);
    cy.get(this.currentPageSelector).invoke('text').then((currentPage) => {
      const currentPageNum = parseInt(currentPage.trim());
      this.clickButton(this.nextPageSelector);
      this.verifyCurrentUrl(`/page/${currentPageNum + 1}`);
      cy.get(this.currentPageSelector)
        .should('contain.text', (currentPageNum + 1).toString())
        .and('have.css', 'background-color', 'rgb(84, 180, 53)');
    });
  }

  goToPreviousPage() {
    this.verifyElementVisible(this.paginationNavSelector);
    cy.get(this.currentPageSelector).invoke('text').then((currentPage) => {
      const currentPageNum = parseInt(currentPage.trim());
      const previousPageNum = currentPageNum - 1;
      
      this.clickButton(this.previousPageSelector);
      
      if (previousPageNum === 1) {
        cy.url().should('include', '/shop').and('not.include', '/page/');
      } else {
        this.verifyCurrentUrl(`/page/${previousPageNum}`);
      }
      
      cy.get(this.currentPageSelector)
        .should('contain.text', previousPageNum.toString())
        .and('have.css', 'background-color', 'rgb(84, 180, 53)');
    });
  }
}

export default ShopPage;