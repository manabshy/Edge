import { Address } from 'src/app/core/models/address';

export interface Property {
  propertyType: string;
  propertyId: string;
  address: Address;
  floorOther: string;
  floorType: string;
  numberOfFloors: number;
}

