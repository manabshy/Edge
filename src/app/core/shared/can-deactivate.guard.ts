import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Observer, Subject } from 'rxjs';
import { AppUtils } from './utils';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  ref: DynamicDialogRef;
  constructor(public modalService: BsModalService, public dialogService: DialogService) {
  }

  canDeactivate(component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    AppUtils.prevRoute = AppUtils.prevRouteBU;

    // if (!component.canDeactivate()) {
    //   AppUtils.deactivateRoute = AppUtils.prevRoute;
    //   const subject = new Subject<boolean>();
    //   const initialState = {
    //     title: 'If you leave your current changes will be lost',
    //     actions: ['Stay', 'Leave'],
    //     showModal: true
    //   };
    //   const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    //   modal.content.subject = subject;
    //   return subject.asObservable();
    // }
    if (!component.canDeactivate()) {
      AppUtils.deactivateRoute = AppUtils.prevRoute;
      const subject = new Subject<boolean>();
      const data = {
        title: 'If you leave your current changes will be lost',
        actions: ['Stay', 'Leave']
      };
      this.ref = this.dialogService.open(ConfirmModalComponent, { data, width: '30%', showHeader: false });
      this.ref.onClose.subscribe((res) => { if (res) { subject.next(true); subject.complete(); } });
      console.log(this.ref, 'res');
      return subject.asObservable();
    }
    return true;
  }
}
