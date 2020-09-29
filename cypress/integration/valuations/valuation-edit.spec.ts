describe('Valuation edit should', () => {
  let valuationId = '162278'; // 162282
  const saleValue = 500000;
  const shortLetWeeklyRent = 1000;
  const longLetWeeklyRent = 900;
  const monthlyRent = 5300;

  beforeEach(() => { });

  it('update the details of an existing valuation', () => {
    valuationId = '162269';
    const reasonText = 'Cypress testing here';

    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('#reason').clear().type(reasonText);
    cy.get('#saveVal').click();

  });

  it('value a booked valuation', () => {
    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('[data-cy=valuationValues]').then(() => {
      cy.get('[data-cy=sellValue]').clear().type(saleValue.toString());
      cy.get('[data-cy=shortLetValue]').clear().type(shortLetWeeklyRent.toString());
      cy.get('[data-cy=longLetValue]').clear().type(longLetWeeklyRent.toString());

      cy.get('#saveVal').click();
      cy.get('[data-cy=sellValue]').should('have.value', saleValue.toString());
    });
  });

  it.only('instruct a valuation', () => {
    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('[data-cy=valuationValues]').then(() => {
      cy.get('[data-cy=sellValue]').clear().type(saleValue.toString());
      cy.get('[data-cy=shortLetValue]').clear().type(shortLetWeeklyRent.toString());
      cy.get('[data-cy=longLetValue]').clear().type(longLetWeeklyRent.toString());

      cy.get('#saveVal').click();
      cy.get('[data-cy=sellValue]').should('have.value', saleValue.toString());
    });
  });
});
