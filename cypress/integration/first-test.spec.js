describe('My first test', () => {

  it('should visit login page', () => {
    cy.visit('/property-centre')

    cy.get('button').click();
  })

})
