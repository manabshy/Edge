describe('Valuation register should', () => {

  beforeEach(() => {
  });

  // it('navigate to display the search filters', () => {
  //   cy.visit('/valuations-register');
  //   cy.get('h4').should('have.text', 'Valuations register')

  // });

  it('search for a valuation using the input search', () => {
    cy.visit('/valuations-register');
    cy.get('#valuationSearch').type('sw11');
    cy.get('#btnSearch').click();
  });

  it('add new property ', () => {

    // add new property from the property edit
  });
});