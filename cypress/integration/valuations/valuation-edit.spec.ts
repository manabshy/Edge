describe('Valuation edit should', () => {

  beforeEach(() => { });

  it('update the details of an existing valuation', () => {
    const valuationId = '162269';
    const reasonText = 'Cypress testing here';

    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('#reason').clear().type(reasonText);
    cy.get('#saveVal').click();

  });

  xit('add a new valuation', () => {
    cy.visit('/valuations-register/detail/0/edit?isNewValuation=true');
    cy.get('app-property-finder').click();
  });

});
