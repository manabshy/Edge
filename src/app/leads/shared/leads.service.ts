import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead } from './lead';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }
  
  
  addLead(lead: Lead): Observable<any> {
      const url = `${AppConstants.baseLeadsUrl}`;
    return this.http.post<Lead>(url, lead).pipe(tap(data => console.log('result', data)));
  }

  updateLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}`;

    return this.http.post<Lead>(url, lead).pipe(tap(data => console.log('result', data)));
  }

  getLead(leadId: number): Observable<any>  {
    const url = `${AppConstants.baseLeadsUrl}`;
    return this.http.get<Lead>(url).pipe(tap(data => console.log('result', data)));
  }
}


