// /// <reference types="Cypress" />
describe('Property center should', () => {
  beforeEach(() => {
  });

  it('show login page', () => {
    cy.visit('/login');
    cy.contains('p', ' Sign in with your work email');
  });

  it('search for properties using a search term', () => {
    cy.visit('/property-centre');
    cy.get('[type="search"]')
      .type('road')
      .should('have.value', 'road');
    cy.get('.btn-secondary')
      .should('have.text', 'Search')
      .click();
    cy.get('.list-group-item').should('be.visible');
  });

});
