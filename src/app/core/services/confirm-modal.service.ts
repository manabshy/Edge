import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';


@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  bsModalRef: BsModalRef;
  subject:any = new Subject;

  constructor(public modalService: BsModalService) { }

  confirm(message?: string, actions?: any[]) {
    let confirmBool
    const initialState = {
      actions: actions,
      title: message
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {initialState});

    this.modalService.onHide.subscribe(result => {
      if(result) {
        confirmBool = false;
      } else {
        confirmBool = true;
      }

      console.log(confirmBool);
    });

    this.subject.next({confirmRes: confirmBool});
  }

  retunConfirm(): Observable<boolean> {

    return this.subject.asObservable();
    
  };
}
