import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AppUtils } from './utils';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(public modalService: BsModalService) {
  }

  canDeactivate(component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      console.log(component);
      console.log(currentRoute.params);
      console.log(currentState.url);

      AppUtils.prevRoute = AppUtils.prevRouteBU;

      if(!component.canDeactivate()) {
        const subject = new Subject<boolean>();
        const initialState = {
          title: 'If you leave your current changes will be lost',
          actions: ['Stay', 'Leave']
        };
        const modal = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
        modal.content.subject = subject;
        return subject.asObservable();
      }
      return true;
  }
}
