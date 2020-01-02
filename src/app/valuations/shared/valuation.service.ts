import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Valuation, ValuationRequestOption } from './valuation';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';

@Injectable({
  providedIn: 'root'
})
export class ValuationService {

  constructor(private http: HttpClient) { }

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
        map(response => response.result)
      );
  }

  private setQueryParams(requestOption: ValuationRequestOption) {
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
        listerId: requestOption.listerId.toString(),
        officeId: requestOption.officeId.toString()
      }
    });
    return options;
  }

}
