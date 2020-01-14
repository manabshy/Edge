import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { interval, concat, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EdgeServiceWorkerService {

  private appChangeSubject = new Subject<UpdateAvailableEvent>();
  appChanges$ = this.appChangeSubject.asObservable();

  constructor(private appRef: ApplicationRef, private updates: SwUpdate, private toastr: ToastrService) { }

  appChanged(update: UpdateAvailableEvent) {
    this.appChangeSubject.next(update);
  }

  checkForUpdate() {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => { this.updates.checkForUpdate(); console.log('check for update'); });
  }

  // TODO: Prompt user before reloading the page
  forceUpdate() {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        if (event) {
          this.appChanged(event);
          console.log('app has some changes..................', event);
          this.toastr.info('We are updating the app. Please wait!', '', { timeOut: 20000 });
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      });
    }
  }
}
