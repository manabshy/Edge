import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { DiaryEvent, BasicEventRequest } from './diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryEventService {


  constructor(private http: HttpClient) { }

  getDiaryEvents(request: BasicEventRequest): Observable<DiaryEvent[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        startDate: request.startDate.toString(),
        endDate: request.endDate.toString(),
        staffMemberId: request.staffMemberId ? request.staffMemberId.toString() : ''
      }
    });
    const url = `${AppConstants.baseDiaryEventUrl}`;
    return this.http.get<any>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getDiaryEventById(diaryEventId: number, graphEventId?: string): Observable<DiaryEvent> {
    const url = `${AppConstants.baseDiaryEventUrl}/${diaryEventId}?graphEventId=${graphEventId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }


  addDiaryEvent(diaryEvent: DiaryEvent): Observable<DiaryEvent | any> {
    const url = `${AppConstants.baseDiaryEventUrl}`;
    return this.http.post<any>(url, diaryEvent).pipe(
      map(response => response.result),
      tap(data => console.log('added event', JSON.stringify(data)))
    );
  }

  updateDiaryEvent(diaryEventId: number): Observable<DiaryEvent | any> {
    const url = `${AppConstants.baseDiaryEventUrl}/${diaryEventId}`;
    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => console.log('updated event', JSON.stringify(data)))
    );
  }
}
