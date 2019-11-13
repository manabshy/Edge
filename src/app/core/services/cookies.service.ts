import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class CookieService {

  constructor() { }

  public getCookie(name: string) {
    const ca: Array<string> = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  public deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  public setCookie(name: string, value: string, expireDays: number, path: string = "") {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires: string = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + (path.length > 0 ? '; path=' + path : '');
  }

}
