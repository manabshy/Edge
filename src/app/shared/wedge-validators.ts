import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'
import { PhoneNumberUtil, PhoneNumber, PhoneNumberFormat } from 'google-libphonenumber'
import { SharedService } from '../core/services/shared.service'
import { TelephoneTypeId } from './models/person'

export class WedgeValidators {
  // static sharedService: SharedService;
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  constructor(private sharedService: SharedService) {}
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
        return { min: min, actual: control.value }
      }
      const value = parseFloat(control.value)
      return !isNaN(value) && value < min ? { min: min, actual: control.value } : null
    }
  }

  /**
   * Validator that requires controls to have a value less than a number.
   */
  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
        return { max: max, actual: control.value }
      }
      const value = parseFloat(control.value)
      return !isNaN(value) && value > max ? { max: max, actual: control.value } : null
    }
  }

  /**
   * Validator for phone from people based on a regexp
   *
   * @returns {ValidatorFn}
   */
  static peoplePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== null && control.value.length > 0 && !/^\+?[ \d]+$/g.test(control.value)
        ? {
            RegExp: '/^\\+?[ \\d]+$/g',
            actualValue: control.value
          }
        : null
    }
  }

  static phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let validNumber = false
      const errors = { invalidPhoneNumber: { value: control.value } }
      const regionCode = 'GB'
      const isNumber = /^([+]?[0-9 ]*)$/.test(control.value)
      // let regionCode = this.sharedService.getRegionCode(control.value);
      if (control.value === '' || control.value === null) {
        return null
      }

      if (isNumber) {
        const phoneNumberUtil = PhoneNumberUtil.getInstance()
        try {
          const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(control.value, regionCode)
          validNumber = phoneNumberUtil.isValidNumber(phoneNumber)
          if (!validNumber) {
            if (!isInternationalNumber(control.value)) {
              errors['international'] = true
            }
          }
        } catch (e) {}
      }

      return validNumber ? null : errors
    }
  }
  // static phoneTypeValidator(number: string): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     let validNumber = false;
  //     let validUKMobileNumber = false;
  //     const formattedNumber = number.replace(' ', '');
  //     validUKMobileNumber = (formattedNumber.startsWith('07') || formattedNumber.startsWith('00') || formattedNumber.startsWith('+')) &&
  //       !formattedNumber.startsWith('070') && !formattedNumber.startsWith('076');
  //      validNumber = validUKMobileNumber && control.value == TelephoneTypeId.Mobile;

  //     return validNumber ? null : { 'invalidMobileType': { value: control.value } };
  //   };
  // }

  static phoneTypeValidator(_this): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const phoneNumber = control.get('number')
      const typeId = control.get('typeId')

      if (phoneNumber && typeId) {
        const number = phoneNumber.value
        const type = typeId.value

        if (number) {
          switch (+type) {
            case TelephoneTypeId.Fax:
              if (_this.sharedService.isUKMobile(number)) {
                return { mismatch: true }
              } else {
                return null
              }
            case TelephoneTypeId.Mobile:
              if (_this.sharedService.isUKMobile(number)) {
                return null
              } else {
                return { mismatch: true }
              }
            default:
              return null
          }
        }
      }
      return null
    }
  }

  static emailPhoneValidator(emailPhoneRequired): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const email = control.get('emailAddresses').value[0].email
      const phone = control.get('phoneNumbers').value[0].number
      if (emailPhoneRequired) {
        if (!!!email && !!!phone) {
          return { emailOrPhone: true }
        }
      }
      return null
    }
  }

  static warningStatusValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const id = control.get('warningStatusId').value
      const comment = control.get('warningStatusComment').value

      if (+id === 100 && !!!comment) {
        return { warningStatusRequired: true }
      }
      return null
    }
  }

  static titleValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const id = control.get('titleId').value
      const comment = control.get('titleOther').value

      if (+id === 100 && !!!comment) {
        return { titleOther: true }
      }
      return null
    }
  }

  static nextChaseDateValidator(): ValidatorFn {
    const currentFullDate = new Date()

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control !== null) {
        const controlFullDate = new Date(control.value)
        const controlDate = new Date(
          controlFullDate.getFullYear(),
          controlFullDate.getMonth(),
          controlFullDate.getDate()
        )
        const currentDate = new Date(
          currentFullDate.getFullYear(),
          currentFullDate.getMonth(),
          currentFullDate.getDate()
        )

        // (!control.value || isPast(control.value) || isToday(control.value)
        if (controlDate < currentDate) {
          return { nextChaseDatePassed: true }
        }
      }
      return null
    }
  }

  static diaryEventEndDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control !== null) {
        const fullEndDate = new Date(control.get('endDateTime').value)
        const fullStartDate = new Date(control.get('startDateTime').value)

        const endDate = new Date(fullEndDate.getFullYear(), fullEndDate.getMonth(), fullEndDate.getDate())
        const startDate = new Date(fullStartDate.getFullYear(), fullStartDate.getMonth(), fullStartDate.getDate())

        if (endDate < startDate) {
          return { endDateIsBeforeStartDate: true }
        }
      }
      return null
    }
  }

  static originTypeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control != null) {
        const originType = control.get('originType').value
        if (+originType === 0) {
          return { originTypeIsEmpty: true }
        }
        return null
      }
    }
  }

  static originIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control != null) {
        const originId = control.get('originId').value
        if (+originId === 0) {
          return { originIdIsEmpty: true }
        }
        return null
      }
    }
  }

  /**
   * Validator for valuations - requiring EITHER a letting value OR sales value
   */
  static valuationPrice(group: FormGroup): ValidationErrors | null {
    const shortLetVal = group.get('shortLetValue').value
    const longLetVal = group.get('longLetValue').value
    const saleVal = group.get('saleValue').value

    // no values have been set
    if (isEmptyInputValue(shortLetVal) && isEmptyInputValue(longLetVal) && isEmptyInputValue(saleVal)) {
      return { empty: true }
    }

    return null
  }

  static noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = ((control && control.value && control.value.toString()) || '').trim().length === 0
    const isValid = !isWhitespace
    return isValid ? null : { whitespace: true }
  }

  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true }
    }
    return null
  }
}

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0
}

function isInternationalNumber(number: string) {
  const formattedNumber = number.replace(' ', '').replace('+44', '')
  return formattedNumber.startsWith('00') || formattedNumber.startsWith('+')
}
