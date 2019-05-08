import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/address';

@Pipe({
  name: 'formatAddress'
})
export class FormatAddressPipe implements PipeTransform {

  transform(address: Address): string {
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

  if (!!(address.address1 && address.address2)) {
    fullAddress += `${address.address1}, ${address.address2}, `;
  } else if (address.address1) {
    fullAddress += `${address.address1}, `;
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

}
