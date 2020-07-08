import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsBoardService {
private baseUrl = 'api/teamMembers';

  constructor(private http: HttpClient) { }

  getCsTeamMembers(): Observable<any> {
    const url = ``;
    return this.http.get<any>(this.baseUrl);
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
