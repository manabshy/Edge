describe('Contactgroups details should', () => {
  let personId = '81422';
  const leadTypeId = '6'; // Vendor
  const leadType = 'Vendor';

  beforeEach(() => {
    cy.visit(`/contact-centre/detail/${personId}?showNotes=true`);
  });

  it('create a new lead', () => {
    const nextChaseDate = '21/01/2022';
    const leadNote = 'Create new lead from contact groups details in end to end testing';

    cy.get('[data-cy=createLead]').click();

    cy.get('#leadType').select(leadTypeId);
    cy.get('#chaseDate').clear().type(nextChaseDate).click();
    cy.get('#note').type(leadNote);

    cy.get('[data-cy=saveLead]').click();
    cy.get('#chaseDate').should('have.value', nextChaseDate);
  });

});