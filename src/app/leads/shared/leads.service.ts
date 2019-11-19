import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lead, LeadSearchInfo } from './lead';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  private leadsChangeSubject = new BehaviorSubject<Lead | null>(null);
  private pageChangeSubject = new Subject<LeadSearchInfo | null>();

  leadsChanges$ = this.leadsChangeSubject.asObservable();
  pageChanges$ = this.pageChangeSubject.asObservable();

  constructor(private http: HttpClient) { }

  leadsChanged(lead: Lead) {
    this.leadsChangeSubject.next(lead);
  }

  pageNumberChanged(result: LeadSearchInfo) {
    this.pageChangeSubject.next(result);
  }

  addLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}`;

    return this.http.post<Lead>(url, lead).pipe(
      tap(data => console.log('result', JSON.stringify(data))));
  }

  updateLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}/${lead.leadId}`;
    console.log('Update lead', lead);
    return this.http.put<Lead>(url, lead).pipe(
      map(response => response),
      tap(data => console.log('Updated Lead details here...', JSON.stringify(data))));
  }

  getLead(leadId: number): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}/${leadId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.result));
    //tap(data => console.log('result', JSON.stringify(data))));
  }

  getLeads(staffMemberId: number, pageSize?: number, page?: number): Observable<any> {
    if (!page || +page === 0) {
      page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        staffMemberId: staffMemberId.toString(),
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });

    const url = `${AppConstants.baseLeadsUrl}/owner`;

    return this.http.get<any>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => console.log('result', JSON.stringify(data))));
  }


}


