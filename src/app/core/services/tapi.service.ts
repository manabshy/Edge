import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { TapiInfo } from '../models/tapi-info';
import { Observable } from 'rxjs';
import { CookieService } from './cookies.service';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class TapiService {

  constructor(private http: HttpClient, private cookiesService: CookieService, private toastr: ToastrService) { }

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

  call(number) {
    if (window.innerWidth < 576) {
      window.open('tel:' + number);
    } else {
      // alert('Calling...');
      const tapiInfo: TapiInfo = {
        officeId: 10,
        staffId: 10,
        isOutGoingCall: true,
        callerNmber: '4629',
        calledNumber: '07718702809',
        IP: '192.168.10.29'
      };

      this.putCallRequest(tapiInfo).subscribe(data => {
        this.toastr.warning('Dialing ...');
        console.log(data)
      });

    }
  }




}

