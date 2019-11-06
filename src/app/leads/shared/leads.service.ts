import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead } from './lead';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http: HttpClient) { }


  addLead(lead: Lead): Observable<any> {
      const url = `${AppConstants.baseLeadsUrl}`;

      return this.http.post<Lead>(url, lead).pipe(
        tap(data => console.log('result', JSON.stringify(data))));
  }

  updateLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}/${lead.leadId}`;

    return this.http.put<Lead>(url, lead).pipe(
      map(response => response),
      tap(data => console.log('Updated Lead details here...', JSON.stringify(data))));
  }

  getLead(leadId: number): Observable<any>  {
    const url = `${AppConstants.baseLeadsUrl}/${leadId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => console.log('result', JSON.stringify(data))));
  }

  getLeads(staffMemberId: number): Observable<any>  {
    const url = `${AppConstants.baseLeadsUrl}/owner/${staffMemberId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => console.log('result', JSON.stringify(data))));
  }
}


