class BasePage {
  verifyCurrentUrl(expectedUrl) {
    cy.url().should('include', expectedUrl);
  }
  
  verifyElementVisible(selector) {
    cy.get(selector, { timeout: 10000 }).should('be.visible');
  }
  
  verifyElementContainsText(selector, text) {
    cy.get(selector).should('be.visible').and('contain.text', text);
  }

  verifyElementContains(selector, text) {
    cy.get(selector).should('be.visible').contains(text);
  }

  clearAndType(selector, value) {
    if (value) {
      cy.get(selector).clear().type(value);
    }
  }
  
  clickButton(selector) {
    cy.get(selector).click();
  }

  clickFirstButton(selector) {
    cy.get(selector).first().click();
  }
  
  checkCheckbox(selector) {
    cy.get(selector).check();
  }
  
  uncheckCheckbox(selector) {
    cy.get(selector).uncheck();
  }
  
  getCartCount() {
    return cy.get('.astra-icon[data-cart-total]').invoke('attr', 'data-cart-total');
  }
  
  verifyCartCountGreaterThan(count) {
    cy.get('.astra-icon[data-cart-total]').invoke('attr', 'data-cart-total').then((currentCount) => {
      expect(parseInt(currentCount)).to.be.greaterThan(count);
    });
  }
  
  hoverElement(selector, timeout = 150) {
    cy.get(selector).realHover({ timeout });
  }
  
  scrollIntoView(selector) {
    cy.get(selector).scrollIntoView();
  }
  
  normalizeText(text) {
    return text.replace(/\s+/g, ' ').replace(/(^\s|\s$)/g, '');
  }
  
  extractPrice(priceText) {
    return parseInt(priceText.replace(/\./g, '').replace(/[^\d]/g, ''));
  }
  
  ifElementExists(selector, callback) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        callback();
      }
    });
  }
  
}

export default BasePage;