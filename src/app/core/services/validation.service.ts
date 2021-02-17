import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationMessages, FormErrors } from '../shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  logValidationErrors(group: FormGroup, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        console.log('control', key, 'errors ', control.errors);
        FormErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
    if (scrollToError) {
      this.scrollToFirstInvalidField();
    }
  }


  // Check if needed - Possibly useless
  scrollToFirstInvalidField() {
    const invalidFields = document.getElementsByClassName('invalid');
    if (invalidFields.length) {
      setTimeout(() => {
        if (invalidFields[0]) {
          invalidFields[0].scrollIntoView({ block: 'center' });
        }
      });
    }
  }

}
