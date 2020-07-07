import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsBoardService {

  constructor(private http: HttpClient) { }

  getCsTeamMemberDetails(id: number): Observable<any> {
    const url = ``;
    return this.http.get<any>(url);
  }

  addRecord(record: {}): Observable<any> {
    const url = ``;
    return this.http.post<any>(url, record);
  }
}
