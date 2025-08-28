class MenuNavPage {
  getMenuHeaderSelector() {
    return '#ast-hf-menu-1 .menu-link';
  }

  verifyHome() {
    cy.get(this.getMenuHeaderSelector()).should('be.visible');
    cy.checkLinkColorAfterClick(this.getMenuHeaderSelector(), 'Trang chủ');
    cy.url().should('eq', Cypress.config('baseUrl') + '');
  }

  verifyShop() {
    cy.get(this.getMenuHeaderSelector()).should('be.visible');
    cy.checkLinkColorAfterClick(this.getMenuHeaderSelector(), 'Cửa hàng');
    cy.url().should('include', '/shop');
  }

  verifyPlantCare() {
    cy.get(this.getMenuHeaderSelector()).should('be.visible');
    cy.checkLinkColorAfterClick(this.getMenuHeaderSelector(), 'Chăm sóc cây');
    cy.url().should('include', '/plant-care-blog');
  }

  verifyContact() {
    cy.get(this.getMenuHeaderSelector()).should('be.visible');
    cy.checkLinkColorAfterClick(this.getMenuHeaderSelector(), 'Về chúng tôi');
    cy.url().should('include', '/introduce');
  }
}

export default MenuNavPage;