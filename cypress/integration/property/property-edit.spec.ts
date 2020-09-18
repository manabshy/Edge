describe('Property edit should', () => {
  const propertyId = '35846';
  const propertyType = '1';
  const propertyStyle = '1';

  it('update the details of an existing property', () => {
    cy.visit(`/property-centre/detail/${propertyId}/edit`);
    cy.get('#propertyTypeId').select(propertyType)
      .get('#propertyStyleId').select(propertyStyle);
    cy.get('#saveProperty').click();

  });

 
})