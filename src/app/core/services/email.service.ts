import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BaseEmail } from 'src/app/shared/models/base-email';
import { AppConstants } from '../shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient, private storage: StorageMap) { }

  sendEmail(email: BaseEmail): Observable< BaseEmail|any> {
    const url = `${AppConstants.baseEmailUrl}`;
    return this.http.post<any>(url, email).pipe(
      tap(data => console.log('sent...', JSON.stringify(data))),
      map(response => response.status),
      tap(data => console.log('status received...', JSON.stringify(data))));
  }

  getEmailForNotes(noteId: number): Observable<any> {
    const url = `${AppConstants.baseEmailUrl}/${noteId}`;
    return this.http.get<any>(url).pipe(
      map(response => response.result));
  }
}
