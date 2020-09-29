describe('Valuation register should', () => {
  let postCode = 'sw11 6se';
  const dateFrom = '01/01/2020';
  const dateTo = '21/09/2020';
  const status = 'Booked' // id: 2, value: 'Booked'
  const reason = 'A good reason for e2e testing';
  const timeFrame = 'Late summer';
  const generalNotes = 'Notes for end to end testing';

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

  it.only('create new valuation ', () => {

    cy.get('[data-cy=newVal]').click();
    cy.get('[data-cy=addProperty]').click();
    cy.get('[data-cy=propSearchTerm]').type('road');

    cy.get('[data-cy=searchProperty]').click();
    cy.get('app-subnav').get('app-subnav-item').last().click();

    cy.get('[data-cy=reason]').type(reason);
    cy.get('[data-cy=timeFrame]').type(timeFrame);
    cy.get('[data-cy=generalNotes]').type(generalNotes);

    cy.get('[data-cy=valSales]').click();

    cy.get('[data-cy=salesValuers]').then((select) => {
      cy.wrap(select).click({ multiple: true })
        .get('ng-dropdown-panel') // get the opened drop-down panel
        .get('.ng-option') // Get all the options in drop-down
        .then((items) => { cy.wrap(items[2]).click(); });
    });
    // cy.get('[data-cy=leaseLength]').clear().type('100');

    cy.get('[data-cy=getvailability]').click();
    cy.get('[data-cy=searchAvailability]').click();


    cy.get('app-subnav').get('app-subnav-item').first().click();
    cy.get('[data-cy=saveVal]').click();

    cy.get('[data-cy=reason]').should('have.value', reason);
    cy.get('[data-cy=timeFrame]').should('have.value', timeFrame);
    cy.get('[data-cy=generalNotes]').should('have.value', generalNotes);

    // add new property from the property edit
  });
});