describe('Leads register should', () => {
  let postCode = 'sw11 6se';
  const leadTypeId = '6'; // Vendor
  const leadType = 'Vendor';
  const dateFrom = '01/01/2020';
  const dateTo = '21/09/2020';

  beforeEach(() => {
    cy.visit('/leads-register');
  });

  it('search for leads using a search term and lead type', () => {
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

  it('use all filters to search for leads', () => {
    postCode = 'sw12 8ag';
    cy.get('[type="search"]')
      .type(postCode)
      .should('have.value', postCode);
    cy.get('#leadType').select(leadTypeId);
    cy.wait(2000);

    cy.get('#dateFrom').type(dateFrom);
    cy.get('#dateTo').type(dateTo);

    cy.get('ng-select').then((selects) => {
      const select = selects[0];
      cy.wrap(select).click({ multiple: true })
        .get('ng-dropdown-panel') // get the opened drop-down panel
        .get('.ng-option') // Get all the options in drop-down
        .then((items) => {
          cy.wrap(items[0]).click({ multiple: false });
        });
    });

    cy.get('#search')
      .should('have.text', 'Search')
      .click();
  });

  it('navigate to lead details page from search results and update an existing', () => {
    postCode = 'sw12 8ag';
    const nextChaseDate = '21/01/2022';
    const leadNote = 'Test for lead';

    cy.get('[type="search"]')
      .type(postCode)
      .should('have.value', postCode);
    cy.get('#leadType').select(leadTypeId);
    cy.wait(2000);

    cy.get('#dateFrom').type(dateFrom);
    cy.get('#dateTo').type(dateTo);

    cy.get('ng-select').then((selects) => {
      const select = selects[0];
      cy.wrap(select).click({ multiple: true })
        .get('ng-dropdown-panel') // get the opened drop-down panel
        .get('.ng-option') // Get all the options in drop-down
        .then((items) => {
          cy.wrap(items[0]).click({ multiple: false });
        });
    });

    cy.get('#search')
      .should('have.text', 'Search')
      .click();

    cy.get('tbody').click();
    cy.get('#chaseDate').clear().type(nextChaseDate).click();
    cy.get('#note').type(leadNote);

    cy.get('#saveLead').click();
  });

});