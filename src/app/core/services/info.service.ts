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
        map(response => response),
        tap(data => {
          if (data) {
            this.infoData = data.result;
            this.storage.set('info', this.infoData).subscribe();
            this.storage.set('cacheStatus', data.cacheStatus).subscribe();
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
  valuationStatus: InfoDetail[];
  regions: InfoDetail[];
  areas: InfoDetail[];
  subAreas: InfoDetail[];
  leadTypes: InfoDetail[];
  viewingArrangements: InfoDetail[];
  tenures: InfoDetail[];
  propertyFeatures: InfoDetail[];
  parkings: InfoDetail[];
  outsideSpaces: InfoDetail[];
  originTypes: InfoDetail[];
  origins: InfoDetail[];
  diaryEventTypes: InfoDetail[];
}

export interface InfoDetail {
  id: number;
  value: string;
  parentId: number;
}
