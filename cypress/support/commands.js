Cypress.Commands.add('visitPage', () => {
  cy.visit('/');
});

Cypress.Commands.add('visitCartPage', () => {
  cy.visit('/cart');
});

Cypress.Commands.add('visitShopPage', () => {
  cy.visit('/shop');
});

Cypress.Commands.add('visitShopPage2', () => {
  cy.visit('/shop/page/2');
});

Cypress.Commands.add('visitCheckoutPage', () => {
  cy.visit('/checkout');
});

Cypress.Commands.add('closePopup', () => {
  cy.get('body').then(($body) => {
    const popup = $body.find('.xoo-el-inmodal');
    const closeButton = $body.find('.xoo-el-close.xoo-el-icon-cross');
    if (popup.length > 0 && popup.is(':visible')) {
      if (closeButton.length > 0) {
        cy.get('span.xoo-el-close.xoo-el-icon-cross').click({ force: true });
        cy.get('.xoo-el-inmodal').should('not.be.visible', { timeout: 6000 });
      } else {
        cy.task('log', 'Close button not found, skipping close.');
      }
    } else {
      cy.task('log', 'Popup not found or already hidden, skipping close.');
    }
  });
});

// SỬA checkInvalidField - KHÔNG THROW ERROR
Cypress.Commands.add('checkInvalidField', (fieldSelector, errorMsg) => {
  cy.get('body').then($body => {
    if ($body.find(fieldSelector).length === 0) {
      cy.task('recordFailure', { 
        type: 'element_not_found', 
        selector: fieldSelector,
        action: 'checkInvalidField'
      });
      return;
    }
    
    cy.get(fieldSelector).then($input => {
      try {
        const input = $input[0];
        const normalizeMessage = (msg) => {
          return msg
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/['"]/g, '')
            .replace(/\*\*/g, '')
            .replace(/[.,!?]/g, '');
        };
        const normalizedActual = normalizeMessage(input.validationMessage);
        const normalizedExpected = normalizeMessage(errorMsg);
        expect(normalizedActual).to.equal(normalizedExpected);
        
        cy.get(fieldSelector)
          .should('have.focus')
          .should('have.attr', 'required');
      } catch (error) {
        cy.log(`⚠️ checkInvalidField failed: ${error.message}`);
        cy.task('recordFailure', { 
          type: 'assertion_failure', 
          selector: fieldSelector, 
          expected: errorMsg,
          error: error.message 
        });
      }
    });
  });
});

// SỬA checkNotice - KHÔNG THROW ERROR
Cypress.Commands.add('checkNotice', (fieldSelector, errorMsg) => {
  cy.get('body').then($body => {
    if ($body.find(fieldSelector).length === 0) {
      cy.task('recordFailure', { 
        type: 'element_not_found', 
        selector: fieldSelector,
        action: 'checkNotice'
      });
      return;
    }
    
    cy.get(fieldSelector, { timeout: 10000 })
      .should('be.visible')
      .then($element => {
        try {
          const normalizeMessage = (msg) => {
            return msg
              .trim()
              .replace(/\s+/g, ' ')
              .replace(/(^\s|\s$)/g, '')
              .replace(/\*\*/g, '');
          };
          const normalizedActual = normalizeMessage($element.text());
          const normalizedExpected = normalizeMessage(errorMsg);
          expect(normalizedActual).to.include(normalizedExpected);
        } catch (error) {
          cy.log(`⚠️ checkNotice failed: ${error.message}`);
          cy.task('recordFailure', { 
            type: 'assertion_failure', 
            selector: fieldSelector, 
            expected: errorMsg,
            actual: $element.text(),
            error: error.message 
          });
        }
      });
  });
});

Cypress.Commands.add('pasteIntoField', (fieldSelector, value) => {
  cy.get(fieldSelector).invoke('val', value).trigger('input');
  cy.get(fieldSelector).should('have.value', value);
});

Cypress.Commands.add('checkLinkColorAfterClick', (selector, linkText) => {
  const rgbToHex = (rgb) => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb;
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  };

  cy.get(selector).contains(linkText).click();
  cy.wait(1000);
  
  cy.get(selector).contains(linkText).parent('li').should('have.class', 'current-menu-item')
    .find('.menu-link').then($link => {
      try {
        const color = $link.css('color');
        const hexColor = rgbToHex(color);
        expect(hexColor).to.equal('#54b435');
      } catch (error) {
        cy.log(`⚠️ checkLinkColorAfterClick failed: ${error.message}`);
        cy.task('recordFailure', {
          type: 'assertion_failure',
          selector: selector,
          expected: '#54b435',
          actual: rgbToHex($link.css('color')),
          error: error.message
        });
      }
    });
});

Cypress.Commands.add('selectByIndex', (selector, indexToSelect) => {
  cy.get('body').then(($body) => {
    if ($body.find(`${selector}.select2-hidden-accessible`).length > 0) {
      const containerId = selector.replace('#', '#select2-') + '-container';
      
      cy.get(containerId).click();
      
      cy.get('.select2-results__option')
        .should('be.visible')
        .eq(indexToSelect)
        .click();
        
    } else {
      cy.get(selector).should('be.visible').then(($select) => {
        const $options = $select.find('option');
        if (indexToSelect < $options.length) {
          cy.wrap($select).select($options.eq(indexToSelect).val());
        } else {
          cy.log('Index vượt quá số lượng options có sẵn');
          cy.task('recordFailure', {
            type: 'index_out_of_bounds',
            selector: selector,
            index: indexToSelect,
            available: $options.length
          });
        }
      });
    }
  });
});

Cypress.Commands.add('recordFailure', (failureData) => {
  return cy.task('recordFailure', failureData).then(() => {
    cy.log(`Failure recorded: ${failureData.type}`);
  });
});

