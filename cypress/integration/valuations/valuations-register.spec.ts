describe('Valuation register should', () => {
  let postCode = 'sw11 6se';
  const dateFrom = '01/01/2020';
  const dateTo = '21/09/2020';
  const status = 'Booked' // id: 2, value: 'Booked'
  beforeEach(() => {
    cy.visit('/valuations-register');
  });

  it('search for a valuation using valution date and status', () => {
    // cy.get('#valuationSearch').type('sw11');
    // cy.get('#btnSearch').click();
    cy.get('[data-cy=dateFrom]').type(dateFrom);
    cy.get('[data-cy=valStatus]').select(status);

    cy.get('[data-cy=searchVal]').click();

    cy.get('[data-cy=valStatusLabel]').first().should('have.text', status);
  });

  xit('create new valuation ', () => {

    // add new property from the property edit
  });
});