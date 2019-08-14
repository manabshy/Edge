import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EdgeServiceWorkerService {

  constructor(private appRef: ApplicationRef, private updates: SwUpdate) { }

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
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      });
    }
  }
}
