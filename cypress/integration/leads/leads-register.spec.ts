describe('Leads register should', () => {
  const postCode = 'sw11 6se';
  const leadTypeId = '6'; // Vendor
  const leadType = 'Vendor';

  beforeEach(() => {
    cy.visit('/leads-register');
  });

  xit('search for leads using a search term and lead type', () => {


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

  it('filter leads by office', () => {
    // cy.get('[type="search"]')
    //   .type('king')
    //   .should('have.value', 'king');
    cy.get('ng-select').then((selects) => {
      const select = selects[0];
      cy.wrap(select).click({ multiple: true })
        .get('ng-dropdown-panel') // get the opened drop-down panel
        .get('.ng-option') // Get all the options in drop-down
        .then((items) => {
          cy.wrap(items[0]).click({ multiple: false });
        });
    });
  });

  // it('navigate to create new property from the property center ', () => {

  //   cy.get('#addNewProperty').click();
  //   cy.visit(`/property-centre/detail/${newPropertyId}/edit?isNewProperty=true`);
  // });
})