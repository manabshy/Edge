import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { AppConstants } from '../shared/app-constants';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { environment } from 'src/environments/environment';
import { ConfigsLoaderService } from 'src/app/configs-loader.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: UserForAuthentication;
  endPointUrl = AppConstants.endpointUrl;
  private adalConfig = {
    tenant: AppConstants.tenant,
    clientId: AppConstants.clientId,
    redirectUri: AppConstants.redirectUri.startsWith('http') ? AppConstants.redirectUri : `${this.configLoaderService.AppEndpoint}/auth-callback`,
    postLogoutRedirectUri: AppConstants.postLogoutRedirectUri,
    cacheLocation: 'localStorage',
    // loadFrameTimeout: 600000,
    loadFrameTimeout: 36000000,
    endpoints: {
      'https://dandg-api-wedge.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5',
      'https://dandg-api-wedge-dev.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5',
      'https://dandg-api-wedge-test.azurewebsites.net': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5'
      //  endPointUrl : '67f9a9a1-d8de-45bc-af20-43e1e18ccba5'
    }
  };

  constructor(private adalService: AdalService,
    private modalService: BsModalService,
    private storage: StorageMap,
    private configLoaderService: ConfigsLoaderService,
    private _router: Router) { this.adalService.init(this.adalConfig); console.log('load config with new uri endpoint', this.adalConfig, 'this.configLoaderService.AppEndpoint...', this.configLoaderService.AppEndpoint )}

  public isLoggedIn(): boolean {
    return this.adalService.userInfo.authenticated;
  }

  // TODO: Refactor to add proper env check
  public signout(): void {
    this.confirmSignOut().subscribe(res => {
      if (res) {
        if (environment.production) {
          this.storage.delete('currentUser').subscribe();
        }
        this.adalService.logOut();
      }
    });
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
