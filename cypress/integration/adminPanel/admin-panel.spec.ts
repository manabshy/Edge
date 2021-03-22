describe('Admin panel should', () => {
  beforeEach(() => {
    cy.visit('/admin-panel');

    // cy.intercept('GET', '**/board').as('board');
    // cy.wait('@board');

  });

  it('display points for selected user for a given month', () => {
    cy.intercept('GET', '**/board').as('board');
    cy.wait('@board').its('response.statusCode').should('eq', 200);
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#month').select('2021/02/01');
    /* ==== End Cypress Studio ==== */
  });

  /* === Test Created with Cypress Studio === */
  it('add an adjustment for selected user', () => {
    cy.intercept('GET', '**/board').as('board');
    cy.wait('@board').its('response.statusCode').should('eq', 200);
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.row > .flexRight > .btn').click();
    cy.get('#reason').type('Test adjustment');
    cy.get('#points').type('20');
    cy.get('.btn--positive').click();
    /* ==== End Cypress Studio ==== */
  });
});
