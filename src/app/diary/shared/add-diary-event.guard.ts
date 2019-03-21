import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AddDiaryEventComponent } from '../add-diary-event/add-diary-event.component';

@Injectable({
  providedIn: 'root'
})
export class AddDiaryEventGuard implements CanDeactivate<AddDiaryEventComponent> {
  canDeactivate(component: AddDiaryEventComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      console.log(component);
      console.log(currentRoute.params);
      console.log(currentState.url);
      return component.canDeactivate() || window.confirm('If you leave your current changes will be lost');
  }

}
