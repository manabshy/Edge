import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class DiaryEventService {

  constructor(private http: HttpClient) { }

  getDiaryEvents(period: any): Observable<any[]> {
    const url = `${AppConstants.baseDiaryEventUrl}/${period}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }
}
