import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  Valuation,
  ValuationRequestOption,
  ValuationPropertyInfo,
  Valuer,
  ValuersAvailabilityOption,
  CalendarAvailibility,
} from "./valuation";
import { AppConstants } from "src/app/core/shared/app-constants";
import { map, tap } from "rxjs/operators";
import { CustomQueryEncoderHelper } from "src/app/core/shared/custom-query-encoder-helper";
import { Instruction } from "src/app/shared/models/instruction";
import { StorageMap } from "@ngx-pwa/local-storage";

@Injectable({
  providedIn: "root",
})
export class ValuationService {
  private valuationPageNumberSubject = new Subject<number>();
  valuationPageNumberChanges$ = this.valuationPageNumberSubject.asObservable();

  contactGroupBs = new BehaviorSubject(null);

  constructor(private http: HttpClient, private storage: StorageMap) {}

  valuationPageNumberChanged(page: number) {
    this.valuationPageNumberSubject.next(page);
  }

  getValuationSuggestions(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/suggestions?SearchTerm=${searchTerm}`;
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: "" },
      })
      .pipe(map((response) => response.result));
  }

  getValuations(
    request: ValuationRequestOption
  ): Observable<Valuation[] | any> {
    console.log('request for valuations query: ', request)
    const options = this.setQueryParams(request);
    const url = `${AppConstants.baseValuationUrl}/search`;
    return this.http.get<any>(url, { params: options }).pipe(
      map((response) => response.result),
      // tap((data) => console.log("valuations", JSON.stringify(data)))
    );
  }

  getValuation(valuationId: number): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationId}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.result)
      // tap(data => console.log('valuation', JSON.stringify(data)))
    );
  }

  addValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}`;
    return this.http.post<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log("added valuation", JSON.stringify(data)))
    );
  }

  updateValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuation.valuationEventId}`;
    return this.http.put<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log("added valuation", JSON.stringify(data)))
    );
  }

  getValuationPropertyInfo(
    propertyId: number
  ): Observable<ValuationPropertyInfo | any> {
    const url = `${AppConstants.baseValuationUrl}/propertyInfo/${propertyId}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
      tap()
    );
  }

  getValuers(propertyId: number): Observable<Valuer[] | any> {
    const url = `${AppConstants.baseValuationUrl}/valuers?propertyId=${propertyId}`;
    return this.http.get<any>(url).pipe(map((response) => response.result));
  }

  getValuersAvailability(
    availability: ValuersAvailabilityOption
  ): Observable<CalendarAvailibility | any> {
    const options = this.setAvailabilityQueryParams(availability);
    const url = `${AppConstants.baseValuationUrl}/valuers/availability`;
    return this.http.get<any>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => console.log("availability", JSON.stringify(data)))
    );
  }

  // Extract to instruction service
  addInstruction(instruction: Instruction): Observable<Instruction | any> {
    const url = `${AppConstants.baseValuationUrl}/${instruction.valuationEventId}/instruct`;
    return this.http.post<any>(url, instruction).pipe(
      map((response) => response),
      tap((data) => console.log("added instruction", JSON.stringify(data)))
    );
  }

  setAvailabilityQueryParams(requestOption: ValuersAvailabilityOption) {
    if (!requestOption.page) {
      requestOption.page = 1;
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        fromDate: requestOption.fromDate
          ? requestOption.fromDate.toString()
          : "",
        staffMemberId1: requestOption.salesValuerId
          ? requestOption.salesValuerId.toString()
          : "0",
        staffMemberId2: requestOption.lettingsValuerId
          ? requestOption.lettingsValuerId.toString()
          : "0",
      },
    });
    return options;
  }
  setQueryParams(requestOption: ValuationRequestOption) {
    console.log('requestOption.status: ', requestOption.status)
    if (!requestOption.page) {
      requestOption.page = 1;
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 20;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: requestOption.searchTerm,
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        date: requestOption.date ? requestOption.date.toString() : "",
        status: requestOption.status.toString(),
        valuerId: requestOption.valuerId.toString(),
        officeId: requestOption.officeId.toString(),
      },
    });
    return options;
  }
}
