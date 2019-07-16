import { Address } from 'src/app/core/models/address';
import { Property, PropertyType, PropertyStyle } from './property';

export const mockAddress: Address = {
  addressLines: '413 test address',
  addressLine2: '413 test address',
  flatNumber: '88',
  houseBuildingName: 'Aurora Apartments',
  houseNumber: null,
  inCode: '4FW',
  latitude: null,
  longitude: null,
  outCode: 'SW18',
  streetName: '10 Buckhold Road',
  town: 'London',
  postCode: null,
  countryId: 0,
  country: null
};
export const mockAddress2: Address = {
  addressLines: 'second test address',
  addressLine2: null,
  flatNumber: null,
  houseBuildingName: null,
  houseNumber: '10',
  inCode: '4FW',
  latitude: null,
  longitude: null,
  outCode: 'SW18',
  streetName: '10 Downing street',
  town: 'London',
  postCode: null,
  countryId: 232,
  country: null
};
export const mockProperty: Property = {
  propertyId: 1,
  address: mockAddress,
  floorOther: null,
  floorType: null,
  numberOfFloors: 2,
  propertyTypeId: PropertyType.Flat,
  propertyStyleId: PropertyStyle.Houseboat
};
export const mockProperty2: Property = {
  propertyId: 2,
  address: mockAddress2,
  floorOther: null,
  floorType: null,
  numberOfFloors: 2,
  propertyTypeId: PropertyType.House,
  propertyStyleId: PropertyStyle.Detached
};
export const MockProperties = [mockProperty, mockProperty2];
