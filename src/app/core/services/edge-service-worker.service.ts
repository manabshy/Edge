import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { interval, concat, Subject } from 'rxjs';
import { first, filter, pairwise, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { Router, RoutesRecognized } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EdgeServiceWorkerService {

  private appChangeSubject = new Subject<UpdateAvailableEvent>();
  appChanges$ = this.appChangeSubject.asObservable();
  public isUpdateAvailable=false
  constructor(private appRef: ApplicationRef,
    private updates: SwUpdate,
    private modalService: BsModalService,
    private router:Router,
    private toastr: ToastrService) {
      this.updates.available.subscribe(evt => {
        if (evt) {
          console.log('event triggered here', evt);
          this.isUpdateAvailable=true
          console.log("update available from service: ", this.isUpdateAvailable)
          // this.showWarning().subscribe(res => {
          //   if (res) {
          //     window.location.reload();
          //   }
          // });
        }
      })
      // this.router.events.pipe(
      //   filter(e => e instanceof RoutesRecognized)
      // ).pipe(
      //   pairwise(),
      //   tap(data => console.log('events here...', data))
      // ).subscribe((event: any[] | RoutesRecognized[])=>{
        // const current = event[1].urlAfterRedirects;
        // const prev = event[0].urlAfterRedirects
        // console.log(prev)
        // console.log("router event: ",event)
        // if(current=='/'&&this.isUpdateAvailable){
        //   console.log("App relaod because of update")
        //   window.location.reload()
        // }
      // })
  }
  getIsupdateAvailable(){
    return this.isUpdateAvailable;
  }

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

  showWarning() {
    const subject = new Subject<boolean>();
    const initialState = {
      title: 'A new version of the app is available!',
      actions: ['', 'Refresh'],
      isSingleAction: true
    };
    const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }
}
