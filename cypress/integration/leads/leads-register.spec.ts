describe('Leads register should', () => {
  const newPropertyId = 0;
  beforeEach(() => {
    cy.visit('/leads-register');
  });

  it('search for leads using a search term and lead type', () => {
    const postCode = 'sw11 6se';
    const leadTypeId = '6'; // Vendor
    const leadType = 'Vendor';

    cy.get('[type="search"]')
      .type(postCode)
      .should('have.value', postCode);
      cy.get('#leadType').select(leadTypeId);
      cy.wait(2000);
    cy.get('#search')
      .should('have.text', 'Search')
      .click();
    cy.get('#leadTypeValue').should('have.text', leadType); // Assertion not needed;
  });

  xit('filter leads by type', () => {
    cy.get('[type="search"]')
      .type('king')
      .should('have.value', 'king');
    cy.get('.btn-secondary')
      .should('have.text', 'Search')
      .click();
    cy.get('.list-group-item').should('be.visible');
  });

  // it('navigate to create new property from the property center ', () => {

  //   cy.get('#addNewProperty').click();
  //   cy.visit(`/property-centre/detail/${newPropertyId}/edit?isNewProperty=true`);
  // });
})