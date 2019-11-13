import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-telephone-modal',
  templateUrl: './telephone-modal.component.html',
  styleUrls: ['./telephone-modal.component.scss']
})
export class TelephoneModalComponent implements OnInit {

  subject: Subject<string>;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  action(value: string) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
