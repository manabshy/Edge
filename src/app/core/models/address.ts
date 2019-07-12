import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { InfoDetail } from '../services/shared.service';

export interface Address {
  flatNumber: string;
  houseNumber: string;
  houseBuildingName: string;
  streetName: string;
  addressLines: string;
  addressLine2: string;
  town: string;
  longitude: string;
  latitude: string;
  outCode: string;
  inCode: string;
  postCode: string;
  countryId: number;
  country: string;
}

export function setPostCode(address: Address): string {
  return address.outCode + ' ' + address.inCode;
}

export function setFormattedAddress(address: Address): string {
  let fullAddress = '';
  if (!!address.flatNumber) {
    if (address.flatNumber.indexOf('Flat') === -1) {
      fullAddress += fullAddress += 'Flat ' + address.flatNumber + ', ';
    } else {
      fullAddress += address.flatNumber + ', ';
    }
  }

  if (!!address.houseBuildingName) {
    fullAddress += address.houseBuildingName + ', ';
  }

  if (!!(address.houseNumber && address.streetName)) {
    fullAddress += `${address.houseNumber} ${address.streetName}, `;
  } else if (address.streetName) {
    fullAddress += `${address.streetName}, `;
  }

  if (!!address.town) {
    fullAddress += address.town + ', ';
  }

  if (address.outCode && address.inCode) {
    fullAddress += address.outCode + ' ' + address.inCode;
  }

  fullAddress = fullAddress.replace(/,\s*$/, '');
  return fullAddress;
}

export function newPropertyAddress2(data?: Address) {
  const formGroup = new FormGroup({
    flatNumber: new FormControl('', [Validators.maxLength(50)]),
    houseNumber: new FormControl('', [Validators.maxLength(50)]),
    houseBuildingName: new FormControl('', [Validators.maxLength(50)]),
    streetName: new FormControl('', [Validators.maxLength(50)]),
    addressLine2: new FormControl('', [Validators.maxLength(50)]),
    town: new FormControl('', [Validators.maxLength(50)]),
    longitude: new FormControl(''),
    latitude: new FormControl(''),
    outCode: new FormControl('', [Validators.maxLength(4)]),
    inCode: new FormControl('', [Validators.maxLength(3)])
  });
  return formGroup;
}

export function newPropertyAddress(data?: Address) {
  const formBuilder = new FormBuilder();
  const addressGroup = formBuilder.group({
    flatNumber: ['', [Validators.maxLength(50)]],
    houseNumber: ['', [Validators.maxLength(50)]],
    houseBuildingName: ['', [Validators.maxLength(50)]],
    streetName: ['', [Validators.maxLength(50)]],
    addressLine2: ['', [Validators.maxLength(50)]],
    town: ['', [Validators.maxLength(50)]],
    longitude: [''],
    latitude: [''],
    outCode: ['', [Validators.maxLength(4)]],
    inCode: ['', [Validators.maxLength(3)]]
  });
  return addressGroup;
}
