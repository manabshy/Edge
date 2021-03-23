describe('Leads register should', () => {
  let postCode = 'sw11 6se';
  const leadTypeId = '6'; // Vendor
  const leadType = 'Vendor';
  const dateFrom = '01/01/2020';
  const dateTo = '21/09/2020';

  beforeEach(() => {
    cy.visit('/leads-register');
  });

  // xit('search for leads using a search term and lead type', () => {
  //   cy.get('[type="search"]')
  //     .type(postCode)
  //     .should('have.value', postCode);
  //   cy.get('#leadType').select(leadTypeId);
  //   cy.wait(2000);
  //   cy.get('#search')
  //     .should('have.text', 'Search')
  //     .click();
  //   cy.get('#leadTypeValue').should('have.text', leadType); // Assertion not needed;
  // });

  // xit('filter leads by office', () => {
  //   cy.get('ng-select').then((selects) => {
  //     const select = selects[0];
  //     cy.wrap(select).click({ multiple: true })
  //       .get('ng-dropdown-panel') // get the opened drop-down panel
  //       .get('.ng-option') // Get all the options in drop-down
  //       .then((items) => {
  //         cy.wrap(items[0]).click({ multiple: false });
  //       });
  //   });
  // });

  // it('use all filters to search for leads', () => {
  //   postCode = 'sw12 8ag';
  //   cy.get('[type="search"]')
  //     .type(postCode)
  //     .should('have.value', postCode);
  //   cy.get('#leadType').select(leadTypeId);
  //   cy.wait(2000);

  //   cy.get('#dateFrom').type(dateFrom);
  //   cy.get('#dateTo').type(dateTo);

  //   cy.get('ng-select').then((selects) => {
  //     const select = selects[0];
  //     cy.wrap(select).click({ multiple: true })
  //       .get('ng-dropdown-panel') // get the opened drop-down panel
  //       .get('.ng-option') // Get all the options in drop-down
  //       .then((items) => {
  //         cy.wrap(items[0]).click({ multiple: false });
  //       });
  //   });

  //   cy.get('#search')
  //     .should('have.text', 'Search')
  //     .click();
  // });

  // it('navigate to lead details page from search results and update an existing', () => {
  //   postCode = 'sw12 8ag';
  //   const nextChaseDate = '21/01/2022';
  //   const leadNote = 'Test for lead';

  //   cy.get('[type="search"]')
  //     .type(postCode)
  //     .should('have.value', postCode);
  //   cy.get('#leadType').select(leadTypeId);
  //   cy.wait(2000);

  //   cy.get('#dateFrom').type(dateFrom);
  //   cy.get('#dateTo').type(dateTo);

  //   cy.get('ng-select').then((selects) => {
  //     const select = selects[0];
  //     cy.wrap(select).click({ multiple: true })
  //       .get('ng-dropdown-panel') // get the opened drop-down panel
  //       .get('.ng-option') // Get all the options in drop-down
  //       .then((items) => {
  //         cy.wrap(items[0]).click({ multiple: false });
  //       });
  //   });

  //   cy.get('#search')
  //     .should('have.text', 'Search')
  //     .click();

  //   cy.get('tbody').click();
  //   cy.get('#chaseDate').clear().type(nextChaseDate).click();
  //   cy.get('#note').type(leadNote);

  //   cy.get('#saveLead').click();
  // });

  // it.only('create a new valuation from lead details page', () => {
  //   postCode = 'SW15 6NZ';
  //   const reason = 'Buy a larger property';
  //   const timeFrame = 'Late summer';
  //   const generalNotes = 'Good schools and excellent transport links to central London';

  //   cy.get('[type="search"]')
  //     .type(postCode)
  //     .should('have.value', postCode);
  //   // cy.get('#leadType').select(leadTypeId);
  //   // cy.wait(2000);

  //   // cy.get('#dateFrom').type(dateFrom);
  //   // cy.get('#dateTo').type(dateTo);

  //   // cy.get('ng-select').then((selects) => {
  //   //   const select = selects[0];
  //   //   cy.wrap(select).click({ multiple: true })
  //   //     .get('ng-dropdown-panel') // get the opened drop-down panel
  //   //     .get('.ng-option') // Get all the options in drop-down
  //   //     .then((items) => {
  //   //       cy.wrap(items[8]).click({ multiple: false });
  //   //     });
  //   // });

  //   cy.get('#search')
  //     .should('have.text', 'Search')
  //     .click();

  //   cy.get('tbody').click();

  //   cy.get('[data-cy=createVal]').click();

  //   cy.get('[data-cy=reason]').type(reason);
  //   cy.get('[data-cy=timeFrame]').type(timeFrame);
  //   cy.get('[data-cy=generalNotes]').type(generalNotes);

  //   cy.get('[data-cy=valSales]').click();

  //   cy.get('[data-cy=salesValuers]').then((select) => {
  //     cy.wrap(select).click({ multiple: true })
  //       .get('ng-dropdown-panel') // get the opened drop-down panel
  //       .get('.ng-option') // Get all the options in drop-down
  //       .then((items) => { cy.wrap(items[2]).click(); });
  //   });

  //   cy.get('[data-cy=getvailability]').click();
  //   cy.get('[data-cy=searchAvailability]').click();


  //   cy.get('app-subnav').get('app-subnav-item').first().click();
  //   cy.get('[data-cy=saveVal]').click();

  //   cy.get('[data-cy=reason]').should('have.value', reason);
  //   cy.get('[data-cy=timeFrame]').should('have.value', timeFrame);
  //   cy.get('[data-cy=generalNotes]').should('have.value', generalNotes);
  // });

  /* === Test Created with Cypress Studio === */
  it.only('get my leads', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.active').click();
    cy.get('#listingType').select('1');

    cy.intercept('GET', '**/currentUser').as('register');
    cy.wait('@register').its('response.statusCode').should('eq', 200);

    // cy.intercept({
    //   url: 'http://localhost:4200/leads',
    //   query: { ownerId: '2523' },
    // }).as('register');
    // cy.wait('@register').its('response.statusCode').should('eq', 200);

    cy.get('#search').click();
    /* ==== End Cypress Studio ==== */
  });
});