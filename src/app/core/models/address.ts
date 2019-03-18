export interface Address {
  flatNumber: string;
  houseNumber: string;
  houseBuildingName: string;
  streetName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  town: string;
  longitude: string;
  latitude: string;
  outCode: string;
  inCode: string;
  country: string;
}
export function setPostCode(address: Address): string {
  return address.outCode + ' ' + address.inCode;
}
