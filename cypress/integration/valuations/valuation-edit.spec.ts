describe('Valuation edit should', () => {

  beforeEach(() => { });

  it('update the details of an existing valuation', () => {
    cy.visit('/valuations-register/detail/162269/edit');
    cy.get('#reason').clear().type('Cypress testing here');
    cy.get('#saveVal').click();
  });

  xit('add a new valuation', () => {
    cy.visit('/valuations-register/detail/0/edit?isNewValuation=true');
    cy.get('app-property-finder').click();
  });

});
