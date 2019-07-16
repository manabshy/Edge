import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { TapiInfo } from '../models/tapi-info';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TapiService {

  constructor( private http: HttpClient) { }

  putCallRequest(tapiInfo: TapiInfo): Observable<any> {
    const url = `${AppConstants.baseTapiUrl}`;
    console.log('ttapi info', tapiInfo);
    return this.http.post<TapiInfo>(url, tapiInfo).pipe(tap(data => console.log('result', data)));
    // return false;
  }



}

