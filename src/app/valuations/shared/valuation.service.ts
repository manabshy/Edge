import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Valuation } from './valuation';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValuationService {

  constructor(private http: HttpClient) { }

  getValuations(): Observable<Valuation[] | any> {
    const url = `${AppConstants.baseValuationUrl}/search`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result)
      );
  }
}
