import { Address } from 'src/app/core/models/address';

export interface Property {
  propertyType: string;
  propertyId: string;
  address: Address;
  floorOther: string;
  floorType: string;
  numberOfFloors: number;
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
