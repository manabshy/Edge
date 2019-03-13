export enum Category {
  Lettings,
  LongTerm,
  ShortTerm,
  Sales
}

export enum LetTerm {
  Short,
  Long
}

export enum StatusType {
  Valuations,
  Instructions,
  Viewings,
  Offers
}

export enum PropertySaleType {
  Sales,
  Lettings,
  All,
  None
}

export enum Managed {
  Yes,
  No,
  Either
}

export interface Property {
  propertyType: string;
  propertyId: string;
  address: Address;
  floorOther: string;
  floorType: string;
  numberOfFloors: number;
}

export interface Address {
  flatNumber: string;
  houseNumber: string;
  houseBuildingName: string;
  streetName: string;
  addressLine2: string;
  town: string;
  longitude: string;
  latitude: string;
  outCode: string;
  inCode: string;
}
