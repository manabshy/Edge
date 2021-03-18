import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lead, LeadSearchInfo } from './lead';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { format } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  private leadsChangeSubject = new BehaviorSubject<Lead | null>(null);
  private pageChangeSubject = new Subject<LeadSearchInfo | null>();
  private isLeadUpdatedSubject = new Subject<boolean | null>();
  private leadSearchTermSubject = new Subject<string | null>();

  leadSearchTermChanges$ = this.leadSearchTermSubject.asObservable();
  isLeadUpdated$ = this.isLeadUpdatedSubject.asObservable();
  leadsChanges$ = this.leadsChangeSubject.asObservable();
  pageChanges$ = this.pageChangeSubject.asObservable();

  private readonly MAX_PAGE_SIZE = '500';

  constructor(private http: HttpClient) { }

  isLeadUpdated(updated: boolean) {
    this.isLeadUpdatedSubject.next(updated);
  }

  leadsSearchTermChanged(term: string) {
    this.leadSearchTermSubject.next(term);
  }
  leadsChanged(lead: Lead) {
    this.leadsChangeSubject.next(lead);
  }

  pageNumberChanged(leadSearchInfo: LeadSearchInfo) {

    this.pageChangeSubject.next(leadSearchInfo);
  }

  addLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}`;
    console.log('Add lead', lead);
    return this.http.post<any>(url, lead).pipe(
      map(response => response.result),
      tap(data => console.log('result', JSON.stringify(data))));
  }

  updateLead(lead: Lead): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}/${lead.leadId}`;

    return this.http.put<any>(url, lead).pipe(
      map(response => response.result),
      tap(data => console.log('Updated Lead details here...', JSON.stringify(data))));
  }

  getLead(leadId: number): Observable<any> {
    const url = `${AppConstants.baseLeadsUrl}/${leadId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.result));
  }

  getLeads(leadSearchInfo: LeadSearchInfo, pageSize?: number): Observable<any> {
    const dateTo = leadSearchInfo.dateTo ? format(leadSearchInfo?.dateTo, 'yyyy-MM-dd') : '';
    const dateFrom = leadSearchInfo.dateFrom ? format(leadSearchInfo?.dateFrom, 'yyyy-MM-dd') : '';
    if (!leadSearchInfo.page || +leadSearchInfo.page === 0) {
      leadSearchInfo.page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }

    console.log('get leads date params', leadSearchInfo);

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        ownerId: leadSearchInfo.ownerId != null ? leadSearchInfo.ownerId.toString() : '',
        personId: leadSearchInfo.personId != null ? leadSearchInfo.personId.toString() : '',
        leadTypeIds: leadSearchInfo.leadTypeIds != null ? leadSearchInfo?.leadTypeIds?.toString() : '',
        officeIds: leadSearchInfo.officeIds != null ? leadSearchInfo.officeIds?.toString() : '',
        dateFrom: leadSearchInfo.dateFrom != null ? dateFrom.toString() : '',
        dateTo: leadSearchInfo.dateTo != null ? dateTo.toString() : '',
        listingType: leadSearchInfo.listingType != null ? leadSearchInfo.listingType.toString() : '',
        includeClosedLeads: leadSearchInfo.includeClosedLeads != null ? (String)(leadSearchInfo.includeClosedLeads) : '',
        // includeUnassignedLeadsOnly: leadSearchInfo.includeUnassignedLeadsOnly != null
        //   ? (String)(leadSearchInfo.includeUnassignedLeadsOnly) : '',
        page: leadSearchInfo.page.toString(),
        pageSize: pageSize.toString(),
        searchTerm: leadSearchInfo.leadSearchTerm != null ? leadSearchInfo.leadSearchTerm : '',
        allowPaging: 'true'
      }
    });

    console.log('get leads options', options);
    const url = `${AppConstants.baseLeadsUrl}/search`;

    return this.http.get<any>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {
          console.log('lead search redult:', data);
        }
      }));
  }

  // Returning list of Lead Ids
  getLeadIds(leadSearchInfo: LeadSearchInfo, pageSize?: number): Observable<any> {
    // const dateTo = format(leadSearchInfo.dateTo, 'yyyy-MM-dd');
    // const dateFrom = format(leadSearchInfo.dateFrom, 'yyyy-MM-dd');
    const dateTo = leadSearchInfo.dateTo ? format(leadSearchInfo?.dateTo, 'yyyy-MM-dd') : '';
    const dateFrom = leadSearchInfo.dateFrom ? format(leadSearchInfo?.dateFrom, 'yyyy-MM-dd') : '';
    console.log('date params', leadSearchInfo);

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        ownerId: leadSearchInfo.ownerId != null ? leadSearchInfo.ownerId.toString() : '',
        personId: leadSearchInfo.personId != null ? leadSearchInfo.personId.toString() : '',
        leadTypeIds: leadSearchInfo.leadTypeIds != null ? leadSearchInfo.leadTypeIds.toString() : '',
        officeIds: leadSearchInfo.officeIds != null ? leadSearchInfo.officeIds.toString() : '',
        dateFrom: leadSearchInfo.dateFrom != null ? dateFrom.toString() : '',
        dateTo: leadSearchInfo.dateTo != null ? dateTo.toString() : '',
        listingType: leadSearchInfo.listingType != null ? leadSearchInfo.listingType.toString() : '',
        includeClosedLeads: leadSearchInfo.includeClosedLeads != null ? (String)(leadSearchInfo.includeClosedLeads) : '',
        // includeUnassignedLeadsOnly: leadSearchInfo.includeUnassignedLeadsOnly != null
        //   ? (String)(leadSearchInfo.includeUnassignedLeadsOnly) : '',
        startLeadId: leadSearchInfo.startLeadId != null ? leadSearchInfo.startLeadId.toString() : '',
        searchTerm: leadSearchInfo.leadSearchTerm != null ? leadSearchInfo.leadSearchTerm : '',
        allowPaging: 'false',
        pageSize: this.MAX_PAGE_SIZE.toString()
      }
    });

    const url = `${AppConstants.baseLeadsUrl}/ids`;

    return this.http.get<any>(url, { params: options }).pipe(
      map(response => response.result));
  }

  getLeadSuggestions(searchTerm): Observable<any> {

    return this.http.get<any>(`${AppConstants.baseLeadsUrl}/suggestions?SearchTerm=${searchTerm}`, {
      headers: { ignoreLoadingBar: '' }
    }).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {

        }
      }));
  }

  assignLeads(leadOwner: number, leads: Lead[]): Observable<Lead[] | any> {
    const url = `${AppConstants.baseLeadsUrl}/assign`;

    const leadAssignmentInfo = { leadOwnerId: leadOwner, leads: leads };
    console.log('lead assignment object:', leadAssignmentInfo);

    return this.http.put<any>(url, leadAssignmentInfo).pipe(
      map(response => response.result),
      tap(data => console.log('Updated Lead details here...', JSON.stringify(data))));
  }

  setQueryParams(leadSearchInfo: LeadSearchInfo, pageSize?: number) {
    const dateTo = leadSearchInfo.dateTo ? format(leadSearchInfo?.dateTo, 'yyyy-MM-dd') : '';
    const dateFrom = leadSearchInfo.dateFrom ? format(leadSearchInfo?.dateFrom, 'yyyy-MM-dd') : '';
    
    console.log('date params', leadSearchInfo);
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        ownerId: leadSearchInfo.ownerId != null ? leadSearchInfo.ownerId.toString() : '',
        personId: leadSearchInfo.personId != null ? leadSearchInfo.personId.toString() : '',
        leadTypeIds: leadSearchInfo.leadTypeIds != null ? leadSearchInfo?.leadTypeIds?.toString() : '',
        officeIds: leadSearchInfo.officeIds != null ? leadSearchInfo.officeIds?.toString() : '',
        dateFrom: leadSearchInfo.dateFrom != null ? dateFrom.toString() : '',
        dateTo: leadSearchInfo.dateTo != null ? dateTo.toString() : '',
        listingType: leadSearchInfo.listingType != null ? leadSearchInfo.listingType.toString() : '',
        includeClosedLeads: leadSearchInfo.includeClosedLeads != null ? (String)(leadSearchInfo.includeClosedLeads) : '',
        // includeUnassignedLeadsOnly: leadSearchInfo.includeUnassignedLeadsOnly != null
        //   ? (String)(leadSearchInfo.includeUnassignedLeadsOnly) : '',
        page: leadSearchInfo.page.toString(),
        pageSize: pageSize.toString(),
        searchTerm: leadSearchInfo.leadSearchTerm != null ? leadSearchInfo.leadSearchTerm : '',
        allowPaging: 'true'
      }
    });

    return options;
  }

}


