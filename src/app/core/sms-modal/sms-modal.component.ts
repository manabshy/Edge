import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { sample } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sms-modal',
  templateUrl: './sms-modal.component.html',
  styleUrls: ['./sms-modal.component.scss']
})
export class SmsModalComponent implements OnInit {
  @Input() salutation;
  @Input() number;
  @Input() actions;
  smsMaxLength = 700;
  smsForm: FormGroup
  subject: Subject<string>;

  get smsLength() {
    return +this.smsForm.get('text').value.length;
  }

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit() {
    this.smsForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(700)]]
    });
  }

  action(value: string) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

}
