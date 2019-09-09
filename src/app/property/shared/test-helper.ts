import { Address } from 'src/app/core/models/address';
import { Property, PropertyType, PropertyStyle, MapCentre, Photo, PropertySummaryFigures } from './property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';

export const MockProperty = {
  propertyId: 40171,
  address: {
    flatNumber: '28',
    houseNumber: null,
    houseBuildingName: 'Mountford Mansions',
    streetName: '100 Battersea Park Road',
    addressLine2: null,
    town: 'London',
    outCode: 'SW11',
    inCode: '4LJ',
    coordinate: { latitude: 51.475558, longitude: -0.152889 }
  },
  propertyTypeId: 2,
  propertyStyleId: 8,
  regionId: 1,
  areaId: 5,
  subAreaId: 1,
  mapCenter: { latitude: 51.477357, longitude: -0.15629 },
  info: {
    propertyId: 40171,
    lettingInstructions: { active: 0, total: 2 },
    saleInstructions: { active: 0, total: 0 },
    instructions: { active: 0, total: 2 },
    lettingOffers: { active: 0, total: 0 },
    saleOffers: { active: 0, total: 0 },
    offers: { active: 0, total: 0 },
    propertyLettingNotes: 3,
    propertySaleNotes: 0,
    offerLettingNotes: 0,
    offerSaleNotes: 0,
    managementNotes: 0,
    propertyNotes: 3,
    propertyPhotos: 6
  },
  photo: null,
  lastKnownOwner: {
    companyName: null,
    contactGroupId: 121298,
    contactNames: 'Mr Jan Pastori',
    emailAddress: null,
    phoneNumber: null
  }
};

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
export const mockProperty100: Property = {
  propertyId: 1,
  address: mockAddress,
  floorOther: null,
  floorType: null,
  numberOfFloors: 2,
  propertyTypeId: PropertyType.Flat,
  propertyStyleId: PropertyStyle.Houseboat,
  regionId: 1,
  areaId: 1,
  subAreaId: 2,
  mapCentre: {} as MapCentre,
  map: {} as Photo,
  photo: {} as Photo,
  info: {} as PropertySummaryFigures,
  lastKnownOwner: {} as Signer
};
export const mockProperty200: Property = {
  propertyId: 2,
  address: mockAddress2,
  floorOther: null,
  floorType: null,
  numberOfFloors: 2,
  propertyTypeId: PropertyType.House,
  propertyStyleId: PropertyStyle.Detached,
  regionId: 1,
  areaId: 1,
  subAreaId: 2,
  mapCentre: {} as MapCentre,
  map: {} as Photo,
  photo: {} as Photo,
  info: {} as PropertySummaryFigures,
  lastKnownOwner: {} as Signer
};

export const MockProperties = [mockProperty100, mockProperty200];



