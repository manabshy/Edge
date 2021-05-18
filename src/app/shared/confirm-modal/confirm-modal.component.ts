import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  data: any;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.data = this.config?.data;
    console.log(this.config.data);
  }

  action(value: boolean) {
    console.log({ value });

    this.ref.close(value);
  }

}
