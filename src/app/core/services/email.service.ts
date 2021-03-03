import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Email } from 'src/app/shared/models/email';
import { AppConstants } from '../shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient, private storage: StorageMap) { }

  sendEmail(email: Email): Observable< Email|any> {
    const url = `${AppConstants.baseEmailUrl}`;
    return this.http.post<any>(url, email).pipe(
      tap(data => console.log('sent...', JSON.stringify(data))),
      map(response => response.status),
      tap(data => console.log('status received...', JSON.stringify(data))));
  }
}
