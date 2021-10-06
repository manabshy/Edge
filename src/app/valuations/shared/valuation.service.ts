import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import {
  Valuation,
  ValuationRequestOption,
  ValuationPropertyInfo,
  Valuer,
  ValuersAvailabilityOption,
  CalendarAvailibility,
  CancelValuation,
  ValuationStatusEnum,
  ValuationCancellationReasons,
  valuationNote,
} from './valuation'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { map, tap } from 'rxjs/operators'
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper'
import { Instruction } from 'src/app/shared/models/instruction'
import { StorageMap } from '@ngx-pwa/local-storage'

@Injectable({
  providedIn: 'root',
})
export class ValuationService {
  private valuationPageNumberSubject = new Subject<number>()
  valuationPageNumberChanges$ = this.valuationPageNumberSubject.asObservable()

  contactGroupBs = new BehaviorSubject(null)
  public readonly contactGroup$ = this.contactGroupBs.asObservable()

  valuationValidationSubject = new Subject<boolean>()
  valuationValidation$ = this.valuationValidationSubject.asObservable()

  validationControlBs = new BehaviorSubject(false)
  landRegisterValid = new BehaviorSubject(false)
  doValuationSearchBs = new BehaviorSubject(false)

  private readonly _valuation: BehaviorSubject<Valuation | any> = new BehaviorSubject({})
  public readonly valuation$: Observable<Valuation | any> = this._valuation.asObservable()

  constructor(private http: HttpClient, private storage: StorageMap) {}

  valuationPageNumberChanged(page: number) {
    this.valuationPageNumberSubject.next(page)
  }

  getValuationNote(valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationEventId}/note`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' },
      })
      .pipe(map((response) => response.result))
  }

  getValuationSuggestions(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/suggestions?SearchTerm=${searchTerm}`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' },
      })
      .pipe(map((response) => response.result))
  }

  getValuations(request: ValuationRequestOption): Observable<Valuation[] | any> {
    console.log('request for valuations query: ', request)
    const options = this.setQueryParams(request)
    const url = `${AppConstants.baseValuationUrl}/search`
    return this.http
      .get<any>(url, { params: options })
      .pipe(
        map((response) => response.result),
        // tap((data) => console.log("valuations", JSON.stringify(data)))
      )
  }

  getValuation(valuationId: number): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationId}`
    return this.http.get<any>(url).pipe(
      map((response) => {
        const valuationObj = {
          ...response.result,
          valuationStatusDescription: ValuationStatusEnum[response.result.valuationStatus],
        }
        this._valuation.next(valuationObj)
        return valuationObj
      }),
      // tap(data => console.log('valuation', JSON.stringify(data)))
    )
  }

  getToBLink(valuationId: number): Observable<any> {
    const url = `${AppConstants.esignUrl}/signatureLinks/${valuationId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  addValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}`
    return this.http.post<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation', JSON.stringify(data))),
    )
  }

  cancelValuation(cancelVm: CancelValuation): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${cancelVm.valuationEventId}/cancel`
    return this.http.put<any>(url, cancelVm).pipe(
      map((response) => response.result),
      tap((data) => console.log('cancel valuation', JSON.stringify(data))),
    )
  }

  updateValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuation.valuationEventId}`
    return this.http.put<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation', JSON.stringify(data))),
    )
  }

  saveValuationNote(valuationNote: valuationNote): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationNote.valuationEventId}/note`
    return this.http.post<any>(url, valuationNote).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation note', JSON.stringify(data))),
    )
  }

  getValuationPropertyInfo(propertyId: number): Observable<ValuationPropertyInfo | any> {
    const url = `${AppConstants.baseValuationUrl}/propertyInfo/${propertyId}`
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
      tap(),
    )
  }

  getValuers(propertyId: number): Observable<Valuer[] | any> {
    const url = `${AppConstants.baseValuationUrl}/valuers?propertyId=${propertyId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getValuersAvailability(availability: ValuersAvailabilityOption): Observable<CalendarAvailibility | any> {
    const options = this.setAvailabilityQueryParams(availability)
    const url = `${AppConstants.baseValuationUrl}/valuers/availability`
    return this.http
      .get<any>(url, { params: options })
      .pipe(
        map((response) => response.result),
        tap((data) => console.log('availability', JSON.stringify(data))),
      )
  }

  // Extract to instruction service
  addInstruction(instruction: Instruction): Observable<Instruction | any> {
    const url = `${AppConstants.baseValuationUrl}/${instruction.valuationEventId}/instruct`
    return this.http.post<any>(url, instruction).pipe(
      map((response) => response),
      tap((data) => console.log('added instruction', JSON.stringify(data))),
    )
  }

  setAvailabilityQueryParams(requestOption: ValuersAvailabilityOption) {
    if (!requestOption.page) {
      requestOption.page = 1
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 10
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        fromDate: requestOption.fromDate ? requestOption.fromDate.toString() : '',
        staffMemberId1: requestOption.salesValuerId ? requestOption.salesValuerId.toString() : '0',
        staffMemberId2: requestOption.lettingsValuerId ? requestOption.lettingsValuerId.toString() : '0',
      },
    })
    return options
  }
  setQueryParams(requestOption: ValuationRequestOption) {
    console.log('requestOption.status: ', requestOption.status)
    if (!requestOption.page) {
      requestOption.page = 1
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 20
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: requestOption.searchTerm,
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        date: requestOption.date ? requestOption.date.toString() : '',
        status: requestOption.status.toString(),
        valuerId: requestOption.valuerId.toString(),
        officeId: requestOption.officeId.toString(),
      },
    })
    return options
  }
}
