import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() title;
  @Input() danger;
  @Input() actions = [];
  subject: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

}
