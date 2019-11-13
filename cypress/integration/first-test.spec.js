/// <reference types="Cypress" />
describe('My first test', () => {
  beforeEach(()=>{
    cy.visit('/login')
    cy.loggedInAs('user')
  })

  it('greets with message', () => {
    cy.contains('p', ' Sign in with your work email');
  })

  it('go to property centre', () => {
    cy.visit('/property-centre')
  })

})
