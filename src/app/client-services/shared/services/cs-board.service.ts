import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map } from 'rxjs/operators';

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

  getCsTeamMemberDetails(id: number): Observable<any> {
    const url = ``;
    return this.http.get<any>(this.baseUrl);
  }

  addRecord(record: {}): Observable<any> {
    const url = ``;
    return this.http.post<any>(url, record);
  }
}
