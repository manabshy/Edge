import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdalService } from 'adal-angular4';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = null;
  private adalConfig = {
    tenant: 'ed781348-2f1d-4f1e-bbf8-137da318df39',
    clientId: '03d5d394-2418-42fa-a345-556b8d7ffcdb',
    redirectUri: 'http://localhost:4200/auth-callback',
    postLogoutRedirectUri: 'http://localhost:4200',
    endpoints: {
      'http://localhost:59143': '67f9a9a1-d8de-45bc-af20-43e1e18ccba5'
    }
  };

  constructor(private http: HttpClient, private adalService: AdalService) { this.adalService.init(this.adalConfig); }

  public isLoggedIn(): boolean {
    return this.adalService.userInfo.authenticated;
 }

 public signout(): void {
    this.adalService.logOut();
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
 public completeAuthentication(): void {
    this.adalService.handleWindowCallback();
    this.adalService.getUser().subscribe(user => {
    this.user = user;
    console.log(this.adalService.userInfo);
   // var expireIn=user.profile.exp-newDate().getTime();
 });

 }

}
