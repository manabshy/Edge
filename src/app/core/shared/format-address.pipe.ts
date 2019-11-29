import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../../shared/models/address';

@Pipe({
  name: 'formatAddress'
})
export class FormatAddressPipe implements PipeTransform {

  transform(address: Address): string {
    let fullAddress = '';
    if(!address){
      return;
    }
  if (!!address.flatNumber) {
    if (address.flatNumber.indexOf('Flat') === -1) {
      fullAddress += fullAddress += 'Flat ' + address.flatNumber + ', \n';
    } else {
      fullAddress += address.flatNumber + ', \n';
    }
  }

  if (!!address.houseBuildingName) {
    fullAddress += address.houseBuildingName + ', \n';
  }

  if (!!address.addressLines) {
    fullAddress += `${address.addressLines} `;
  }

  if (!!(address.houseNumber && address.streetName)) {
    fullAddress += `${address.houseNumber} ${address.streetName}, \n`;
  } else if (address.streetName) {
    fullAddress += `${address.streetName}, \n`;
  }

  if (!!address.town) {
    fullAddress += address.town + ', \n';
  }

  if (!!address.postCode) {
    fullAddress += address.postCode;
  } else if (address.outCode && address.inCode) {
      fullAddress += address.outCode + ' ' + address.inCode;
    }

  fullAddress = fullAddress.replace(/,\s*$/, '');
  return fullAddress;
  }

}
