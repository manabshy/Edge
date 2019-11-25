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
    console.log('Add lead', lead);
    return this.http.post<Lead>(url, lead).pipe(
      map(response => response),
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

  getLeads(leadSearchInfo: LeadSearchInfo, pageSize?: number): Observable<any> {
    if (!leadSearchInfo.page || +leadSearchInfo.page === 0) {
      leadSearchInfo.page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }

    console.log('date params', leadSearchInfo);

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        ownerId: leadSearchInfo.ownerId != null ? leadSearchInfo.ownerId.toString() : '',
        leadTypeId: leadSearchInfo.leadTypeId != null ? leadSearchInfo.leadTypeId.toString() : '',
        officeId: leadSearchInfo.officeId != null ? leadSearchInfo.officeId.toString() : '',
        dateFrom: leadSearchInfo.dateFrom != null ? new Date(leadSearchInfo.dateFrom.toString()).toLocaleDateString() : '',
        dateTo: leadSearchInfo.dateTo != null ? new Date(leadSearchInfo.dateTo.toString()).toLocaleDateString() : '',
        includeClosedLeads: leadSearchInfo.includeClosedLeads != null ? (String)(leadSearchInfo.includeClosedLeads) : '',
        includeUnassignedLeadsOnly: leadSearchInfo.includeUnassignedLeadsOnly != null
          ? (String)(leadSearchInfo.includeUnassignedLeadsOnly) : '',
        page: leadSearchInfo.page.toString(),
        pageSize: pageSize.toString()
      }
    });

    const url = `${AppConstants.baseLeadsUrl}/owner`;

    return this.http.get<any>(url, { params: options }).pipe(
      map(response => response.result));
  }


}


