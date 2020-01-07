import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Valuation, ValuationRequestOption } from './valuation';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';

@Injectable({
  providedIn: 'root'
})
export class ValuationService {
  private valuationPageNumberSubject = new Subject<number>();
  valuationPageNumberChanges$ = this.valuationPageNumberSubject.asObservable();

  constructor(private http: HttpClient) { }

  valuationPageNumberChanged(page: number) {
    this.valuationPageNumberSubject.next(page);
  }

  getValuationSuggestions(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/suggestions?SearchTerm=${searchTerm}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result)
      );
  }

  getValuations(request: ValuationRequestOption): Observable<Valuation[] | any> {
    const options = this.setQueryParams(request);
    const url = `${AppConstants.baseValuationUrl}/search`;
    return this.http.get<any>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log('valuations', JSON.stringify(data)))
      );
  }

  getValuation(valuationId: number): Observable<Valuation| any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result),
        tap(data => console.log('valuation', JSON.stringify(data)))
      );
  }

  setQueryParams(requestOption: ValuationRequestOption) {
    if (!requestOption.page) {
      requestOption.page = 1;
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        searchTerm: requestOption.searchTerm,
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        date: requestOption.date ? requestOption.date.toString() : '',
        status: requestOption.status.toString(),
        valuerId: requestOption.valuerId.toString(),
        officeId: requestOption.officeId.toString()
      }
    });
    return options;
  }

}
