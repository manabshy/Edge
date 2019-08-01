import { Component, OnInit, Input, Renderer2 } from '@angular/core';
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
  smsForm: FormGroup;
  isNumberEditable: boolean = false;
  subject: Subject<string>;

  get smsLength() {
    return +this.smsForm.get('text').value.length;
  }

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, private renderer: Renderer2) { }

  ngOnInit() {
    this.smsForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(700)]]
    });
  }

  toggleNumberEdit() {
    event.preventDefault();
    this.isNumberEditable = !this.isNumberEditable;
    setTimeout(()=>{
      this.renderer.selectRootElement('#userNumber').focus();
    })
  }

  action(value: string) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

}
