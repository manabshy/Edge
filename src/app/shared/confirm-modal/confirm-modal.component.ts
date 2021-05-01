import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  data: any;

  // constructor(public bsModalRef: BsModalRef, private bsModalService: BsModalService) { }
  constructor(public config: DynamicDialogConfig,  public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.data = this.config?.data;
    console.log(this.config.data);
  }

  action(value: boolean) {
    console.log({value});

    this.ref.close(value);
    // this.bsModalService.config.animated = false;
    // this.bsModalRef.hide();
    // // this.showModal = false;
    // this.subject.next(value);
    // this.subject.complete();
  }

}
