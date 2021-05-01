describe('Valuation edit should', () => {
  let valuationId = '162278'; // 162282
  const saleValue = 500000;
  const shortLetWeeklyRent = 1000;
  const longLetWeeklyRent = 900;
  const monthlyRent = 5300;

  beforeEach(() => { });

  xit('update the details of an existing valuation', () => {
    valuationId = '162269';
    const reasonText = 'Cypress testing here';

    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('#reason').clear().type(reasonText);
    cy.get('#saveVal').click();

  });

  xit('value a booked valuation', () => {
    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('[data-cy=valuationValues]').then(() => {
      cy.get('[data-cy=sellValue]').clear().type(saleValue.toString());
      cy.get('[data-cy=shortLetValue]').clear().type(shortLetWeeklyRent.toString());
      cy.get('[data-cy=longLetValue]').clear().type(longLetWeeklyRent.toString());

      cy.get('#saveVal').click();
      cy.get('[data-cy=sellValue]').should('have.value', saleValue.toString());
    });
  });

  xit('instruct a lettings valuation', () => {
    valuationId = '162276'; // 162282
    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('[data-cy=startInstruction]').click();
    cy.get('[data-cy=instructLet]').check({ force: true });
    cy.get('[data-cy=soleAgencyLettings]').check({ force: true });
    cy.get('[data-cy=saveInstruction]').click();

    cy.get('[data-cy=instructions]').then((ele) => {
      console.log({ ele });
    });
  });

  xit('instruct a sales valuation', () => {
    valuationId = '161256'; // 162282
    cy.visit(`/valuations-register/detail/${valuationId}/edit`);
    cy.get('[data-cy=startInstruction]').click();
    cy.get('[data-cy=instructSale]').check({ force: true });
    cy.get('[data-cy=soleAgencySales]').check({ force: true });
    cy.get('[data-cy=saveInstruction]').click();


    cy.get('[data-cy=instructions]').then((ele) => {
      console.log({ ele });

    });
  });
});
