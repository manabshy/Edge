import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { DiaryEvent } from './diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryEventService {

  constructor(private http: HttpClient) { }

  getDiaryEvents(startDate: string, endDate: string, staffMemberId?: number): Observable<DiaryEvent[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        staffMemberId: staffMemberId ? staffMemberId.toString(): ''
      }
    });
    const url = `${AppConstants.baseDiaryEventUrl}`;
    return this.http.get<any>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }
}
