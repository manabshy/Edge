import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { sample, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffMemberService } from '../services/staff-member.service';
import { StaffMember } from '../../shared/models/staff-member';
import { SmsInfo } from '../../shared/models/person';
import { SmsService } from '../services/sms.service';
import { WedgeError, SharedService } from '../services/shared.service';
import { FormErrors, ValidationMessages } from '../shared/app-constants';
import { WedgeValidators } from '../../shared/wedge-validators';

@Component({
  selector: 'app-sms-modal',
  templateUrl: './sms-modal.component.html',
  styleUrls: ['./sms-modal.component.scss']
})
export class SmsModalComponent implements OnInit {
  @Input() salutation;
  @Input() number;
  @Input() person;
  @Input() actions;
  header = 'From D & G';
  smsMaxLength = 700;
  smsForm: FormGroup;
  subject: Subject<string>;
  sms: SmsInfo;
  currentStaffMember: StaffMember;
  errorMessage: WedgeError;
  isSubmitting: boolean;
  formErrors = FormErrors;
  validationMessages = ValidationMessages;

  get smsLength() {
    return +this.smsForm.get('message').value.length;
  }

  constructor(public bsModalRef: BsModalRef,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private sharedService: SharedService,
              private smsService: SmsService,
              private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);
    this.smsForm = this.fb.group({
      personId: 0,
      header: [''],
      message: ['', [Validators.required, Validators.maxLength(700)]],
      senderName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      senderPhoneNumber: ['', [Validators.required, WedgeValidators.phoneNumberValidator()]],
    });
    this.smsForm.patchValue({
      senderName: this.currentStaffMember.fullName,
      senderPhoneNumber: this.currentStaffMember.mobile,
      phoneNumber: this.number,
      header: this.header,
      personId: this.person.personId
    });
    // this.smsForm.get('personId').disable();
    // this.smsForm.get('phoneNumber').disable();
    // this.smsForm.get('header').disable();
    //this.logValidationErrorsSimple(this.smsForm, false);
    // this.smsForm.valueChanges.pipe(debounceTime(1000)).subscribe(data => {
    //   this.logValidationErrorsSimple(this.smsForm, false);
    //   this.smsForm.get('personId').enable();
    //   this.smsForm.get('phoneNumber').enable();
    //   this.smsForm.get('header').enable();
    // });
  }

  logValidationErrorsSimple(group: FormGroup = this.smsForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        this.formErrors[key] = '';
      }
      if (control && !control.valid && !control.disabled && (fakeTouched || control.dirty)) {
        this.formErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            console.log(errorKey, messages[errorKey]);
            this.formErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      // if (control instanceof FormGroup) {
      //   this.logValidationErrorsSimple(control, fakeTouched);
      // }
    });
    this.sharedService.scrollToFirstInvalidField();
  }

  cancel() {
    this.bsModalRef.hide();
  }

  sendSMS() {
    this.errorMessage = null;
    this.logValidationErrorsSimple(this.smsForm, true);
    if (this.smsForm.valid) {
      if (this.smsForm.dirty) {
        const sms = { ...this.sms, ...this.smsForm.value };
        this.smsService.sendSMS(sms).subscribe(status =>
          this.onSaveComplete(status),
          (error: WedgeError) => {
            this.errorMessage = error;
            this.sharedService.showError(this.errorMessage);
            this.isSubmitting = false;
          });
      } else {
        this.onSaveComplete(false);
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
      this.isSubmitting = false;
      console.log(this.errorMessage.displayMessage);
    }
  }
  onSaveComplete(status: any): void {
    if (status) {
      this.bsModalRef.hide();
      this.toastr.success('SMS successfully sent');
    }
  }
  // action(value: string) {
  //   if(value) {
  //     this.sendSMS();
  //   }
  //   console.log('display message',this.errorMessage.displayMessage);
  //   this.bsModalRef.hide();
  //   this.subject.next(value);
  //   this.subject.complete();
  // }

}
