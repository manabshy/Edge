import { Address } from 'src/app/core/models/address';

export interface Property {
  propertyId: number;
  propertyTypeId: PropertyType;
  propertyStyleId: PropertyStyle;
  address: Address;
  floorOther: string;
  floorType: string;
  numberOfFloors: number;
  regionId: number;
  areaId: number;
  subAreaId: number;
}
export interface PropertyData {
 result: Property;
}
export interface PropertyAutoComplete {
  propertyId: number;
  propertyAddress: string;
}
export interface PropertyAutoCompleteData {
 result: PropertyAutoComplete[];
}

export interface MinBedroom {
  id: number;
  name: string;
}

export const MinBedrooms = <MinBedroom[]> [
  // {id: 0, name: 'Any'},
  {id: 1, name: '1'},
  {id: 2, name: '2'},
  {id: 3, name: '3'},
  {id: 4, name: '4'},
  {id: 5, name: '5'},
  {id: 6, name: '6+'}
];
export enum PropertyType {
  House = 1,
  Flat = 2
}
export enum PropertyStyle {
  SemiDetached = 1,
  Detached = 2,
  Terraced = 3,
  EndOfTerrace = 4,
  Mews = 6,
  Mansion = 5,
  PurposeBuilt = 7,
  Conversion = 8,
  PeriodPurposeBuilt = 9,
  Houseboat = 12,
  Garage = 10,
  Land = 13,
  ParkingSpace = 11,
}
export const PropertyTypes = new Map([
  [PropertyType.Flat, 'Flat'],
  [PropertyType.House, 'House']
]);

export const PropertyStyles = new Map([
  [PropertyStyle.SemiDetached, 'Semi-Detached'],
  [PropertyStyle.Detached, 'Detached'],
  [PropertyStyle.Terraced, 'Terraced'],
  [PropertyStyle.EndOfTerrace, 'End Of Terrace'],
  [PropertyStyle.Mews, 'Mews'],
  [PropertyStyle.Mansion, 'Mansion'],
  [PropertyStyle.PurposeBuilt, 'Purpose Built'],
  [PropertyStyle.Conversion, 'Conversion'],
  [PropertyStyle.Houseboat, 'Houseboat'],
  [PropertyStyle.Garage, 'Garage'],
  [PropertyStyle.Land, 'Land'],
  [PropertyStyle.ParkingSpace, 'Parking Space'],
]);
