import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { sample } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffMemberService } from '../services/staff-member.service';
import { StaffMember } from '../models/staff-member';

@Component({
  selector: 'app-sms-modal',
  templateUrl: './sms-modal.component.html',
  styleUrls: ['./sms-modal.component.scss']
})
export class SmsModalComponent implements OnInit {
  @Input() salutation;
  @Input() number;
  @Input() actions;
  header = 'From D & G';
  smsMaxLength = 700;
  smsForm: FormGroup;
  subject: Subject<string>;
  currentStaffMember: StaffMember;

  get smsLength() {
    return +this.smsForm.get('message').value.length;
  }

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);
    this.smsForm = this.fb.group({
      personId: 0,
      message: ['', [Validators.required, Validators.maxLength(700)]],
      senderName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      senderPhoneNumber: ['', Validators.required],
    });
    this.smsForm.patchValue({
      senderName: this.currentStaffMember.fullName,
      senderPhoneNumber: this.number,
    });
  }

  action(value: string) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

}
