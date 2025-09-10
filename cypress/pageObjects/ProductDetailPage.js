// ProductDetailPage.js
const DATA_PRODUCTS1_SEL = '.post-1338 .astra-shop-thumbnail-wrap';  // Sản phẩm không có lựa chọn
const DATA_PRODUCTS2_SEL = '.post-1322 .astra-shop-thumbnail-wrap';  // Sản phẩm có lựa chọn

// Product detail selectors
const PRODUCT_TITLE_SEL = '.product_title';
const PRODUCT_PRICE_SEL = '.price';
const PRODUCT_DESCRIPTION_SEL = '.woocommerce-product-details__short-description';
const STOCK_SEL ='.ast-stock-detail';
const QUANTITY_INPUT_SEL = 'input[name="quantity"]';
const QUANTITY_PLUS_BTN_SEL = '#plus_qty-0';
const QUANTITY_MINUS_BTN_SEL = '#minus_qty-0';
const ADD_TO_CART_SEL ='button[type="submit"]';

const CATEGORY_SEL ='span.posted_in';
const TAG_SEL = 'span.tagged_as';
const PAYMENT_METHOD_SEL = '.ast-single-product-payments';
const VARIATIONS_SEL = '.variations';
const VARIATION_SELECT_SEL = '.variations select';
const RESET_VARIATIONS_SEL = '.reset_variations';

// Tabs selectors
const TAB_DESCRIPTION_SEL = '#tab-title-description';
const TAB_DESCRIPTION_PANEL_SEL = '#tab-description';
const TAB_ADDITIONAL_INFO_SEL = '#tab-title-additional_information';
const TAB_ADDITIONAL_INFO_PANEL_SEL = '#tab-additional_information';
const TAB_REVIEWS_SEL = '#tab-title-reviews';
const TAB_REVIEWS_PANEL_SEL = '#tab-reviews';

const SIMILAR_PRODUCT_SEL = 'section.related.products';
// Review selectors
const MUST_LOGIN_SEL = '.must-log-in';
const REVIEW_FORM_SEL = '#review_form_wrapper';
const RATING_STARS_SEL = '.stars';
const COMMENT_TEXTAREA_SEL = '#comment';
const SUBMIT_REVIEW_SEL = '#submit';
const STAR_RATING_SEL = '.star-';
const MESSENGA_COMMENT_SEL = '.meta em';

// Wishlist selectors
const ADD_TO_WISHLIST = '.yith-add-to-wishlist-button-block--initialized';
const REMOVE_FROM_WISHLIST_SEL = '.yith-wcwl-add-to-wishlist-button--anchor';

class ProductDetailPage {

    formProductDetail(){
        cy.get(PRODUCT_TITLE_SEL).should('be.visible');
        cy.get(PRODUCT_PRICE_SEL).should('be.visible');
        cy.get(QUANTITY_MINUS_BTN_SEL).should('be.visible');
        cy.get(QUANTITY_INPUT_SEL).should('be.visible').and('have.value', '1');
        cy.get(QUANTITY_PLUS_BTN_SEL).should('be.visible');
        cy.get(PRODUCT_DESCRIPTION_SEL).should('be.visible');
        cy.get(CATEGORY_SEL).should('be.visible').contains('Danh mục:');
        cy.get(TAG_SEL).should('be.visible').contains('Thẻ:');
        cy.get(PAYMENT_METHOD_SEL).should('be.visible');

        cy.get(TAB_DESCRIPTION_SEL).scrollIntoView().should('be.visible');
        cy.get(TAB_ADDITIONAL_INFO_SEL).should('be.visible');
        cy.get(TAB_REVIEWS_SEL).should('be.visible');
        cy.get(TAB_DESCRIPTION_PANEL_SEL).scrollIntoView().should('be.visible').and('not.have.css', 'display', 'none');
        cy.get(SIMILAR_PRODUCT_SEL).scrollIntoView().should('be.visible');
    }
    
    verifyProductWithoutVariations() {
        cy.get(DATA_PRODUCTS1_SEL).click();
        this.formProductDetail();
        cy.get(STOCK_SEL).should('be.visible').contains('Trạng thái');
        cy.get(ADD_TO_CART_SEL).should('be.visible').contains('Thêm vào giỏ hàng');
    }

    verifyProductWithVariations() {
        cy.get(DATA_PRODUCTS2_SEL).click();
        this.formProductDetail();
        cy.get(VARIATIONS_SEL).should('be.visible');
        cy.get(RESET_VARIATIONS_SEL).should('not.be.visible');
        cy.get(ADD_TO_CART_SEL).scrollIntoView().should('have.class', 'wc-variation-selection-needed');
    }

    verifyRemoveProductVariations() {
        cy.get(DATA_PRODUCTS2_SEL).click();
        cy.get(VARIATIONS_SEL).should('be.visible');
        cy.selectByIndex(VARIATION_SELECT_SEL, 1)
        cy.get(RESET_VARIATIONS_SEL).should('be.visible');
        cy.get(STOCK_SEL).should('be.visible').contains('Trạng thái');
        cy.get(ADD_TO_CART_SEL).should('not.have.class', 'wc-variation-selection-needed');
        cy.get(RESET_VARIATIONS_SEL).click();
        cy.get(ADD_TO_CART_SEL).should('have.class', 'wc-variation-selection-needed');
    }

    verifyReviewTabNotLoggedIn() {
        cy.get(DATA_PRODUCTS1_SEL).click();
        cy.get(TAB_REVIEWS_SEL).scrollIntoView().click();
        cy.get(TAB_REVIEWS_PANEL_SEL).should('be.visible');
        cy.get(MUST_LOGIN_SEL).should('be.visible')
            .and('contain.text', 'Bạn phải đăng nhập để gửi đánh giá');
    }

    verifyAllTabsWhenLoggedIn() {
        cy.get(DATA_PRODUCTS1_SEL).click();
        cy.get(TAB_DESCRIPTION_PANEL_SEL).should('not.have.css', 'display', 'none');
        
        cy.get(TAB_ADDITIONAL_INFO_SEL).click();
        cy.get(TAB_ADDITIONAL_INFO_PANEL_SEL).should('not.have.css', 'display', 'none');
        cy.get(TAB_REVIEWS_SEL).click();
        cy.get(TAB_REVIEWS_PANEL_SEL).should('not.have.css', 'display', 'none');
        cy.get(REVIEW_FORM_SEL).should('be.visible');
        cy.get(RATING_STARS_SEL).should('be.visible');
        cy.get(COMMENT_TEXTAREA_SEL).should('be.visible');
        cy.get(SUBMIT_REVIEW_SEL).should('be.visible').contais('Gửi đi');
    }

    verifyWriteReview() {
        cy.get(DATA_PRODUCTS1_SEL).click();
        cy.get(TAB_REVIEWS_SEL).click();
        cy.get(TAB_REVIEWS_PANEL_SEL).should('not.have.css', 'display', 'none');
        
        cy.get(`${STAR_RATING_SEL}5`).click();
        cy.get(COMMENT_TEXTAREA_SEL).type('Sản phẩm này rất đẹp thích hợp để đeo lên tay chậu giúp chậu nổi bật hơn');
        cy.get(SUBMIT_REVIEW_SEL).click();
        
        cy.get(MESSENGA_COMMENT_SEL).should('contain.text', 'Đánh giá của bạn đang chờ phê duyệt');
    }
}

export default ProductDetailPage;