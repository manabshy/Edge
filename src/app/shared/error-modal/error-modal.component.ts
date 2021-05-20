import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() title;
  @Input() desc;
  @Input() techDet;
  @Input() error;
  @Input() triggeredBy: string;
  subject: Subject<boolean>;
  @Input() requestUrl: string;
  url: string;
  data: any;

  constructor( private _router: Router, public config: DynamicDialogConfig, public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.url = this._router.url;
    this.data = this.config?.data;
    console.log(this.config.data, 'error modal');
  }

  action(value: boolean) {
    this.ref.close(value);
  }
}
