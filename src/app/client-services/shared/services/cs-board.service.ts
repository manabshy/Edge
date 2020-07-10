import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { TeamMemberPoint } from '../models/team-member';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class CsBoardService {
  private baseUrl = 'api/teamMembers';


  constructor(private http: HttpClient) { }

  getPointTypes(): Observable<any> {
    const url = `${AppConstants.baseCsboardUrl}/pointTypes`;
    return this.http.get<any>(url).pipe(map(res => res.result));
  }


  getCsTeamMemberPoints(id: number): Observable<TeamMemberPoint[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        staffMemberId: id.toString(),
        DateTime: format(new Date(), 'YYYY-MM-DD')
      }
    });
    const url = `${AppConstants.baseCsboardUrl}/points`;
    return this.http.get<any>(url, { params: options }).pipe(map(res => res.result));
  }

  getCsTeamMemberDetails(id: number): Observable<any> {
    const url = ``;
    return this.http.get<any>(this.baseUrl);
  }

  addRecord(point: TeamMemberPoint): Observable<any> {
    const url = `${AppConstants.baseCsboardUrl}/points`;
    return this.http.post<any>(url, point).pipe(map(res => res.status));
  }
}
