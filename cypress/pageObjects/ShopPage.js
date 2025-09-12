// ShopPage.js - Updated implementation
const CART_COUNT_SEL = '.astra-icon[data-cart-total]';
const DATA_PRODUCTS1_SEL = '.astra-shop-summary-wrap [data-product_id="1342"]';
const DATA_PRODUCTS2_SEL = '.astra-shop-summary-wrap [data-product_id="844"]';
const DATA_PRODUCTS3_SEL = '.astra-shop-summary-wrap [data-product_id="1322"]';
const DATA_PRODUCTS4_SEL = '.astra-shop-summary-wrap [data-product_id="1501"]';
const DATA_PRODUCTS5_SEL = '.astra-shop-summary-wrap [data-product_id="1505"]';
const VIEW_PRODUCT_SEL = '.astra-shop-thumbnail-wrap a';
const DATA_PRODUCTS_SEL = '.astra-shop-summary-wrap [data-product_id="1338"]';
// Product detail page selectors
const PRODUCT_TITLE_SEL = 'h1.product_title.entry-title';
const VARIATION_SELECT_SEL = '.variations select';
const ADD_TO_CART_VARIATION_BTN_SEL = '.woocommerce-variation-add-to-cart button[type="submit"]';
const SUCCESS_MESSAGE_SEL = '.woocommerce-notices-wrapper .woocommerce-message';
const VIEW_CART_BTN_SEL = '.woocommerce-message .button.wc-forward';

// Navigation selectors
const POTTED_PLANTS_NAV_SEL = '#menu-item-1004';
const AIR_PLANTS_NAV_SEL = '#menu-item-1006';
const POTS_PLANTERS_NAV_SEL = '#menu-item-1007';
const CARE_TOOLS_NAV_SEL = '#menu-item-1005';
const SHOP_MENU_SEL = '#menu-item-22';
// Filter selectors
const SORT_SELECT_SEL = '.woocommerce-ordering select[name="orderby"]';
const PRICE_SEL = '.price .woocommerce-Price-amount';
const ITEM_PRODUCT_SEL = '.products.columns-3 li'

const PAGINATION_NAV_SEL = '.woocommerce-pagination';
const PAGE_NUMBERS_SEL = '.page-numbers';
const CURRENT_PAGE_SEL = '.page-numbers.current';
const NEXT_PAGE_SEL = '.next.page-numbers';
const PREV_PAGE_SEL = '.prev.page-numbers';
const PAGE_NUMBER_LINK_SEL = 'a.page-numbers:not(.prev):not(.next)';

class ShopPage {
    addProductToCart() {
        cy.get(DATA_PRODUCTS1_SEL).scrollIntoView().click();
        cy.get(DATA_PRODUCTS1_SEL).should('have.class', 'added');
        cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((count) => {
            expect(parseInt(count)).to.be.greaterThan(0);
        });
    }

    addProductToCart2() {
        cy.get(DATA_PRODUCTS_SEL).scrollIntoView().click();
        cy.get(DATA_PRODUCTS_SEL).should('have.class', 'added');
        cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((count) => {
            expect(parseInt(count)).to.be.greaterThan(0);
        
        });
    }

    addMultipleProductsToCart() {
        cy.get(DATA_PRODUCTS1_SEL).scrollIntoView().click();
        cy.get(DATA_PRODUCTS1_SEL).should('have.class', 'added');
        cy.get(DATA_PRODUCTS2_SEL).scrollIntoView().click();
        cy.get(DATA_PRODUCTS2_SEL).should('have.class', 'added');
        cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((count) => {
            expect(parseInt(count)).to.be.greaterThan(0);
        });
    }

    addSelectedProductToCart() {
        cy.get(DATA_PRODUCTS3_SEL).scrollIntoView().click();
        cy.url().should('include', '/product/');
        
        cy.get(PRODUCT_TITLE_SEL).invoke('text').then((name) => {
            const nameProduct = name.replace(/\s+/g, ' ').replace(/(^\s|\s$)/g, '');
            
            cy.selectByIndex(VARIATION_SELECT_SEL,1);
                            
            cy.get(ADD_TO_CART_VARIATION_BTN_SEL)
            .should('not.have.class', 'disabled')
            .and('not.have.class', 'wc-variation-selection-needed');
            cy.get(ADD_TO_CART_VARIATION_BTN_SEL).click();
            
            cy.get(SUCCESS_MESSAGE_SEL).should('be.visible').then(($el) => {
                const text = $el.text().replace(/\s+/g, ' ').trim();
                expect(text).to.include(`“${nameProduct}” đã được thêm vào giỏ hàng. Xem giỏ hàng`);
                cy.get(VIEW_CART_BTN_SEL)
                .should('be.visible')
                .and('have.text', 'Xem giỏ hàng');
            });
            cy.get(CART_COUNT_SEL).invoke('attr', 'data-cart-total').then((count) => {
            expect(parseInt(count)).to.be.greaterThan(0);
        });
        });
    }

    addProductSoldOut() {
        cy.get(DATA_PRODUCTS4_SEL).scrollIntoView()
          .should('contain.text', 'Đọc tiếp')
          .and('not.have.class', 'add_to_cart_button')
          .and('have.class', 'product_type_simple');
        cy.get(DATA_PRODUCTS4_SEL).click();
        cy.url().should('include', '/product/');
    }

    addSelectedProductSoldOut() {
        cy.get(DATA_PRODUCTS5_SEL).scrollIntoView().click();
        cy.url().should('include', '/product/');
        
        cy.get(ADD_TO_CART_VARIATION_BTN_SEL)
          .should('have.class', 'disabled')
          .and('have.class', 'wc-variation-selection-needed')
          .and('contain.text', 'Thêm vào giỏ hàng');
        
        cy.get('body').then(($body) => {
            if ($body.find(VARIATION_SELECT_SEL).length > 0) {
                cy.get(VARIATION_SELECT_SEL).select(1);
                cy.get(ADD_TO_CART_VARIATION_BTN_SEL).should('have.class', 'disabled');
            }
        });
    }

    viewProduct(){
        cy.get(VIEW_PRODUCT_SEL).first().click();
        cy.url().should('include', '/product');
    }

    navigateToPottedPlants() {
        cy.get(SHOP_MENU_SEL).realHover({timeout: 150});
        cy.get(POTTED_PLANTS_NAV_SEL).click();
        cy.url().should('include', '/product-category/all-potted-plants');
        cy.get('h1').should('contain.text', 'Cây trồng trong chậu');
    }

    navigateToAirPlants() {
        cy.get(SHOP_MENU_SEL).realHover({timeout: 150});
        cy.get(AIR_PLANTS_NAV_SEL).click();
        cy.url().should('include', '/product-category/air-plants');
        cy.get('h1').should('contain.text', 'Cây trồng trong không khí');
    }

    navigateToPotsAndPlanters() {
        cy.get(SHOP_MENU_SEL).realHover({timeout: 150});
        cy.get(POTS_PLANTERS_NAV_SEL).click();
        cy.url().should('include', '/product-category/pots-planters');
        cy.get('h1').should('contain.text', 'Chậu trồng cây');
    }

    navigateToCareTools() {
        cy.get(SHOP_MENU_SEL).realHover({timeout: 150});
        cy.get(CARE_TOOLS_NAV_SEL).click();
        cy.url().should('include', '/product-category/care-tools');
        cy.get('h1').should('contain.text', 'Dụng cụ chăm sóc');
    }

    sortByPopularity() {
    cy.url().then((currentUrl) => {
        if (currentUrl.includes('/shop') && !currentUrl.includes('orderby=')) {
            cy.selectByIndex(SORT_SELECT_SEL,0);
            cy.url().should('include', '/');
        } else {
        cy.selectVariationByIndex(SORT_SELECT_SEL, 0);
        cy.url().should('include', 'orderby=popularity');
        }
    });
    }

    sortByRating() {
        cy.selectByIndex(SORT_SELECT_SEL,1);
        cy.url().should('include', 'orderby=rating');
    }

    sortByNewest() {
        cy.selectByIndex(SORT_SELECT_SEL,2);
        cy.url().should('include', 'orderby=date');
    }

    sortByPriceLowToHigh() {
        cy.selectByIndex(SORT_SELECT_SEL,3);
        cy.url().should('include', 'orderby=price');
        cy.get(ITEM_PRODUCT_SEL).then(($products) => {
            const productPrices = [];
            $products.each((index, product) => {
                const $priceElements = Cypress.$(product).find(PRICE_SEL);
                let maxPrice = 0;
                
                $priceElements.each((priceIndex, priceElement) => {
                    const priceText = Cypress.$(priceElement).text();
                    const price = parseInt(priceText.replace(/[^\d]/g, ''));
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
        cy.selectByIndex(SORT_SELECT_SEL, 4);
        cy.url().should('include', 'orderby=price-desc');
        cy.get(ITEM_PRODUCT_SEL).then(($products) => {
            const productPrices = [];
            $products.each((index, product) => {
                const $priceElements = Cypress.$(product).find(PRICE_SEL);
                let maxPrice = 0;
                
                $priceElements.each((priceIndex, priceElement) => {
                    const priceText = Cypress.$(priceElement).text();
                    const price = parseInt(priceText.replace(/[^\d]/g, ''));
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
        cy.get(PAGINATION_NAV_SEL).should('be.visible').scrollIntoView();
        cy.get(PAGE_NUMBERS_SEL).should('have.length.at.least', 2);
        cy.get(PAGE_NUMBER_LINK_SEL).then(($pages) => {
            const pageCount = $pages.length;
            expect(pageCount).to.be.at.least(2);
        });
        cy.get(CURRENT_PAGE_SEL).should('be.visible').and('have.css', 'background-color', 'rgb(84, 180, 53)');
    }
           

    checkFirstPagePagination() {
        cy.get(PAGINATION_NAV_SEL).should('be.visible').scrollIntoView();
        cy.get(CURRENT_PAGE_SEL).should('be.visible')
            .and('have.css', 'background-color', 'rgb(84, 180, 53)');
        cy.get(PREV_PAGE_SEL).should('not.exist'); 
        cy.get(NEXT_PAGE_SEL).should('be.visible'); 
    }

    checkLastPagePagination() {
        cy.get(PAGINATION_NAV_SEL).should('be.visible').scrollIntoView();
        cy.get(PAGE_NUMBER_LINK_SEL).last().click();
        cy.get(CURRENT_PAGE_SEL).should('be.visible')
            .and('have.css', 'background-color', 'rgb(84, 180, 53)');
        cy.get(NEXT_PAGE_SEL).should('not.exist');
        cy.get(PREV_PAGE_SEL).should('be.visible');
    }

    clickMiddlePage() {
        cy.get(PAGE_NUMBER_LINK_SEL).then(($pages) => {
            const middlePageIndex = 1; 
            const $targetPage = $pages.eq(middlePageIndex);
            cy.wrap($targetPage).invoke('text').then((pageText) => {
                const targetPageNum = parseInt(pageText.trim());
                cy.wrap($targetPage).click();
                cy.url().should('include', `/page/${targetPageNum}`);
                cy.get(PREV_PAGE_SEL).should('be.visible');
                cy.get(NEXT_PAGE_SEL).should('be.visible');
                cy.get(CURRENT_PAGE_SEL).should('be.visible')
                    .and('have.css', 'background-color', 'rgb(84, 180, 53)')
                    .and('contain.text', targetPageNum.toString());
            });
        });
    }

    goToNextPage() {
        cy.get(PAGINATION_NAV_SEL).should('be.visible');
        cy.get(CURRENT_PAGE_SEL).invoke('text').then((currentPage) => {
            const currentPageNum = parseInt(currentPage.trim())
            cy.get(NEXT_PAGE_SEL).click();
            cy.url().should('include', `/page/${currentPageNum + 1}`);
            cy.get(CURRENT_PAGE_SEL).should('contain.text', (currentPageNum + 1).toString())
              .and('have.css', 'background-color', 'rgb(84, 180, 53)');
        });
    }

    goToPreviousPage() {
    cy.get(PAGINATION_NAV_SEL).should('be.visible');
    cy.get(CURRENT_PAGE_SEL).invoke('text').then((currentPage) => {
        const currentPageNum = parseInt(currentPage.trim());
        const previousPageNum = currentPageNum - 1;
        cy.get(PREV_PAGE_SEL).click();
        if (previousPageNum === 1) {
            cy.url().should('include', '/shop').and('not.include', '/page/');
        } else {
            cy.url().should('include', `/page/${previousPageNum}`);
        }
        cy.get(CURRENT_PAGE_SEL).should('contain.text', previousPageNum.toString())
          .and('have.css', 'background-color', 'rgb(84, 180, 53)');
    });
}
}

export default ShopPage;