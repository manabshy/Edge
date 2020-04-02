import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { sample, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffMemberService } from '../../core/services/staff-member.service';
import { StaffMember } from '../models/staff-member';
import { SmsInfo } from '../models/person';
import { SmsService } from '../../core/services/sms.service';
import { WedgeError, SharedService } from '../../core/services/shared.service';
import { FormErrors, ValidationMessages } from '../../core/shared/app-constants';
import { WedgeValidators } from '../wedge-validators';
import { StorageMap } from '@ngx-pwa/local-storage';

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
    private storage: StorageMap,
    private sharedService: SharedService,
    private smsService: SmsService,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() {

    this.smsForm = this.fb.group({
      personId: 0,
      header: this.header,
      message: ['', [Validators.required, Validators.maxLength(700)]],
      senderName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      senderPhoneNumber: ['', [Validators.required, WedgeValidators.phoneNumberValidator()]],
    });

    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        this.smsForm.patchValue({
          senderName: this.currentStaffMember.fullName,
          senderPhoneNumber: this.currentStaffMember.mobile,
          phoneNumber: this.number,
          personId: this.person.personId
        });
      }
    });

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
    });
    this.sharedService.scrollToFirstInvalidField();
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

  cancel() {
    this.bsModalRef.hide();
  }

}
