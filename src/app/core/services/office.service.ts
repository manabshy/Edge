import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { Office, OfficeListResult } from '../../shared/models/staff-member';
import { Observable } from 'rxjs';
import { shareReplay, map, tap } from 'rxjs/operators';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private offices$: Observable<Office[] | any>;

  constructor(private http: HttpClient, private storage: StorageMap) { }

  getOffices() {
    if (!this.offices$) {
      this.offices$ = this.requestOffices().pipe(shareReplay(CACHE_SIZE));
    }

    return this.offices$;
  }

  private requestOffices() {
    return this.http.get<OfficeListResult | any>(`${AppConstants.baseOfficeUrl}`)
      .pipe(
        map(response => response),
        tap(data => {
          if (data) {
            this.storage.set('offices', data.result).subscribe();
            this.storage.set('cacheStatus', data.cacheStatus).subscribe();
          }
        })
      );
  }

}
