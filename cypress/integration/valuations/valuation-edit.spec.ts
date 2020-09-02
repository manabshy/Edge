describe('Valuation edit should', () => {

  beforeEach(() => { })

  it('navigate to the valuations register', () => {
    cy.visit('/valuations-register');
    cy.get('h4').should('have.text', 'Valuations register')
  });

  it('update the details of an existing property', () => {

  });

  it('add new property ', () => {

    // add new property from the property edit
  });
})