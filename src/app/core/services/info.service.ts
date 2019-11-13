import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, tap, map } from 'rxjs/operators';
import { AppConstants } from '../shared/app-constants';
import { HttpClient } from '@angular/common/http';
import { StorageMap } from '@ngx-pwa/local-storage';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private infoDetail$: Observable<DropdownListInfo>;
  infoData: any;
  info: DropdownListInfo;
  constructor(private http: HttpClient, private storage: StorageMap) { }

  getDropdownListInfo(): Observable<DropdownListInfo> {
    if (!this.infoDetail$) {
      this.infoDetail$ = this.requestDropdownListInfo().pipe(shareReplay(CACHE_SIZE));
    }

    return this.infoDetail$;
  }


  private requestDropdownListInfo(): Observable<DropdownListInfo> {
    return this.http.get<any>(AppConstants.baseInfoUrl)
      .pipe(
        map(response => response.result),
        tap(data => {
          if (data) {
            this.infoData = data;
            this.storage.set('info', data).subscribe();
          }
        })
      );
  }

}

export interface DropdownListInfo {
  titles: Record<number, string>;
  telephoneTypes: Record<number, string>;
  propertyNoteTypes: Record<number, string>;
  countries: InfoDetail[];
  companyTypes: InfoDetail[];
  personWarningStatuses: InfoDetail[];
  propertyStyles: InfoDetail[];
  propertyTypes: InfoDetail[];
  offerLettingStatuses: InfoDetail[];
  offerSaleStatuses: InfoDetail[];
  propertyLettingStatuses: InfoDetail[];
  propertySaleStatuses: InfoDetail[];
  regions: InfoDetail[];
  areas: InfoDetail[];
  subAreas: InfoDetail[];
  leadTypes: InfoDetail[];
}

export interface InfoDetail {
  id: number;
  value: string;
  parentId: number;
}
