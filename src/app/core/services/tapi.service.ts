import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { TapiInfo } from '../models/tapi-info';
import { Observable } from 'rxjs';
import { CookieService } from './cookies.service';
import { Guid } from 'guid-typescript';



@Injectable({
  providedIn: 'root'
})
export class TapiService {

  constructor(private http: HttpClient, private cookiesService: CookieService) { }

  putCallRequest(tapiInfo: TapiInfo): Observable<any> {
    const url = `${AppConstants.baseTapiUrl}`;
    let serviceBusAddressGuid: string;

    serviceBusAddressGuid = this.cookiesService.getCookie('CurrentServiceBusAddress');

    if (serviceBusAddressGuid == null || serviceBusAddressGuid === '') {
      serviceBusAddressGuid = Guid.create().toString();
      this.cookiesService.setCookie('CurrentServiceBusAddress', serviceBusAddressGuid, 1);
    }

    return this.http.post<TapiInfo>(url, tapiInfo).pipe(tap(data => console.log('result', data)));
  }




}

