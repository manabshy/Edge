import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() title;
  @Input() desc;
  @Input() techDet;
  subject: Subject<boolean>;
  url: string;

  constructor(public bsModalRef: BsModalRef, private _router: Router) { }

  ngOnInit() {
    this.url = this._router.url;
  }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }
}
