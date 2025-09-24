import BasePage from './BasePage';

class ProductDetailPage extends BasePage {
  constructor() {
    super();
    
    // Product navigation selectors
    this.product1Selector = '.post-1338 .astra-shop-thumbnail-wrap';
    this.product2Selector = '.post-1322 .astra-shop-thumbnail-wrap';
    
    // Product detail selectors
    this.productTitleSelector = '.product_title';
    this.productPriceSelector = '.price';
    this.productDescriptionSelector = '.woocommerce-product-details__short-description';
    this.stockSelector = '.ast-stock-detail';
    this.categorySelector = 'span.posted_in';
    this.tagSelector = 'span.tagged_as';
    this.paymentMethodSelector = '.ast-single-product-payments';
    
    // Quantity control selectors
    this.quantityInputSelector = 'input[name="quantity"]';
    this.quantityPlusButtonSelector = '#plus_qty-0';
    this.quantityMinusButtonSelector = '#minus_qty-0';
    this.addToCartButtonSelector = 'button[type="submit"]';
    
    // Variation selectors
    this.variationsSelector = '.variations';
    this.variationSelectSelector = '.variations select';
    this.resetVariationsSelector = '.reset_variations';
    
    // Tab selectors
    this.tabDescriptionSelector = '#tab-title-description';
    this.tabDescriptionPanelSelector = '#tab-description';
    this.tabAdditionalInfoSelector = '#tab-title-additional_information';
    this.tabAdditionalInfoPanelSelector = '#tab-additional_information';
    this.tabReviewsSelector = '#tab-title-reviews';
    this.tabReviewsPanelSelector = '#tab-reviews';
    
    // Review form selectors
    this.mustLoginSelector = '.must-log-in';
    this.reviewFormSelector = '#review_form_wrapper';
    this.ratingStarsSelector = '.stars';
    this.commentTextareaSelector = '#comment';
    this.submitReviewSelector = '#submit';
    this.starRatingSelector = '.star-';
    this.messageCommentSelector = '.meta em';
    
    // Related product selectors
    this.similarProductSelector = 'section.related.products';
    
    // Wishlist selectors
    this.addToWishlistSelector = '.yith-add-to-wishlist-button-block--initialized';
    this.removeFromWishlistSelector = '.yith-wcwl-add-to-wishlist-button--anchor';
  }

  formProductDetail() {
    this.verifyElementVisible(this.productTitleSelector);
    this.verifyElementVisible(this.productPriceSelector);
    this.verifyElementVisible(this.quantityMinusButtonSelector);
    this.verifyElementVisible(this.quantityInputSelector);
    cy.get(this.quantityInputSelector).should('have.value', '1');
    this.verifyElementVisible(this.quantityPlusButtonSelector);
    this.verifyElementVisible(this.productDescriptionSelector);
    this.verifyElementContainsText(this.categorySelector, 'Danh mục:');
    this.verifyElementContainsText(this.tagSelector, 'Thẻ:');
    this.verifyElementVisible(this.paymentMethodSelector);

    this.scrollIntoView(this.tabDescriptionSelector);
    this.verifyElementVisible(this.tabDescriptionSelector);
    this.verifyElementVisible(this.tabAdditionalInfoSelector);
    this.verifyElementVisible(this.tabReviewsSelector);
    
    this.scrollIntoView(this.tabDescriptionPanelSelector);
    this.verifyElementVisible(this.tabDescriptionPanelSelector);
    cy.get(this.tabDescriptionPanelSelector).should('not.have.css', 'display', 'none');
    
    this.scrollIntoView(this.similarProductSelector);
    this.verifyElementVisible(this.similarProductSelector);
  }

  verifyProductWithoutVariations() {
    this.clickButton(this.product1Selector);
    this.formProductDetail();
    this.verifyElementContainsText(this.stockSelector, 'Trạng thái');
    this.verifyElementContainsText(this.addToCartButtonSelector, 'Thêm vào giỏ hàng');
  }

  verifyProductWithVariations() {
    this.clickButton(this.product2Selector);
    this.formProductDetail();
    this.verifyElementVisible(this.variationsSelector);
    cy.get(this.resetVariationsSelector).should('not.be.visible');
    cy.get(this.addToCartButtonSelector).should('have.class', 'wc-variation-selection-needed');
  }

  verifyRemoveProductVariations() {
    this.clickButton(this.product2Selector);
    this.verifyElementVisible(this.variationsSelector);
    cy.selectByIndex(this.variationSelectSelector, 1);
    this.verifyElementVisible(this.resetVariationsSelector);
    this.verifyElementContainsText(this.stockSelector, 'Trạng thái');
    cy.get(this.addToCartButtonSelector).should('not.have.class', 'wc-variation-selection-needed');
    
    this.clickButton(this.resetVariationsSelector);
    cy.get(this.addToCartButtonSelector).should('have.class', 'wc-variation-selection-needed');
  }

  verifyReviewTabNotLoggedIn() {
    this.clickButton(this.product1Selector);
    this.scrollIntoView(this.tabReviewsSelector);
    this.clickButton(this.tabReviewsSelector);
    this.verifyElementVisible(this.tabReviewsPanelSelector);
    this.verifyElementContainsText(this.mustLoginSelector, 'Bạn phải đăng nhập để gửi đánh giá');
  }

  verifyAllTabsWhenLoggedIn() {
    this.clickButton(this.product1Selector);
    cy.get(this.tabDescriptionPanelSelector).should('not.have.css', 'display', 'none');
    
    this.clickButton(this.tabAdditionalInfoSelector);
    cy.get(this.tabAdditionalInfoPanelSelector).should('not.have.css', 'display', 'none');
    
    this.clickButton(this.tabReviewsSelector);
    cy.get(this.tabReviewsPanelSelector).should('not.have.css', 'display', 'none');
    this.verifyElementVisible(this.reviewFormSelector);
    this.verifyElementVisible(this.ratingStarsSelector);
    this.verifyElementVisible(this.commentTextareaSelector);
    this.verifyElementContains(this.submitReviewSelector, 'Gửi đi');
  }

  verifyWriteReview() {
    this.clickButton(this.product1Selector);
    this.clickButton(this.tabReviewsSelector);
    cy.get(this.tabReviewsPanelSelector).should('not.have.css', 'display', 'none');
    
    this.clickButton(`${this.starRatingSelector}5`);
    this.clearAndType(this.commentTextareaSelector, 'Đây là sản phẩm đẹp mà tôi rất thích!');
    this.clickButton(this.submitReviewSelector);
    
    this.verifyElementContainsText(this.messageCommentSelector, 'Đánh giá của bạn đang chờ phê duyệt');
  }
}

export default ProductDetailPage;