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
