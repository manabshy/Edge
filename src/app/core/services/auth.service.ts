import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { StorageMap } from '@ngx-pwa/local-storage';
import { environment } from 'src/environments/environment';

import { MsalService, BroadcastService } from '@azure/msal-angular';
import { CryptoUtils, Logger } from 'msal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean;
  isIframe: boolean;

  constructor(
    private modalService: BsModalService,
    private storage: StorageMap,
    private authService: MsalService,
    private broadcastService: BroadcastService) { this.isIframe = window !== window.parent && !window.opener; }

  handleRedirect() {
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkAccount();
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
    return this.loggedIn;
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    console.log("im logging in")
    // if (isIE) {
    this.authService.loginRedirect();
    // } else {
    //   this.authService.loginPopup();
    // }
  }

  logout() {
    this.confirmSignOut().subscribe(res => {
      if (res) {
        if (environment.production) {
          this.storage.delete('currentUser').subscribe();
        }
        this.authService.logout();
      }
    });
  }

  completeAuthentication() {
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      console.log('Redirect Success: ', response);
    });
  }

  public confirmSignOut() {
    const subject = new Subject<boolean>();
    const initialState = {
      title: 'Are you sure you want to log out? <br /> The ongoing changes will be lost.',
      actions: ['Stay', 'Log out']
    };
    const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }
}
