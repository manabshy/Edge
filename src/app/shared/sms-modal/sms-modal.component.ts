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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValidationService } from 'src/app/core/services/validation.service';

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
  header = 'From Douglas&Gordon';
  smsMaxLength = 700;
  smsForm: FormGroup;
  subject: Subject<string>;
  sms: SmsInfo;
  currentStaffMember: StaffMember;
  errorMessage: WedgeError;
  isSubmitting: boolean;
  formErrors = FormErrors;
  validationMessages = ValidationMessages;
  data: any;

  get smsLength() {
    return +this.smsForm.get('message').value.length;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: StorageMap,
    private sharedService: SharedService,
    private smsService: SmsService,
    public config: DynamicDialogConfig, public ref: DynamicDialogRef, private validationService: ValidationService,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.data = this.config?.data;
    console.log(this.config.data, 'sms config here');

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
          phoneNumber: this.data?.number,
          personId: this.data?.person?.personId
        });
      }
    });

  }

  logValidationErrorsSimple(group: FormGroup = this.smsForm, fakeTouched: boolean, scrollToError = false) {
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
    if (scrollToError) {
      this.sharedService.scrollToFirstInvalidField();
    }
  }

  sendSMS() {
    this.validationService.logValidationErrors(this.smsForm, true, true);
    if (this.smsForm.invalid) { return; }
    if (this.smsForm.dirty) {
      const sms = { ...this.sms, ...this.smsForm.value };
      this.smsService.sendSMS(this.smsForm?.value).subscribe(status =>
        this.onSaveComplete(status),
        () => {
          this.isSubmitting = false;
        });
    } else {
      this.onSaveComplete(false);
    }
  }

  onSaveComplete(status: any): void {
    if (status) {
      this.toastr.success('SMS successfully sent');
      this.ref.close();
    }
  }

  cancel() {
    this.ref.close();
  }

}
