import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumber, PhoneNumberFormat } from 'google-libphonenumber';
import { SharedService } from '../services/shared.service';

export class WedgeValidators {
  // static sharedService: SharedService;
  /**
   * Validator that requires controls to have a value greater than a number.
   */
   constructor(private sharedService: SharedService){}
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
        return {'min': min, 'actual': control.value};
      }
      const value = parseFloat(control.value);
      return !isNaN(value) && value < min ? {'min': min, 'actual': control.value} : null;
    };
  }

  /**
   * Validator that requires controls to have a value less than a number.
   */
  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
        return {'max': max, 'actual': control.value};
      }
      const value = parseFloat(control.value);
      return !isNaN(value) && value > max ? {'max': max, 'actual': control.value} : null;
    };
  }

  /**
   * Validator for phone from people based on a regexp
   *
   * @returns {ValidatorFn}
   */
  static peoplePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value !== null && control.value.length > 0 && !/^\+?[ \d]+$/g.test(control.value)) ? {
        'RegExp': '/^\\+?[ \\d]+$/g',
        'actualValue': control.value
      } : null;
    }
  }

  static phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let validNumber = false;
      const regionCode = 'GB';
      // let regionCode = this.sharedService.getRegionCode(control.value);
      const phoneNumberUtil = PhoneNumberUtil.getInstance();
      try {
        const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
          control.value, regionCode
        );
        validNumber = phoneNumberUtil.isValidNumber(phoneNumber);
      } catch (e) { }

      return validNumber ? null : { 'invalidPhoneNumber': { value: control.value } };
    }
  }
  /**
   * Validator for valuations - requiring EITHER a letting value OR sales value
   */
  static valuationPrice(group: FormGroup): ValidationErrors | null {
    const shortLetVal = group.get('shortLetValue').value;
    const longLetVal = group.get('longLetValue').value;
    const saleVal = group.get('saleValue').value;

    // no values have been set
    if (isEmptyInputValue(shortLetVal) &&
        isEmptyInputValue(longLetVal) &&
        isEmptyInputValue(saleVal)) {
      return { 'empty': true };
    }

    return null;
  }

}

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}
