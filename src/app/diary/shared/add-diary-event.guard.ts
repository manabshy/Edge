import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AddDiaryEventComponent } from '../add-diary-event/add-diary-event.component';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from 'src/app/core/confirm-modal/confirm-modal.component';
import { AppUtils } from 'src/app/core/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AddDiaryEventGuard implements CanDeactivate<AddDiaryEventComponent> {

  constructor(public modalService: BsModalService) {
  }

  canDeactivate(component: AddDiaryEventComponent,
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
