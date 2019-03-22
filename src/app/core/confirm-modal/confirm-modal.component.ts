import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  public onClose: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef, public modalService: BsModalService) { }

  ngOnInit() {
  }

  public onConfirm(): void {
    this.modalService.setDismissReason('');
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.modalService.setDismissReason('stay');
    this.bsModalRef.hide();
  }
}
