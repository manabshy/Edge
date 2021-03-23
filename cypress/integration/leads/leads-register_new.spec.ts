describe('Leads Section', function () {
  beforeEach(() => {
    cy.visit('/leads-register');
    cy.intercept('GET', 'staffmembers/currentUser').as('getLeads');
    cy.wait('@getLeads', { timeout: 9 * 1000 }).its('response.statusCode').should('eq', 200);
  });

  it('Validate search on Leads register page ', function () {
    cy.url().should('include', '/leads-register');
    cy.get('#leadSearch').type('Wendy Younges');
    cy.get('#search').click();
    cy.get('tr.ng-star-inserted td:nth-of-type(2)')
      .should('contain.text', 'Wendy Younges');
  });

})
