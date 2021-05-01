describe('Property center should', () => {
  const newPropertyId = 0;
  beforeEach(() => {
    cy.visit('/property-centre');
  });

  // it('show login page', () => {
  //   cy.visit('/login');
  //   cy.contains('p', ' Sign in with your work email');
  // });

  it('search for properties using a search term', () => {
    cy.get('[type="search"]')
      .type('king')
      .should('have.value', 'king');
    cy.get('.btn-secondary')
      .should('have.text', 'Search')
      .click();
    cy.get('.list-group-item').should('be.visible');
  });

  it('navigate to create new property from the property center ', () => {

    cy.get('#addNewProperty').click();
    cy.visit(`/property-centre/detail/${newPropertyId}/edit?isNewProperty=true`);
  });

  it('add new property ', () => {
    const propertyType = '1'; // House
    const propertyStyle = '1'; // Semi-Detached
    const addressLine2 = 'Test address line 4';
    const area = '7'; // Battersea
    const subArea = '2'; // Other areas(Battersea)
    const postCode = 'sw11 1af';

    // TODO: Add test for potential duplicates and properties without lat and lon

    cy.get('#addNewProperty').click();
    cy.visit(`/property-centre/detail/${newPropertyId}/edit?isNewProperty=true`);
    cy.get('#fullAddress').type(postCode);
    cy.get('#searchAddress').click();
    cy.get('app-subnav-item').click({ multiple: true });
    cy.wait(1000);
    cy.get('app-subnav').get('app-subnav-item').click({ multiple: true, force: true });
    cy.wait(1000);
    // cy.get('.off-canvas') .invoke('attr', 'style', 'display: block')
    // .should('have.attr', 'style', 'display: block');
    // cy.get('#flatNumber').type('300');
    // cy.get('#office').click({multiple:true}).type('2')
    // cy.get('#houseNumber').type('300');
    cy.get('#addressLine2').type(addressLine2);
    cy.get('#propertyTypeId').select(propertyType)
      .get('#propertyStyleId').select(propertyStyle);
    cy.get('#area').select(area)
      .get('#subArea').select(subArea);
    cy.get('#saveProperty').click();
    cy.get('#confirm').click();

  });

});
