import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmsInfo } from '../models/person';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient) { }

  sendSMS(sms: SmsInfo): Observable< SmsInfo|any> {
    const url = `${AppConstants.baseSmsUrl}`;
    return this.http.post<any>(url, sms).pipe(
      tap(data => console.log('sent...', JSON.stringify(data))),
      map(response => response.status),
      tap(data => console.log('status received...', JSON.stringify(data))));
  }
}
