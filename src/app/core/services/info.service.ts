import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { HttpClient } from '@angular/common/http';
const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private infoDetail$: Observable<DropdownListInfo>;
  private infoSubject = new BehaviorSubject<DropdownListInfo | null>(null);
  info$ = this.infoSubject.asObservable();

  constructor(private http: HttpClient) { }

  getDropdownListInfo(): Observable<DropdownListInfo> {
    if (!this.infoDetail$) {
      this.infoDetail$ = this.requestDropdownListInfo().pipe(shareReplay(CACHE_SIZE));
    }

    return this.infoDetail$;
  }

  infoChanged(info: DropdownListInfo) {
    this.infoSubject.next(info);
  }

  private requestDropdownListInfo(): Observable<DropdownListInfo> {
    return this.http.get<DropdownListInfo>(AppConstants.baseInfoUrl);
  }
}

export interface DropdownListInfo {
  Countries: InfoDetail[];
  CompanyTypes: InfoDetail[];
  Titles: Record<number, string>;
  TelephoneTypes: Record<number, string>;
  PropertyStyles: InfoDetail[];
  PropertyTypes: InfoDetail[];
  PersonWarningStatuses: InfoDetail[];
  propertyNoteTypes: InfoDetail[];
}

export interface InfoDetail {
  id: number;
  value: string;
  parentId: number;
}
