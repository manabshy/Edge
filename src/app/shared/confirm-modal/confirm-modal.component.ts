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
  @Input() isSingleAction = false;
  @Input() showModal = false;
  subject: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef, private bsModalService:BsModalService) { }

  ngOnInit() {
  }

  action(value: boolean) {
    this.bsModalService.config.animated = false;
    this.bsModalRef.hide();
    // this.showModal = false;
    this.subject.next(value);
    this.subject.complete();
  }

}
