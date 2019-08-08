import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { AppConstants } from '../shared/app-constants';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: UserForAuthentication;
  endPointUrl = AppConstants.endpointUrl;
  private adalConfig = {
    tenant: AppConstants.tenant,
    clientId: AppConstants.clientId,
    redirectUri: AppConstants.redirectUri,
    postLogoutRedirectUri: AppConstants.postLogoutRedirectUri,
    cacheLocation: 'localStorage',
    endpoints: {
      'https://dandg-api-wedge.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5',
      'https://dandg-api-wedge-dev.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5',
      'https://dandg-api-wedge-test.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5'
      //  endPointUrl : '67f9a9a1-d8de-45bc-af20-43e1e18ccba5'
    }
    // tenant: 'ed781348-2f1d-4f1e-bbf8-137da318df39',
    // clientId: '03d5d394-2418-42fa-a345-556b8d7ffcdb',
    // redirectUri: 'https://dandg-edge-test.azurewebsites.net/auth-callback',
    // postLogoutRedirectUri: 'https://dandg-edge-test.azurewebsites.net',
    // redirectUri: 'https://stagedouglasandgordon-wedge.azurewebsites.net/auth-callback',
    // postLogoutRedirectUri: 'https://stagedouglasandgordon-wedge.azurewebsites.net',
    // redirectUri: 'http://localhost:4200/auth-callback',
    // postLogoutRedirectUri: 'http://localhost:4200',
  };

  constructor(private adalService: AdalService, private modalService: BsModalService, private _router: Router) { this.adalService.init(this.adalConfig); }

  public isLoggedIn(): boolean {
    return this.adalService.userInfo.authenticated;
 }

 public signout(): void {
    this.confirmSignOut().subscribe(res => {
      if(res) {
        localStorage.removeItem('currentUser');
        localStorage.setItem('prev', this._router.url)
        this.adalService.logOut();
      }
    })
 }

 public startAuthentication(): any {
    this.adalService.login();
 }

 public getName(): string {
    return this.user.profile.name;
 }
 public getFirstname(): string {
    return this.user.profile.given_name;
 }

 public getUsername(): string {
   return this.user.userName;
 }

 public getToken() {
  return this.adalService.acquireToken(this.adalConfig.clientId);
 }
 public completeAuthentication(): void {
    this.adalService.handleWindowCallback();
    this.adalService.getUser().subscribe(user => {
    this.user = user;
    // console.log(this.adalService.userInfo);
   // var expireIn=user.profile.exp-newDate().getTime();
 });

 }

 public confirmSignOut() {
  const subject = new Subject<boolean>();
  const initialState = {
    title: 'Are you sure you want to log out? <br /> The ongoing changes will be lost.',
    actions: ['Stay', 'Log out']
  };
  const modal = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
  modal.content.subject = subject;
  return subject.asObservable();
 }

}

export interface UserForAuthentication {
  userName: string;
  profile: Profile;
  authenticated: any;
  error: any;
  token: any;
  loginCached: boolean;
}

export interface Profile {
  given_name: string;
  name: string;
}
