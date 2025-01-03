import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { TapiRequestInfo } from '../../shared/models/tapi-request-info';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { StaffMemberService } from './staff-member.service';
import { StaffMember } from '../../shared/models/staff-member';

@Injectable({
  providedIn: 'root'
})
export class TapiService {

  currentStaffMember: StaffMember;
  constructor(private http: HttpClient, private staffMemberService: StaffMemberService) { }

  putCallRequest(tapiRequestInfo: TapiRequestInfo): Observable<any> {
    console.log('tapi request', tapiRequestInfo);
    const url = `${AppConstants.baseTapiUrl}`;

    // User Name
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);

    // getting callRequestsSubscriptionAddress if already exists
    let callRequestsSubscriptionAddress = sessionStorage.getItem('callRequestsSubscriptionAddress');

    // If callRequestsSubscriptionAddress is empty then generate GUID to use as a Call Requests Subscription Address
    if (callRequestsSubscriptionAddress === '' || callRequestsSubscriptionAddress == null) {
      const guid = Guid.create().toString();
      sessionStorage.setItem('callRequestsSubscriptionAddress', guid);
      tapiRequestInfo.guid = guid;
    } else {
      callRequestsSubscriptionAddress = sessionStorage.getItem('callRequestsSubscriptionAddress');
      tapiRequestInfo.guid = callRequestsSubscriptionAddress;
    }

    return this.http.post<TapiRequestInfo>(url, tapiRequestInfo).pipe(tap(data => console.log('result', data)));
  }




}

