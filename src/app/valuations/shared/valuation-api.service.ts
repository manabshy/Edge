import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import {
  Valuation,
  ValuationRequestOption,
  ValuationPropertyInfo,
  Valuer,
  ValuersAvailabilityOption,
  CalendarAvailibility,
  CancelValuation,
  ValuationStatusEnum,
  valuationNote
} from './valuation'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { map, tap } from 'rxjs/operators'
import { Instruction } from 'src/app/shared/models/instruction'
import { ValuationApiHelperService } from './valuation-api-helper.service'

@Injectable({
  providedIn: 'root'
})
export class ValuationApiService {

    constructor(private http: HttpClient, private helperSvc: ValuationApiHelperService) {}

  getValuations(request: ValuationRequestOption): Observable<Valuation[] | any> {
    console.log('request for valuations query: ', request)
    const options = this.helperSvc.setQueryParams(request)
    const url = `${AppConstants.baseValuationUrl}/search`
    return this.http
      .get<any>(url, { params: options })
      .pipe(
        map((response) => response.result)
        // tap((data) => console.log("valuations", JSON.stringify(data)))
      )
  }

  getValuationById(valuationId: number): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationId}`
    return this.http.get<any>(url).pipe(
      map((response) => {
        const valuationObj = {
          ...response.result,
          valuationStatusDescription: ValuationStatusEnum[response.result.valuationStatus]
        }
        return valuationObj
      })
    )
  }

  public getValuationNote(valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationEventId}/note`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(map((response) => response.result))
  }

  public getValuationSuggestions(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/suggestions?SearchTerm=${searchTerm}`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(map((response) => response.result))
  }

  public getToBLink(valuationId: number): Observable<any> {
    const url = `${AppConstants.esignUrl}/signatureLinks/${valuationId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }
  
  public resendToBLink(valuationId: number): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationId}/tobreminder`
    return this.http.post<any>(url, {}).pipe(map((response) => response.result))
  }

  createValuationESign(eSignTypeId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationEventId}/esign/${eSignTypeId}`
    return this.http.post<any>(url, eSignTypeId).pipe(
      map((response) => response.result),
      tap((data) => console.log('eSign triggered'))
    )
  }

  addValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}`
    return this.http.post<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation', JSON.stringify(data)))
    )
  }

  cancelValuation(cancelVm: CancelValuation): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${cancelVm.valuationEventId}/cancel`
    return this.http.put<any>(url, cancelVm).pipe(
      map((response) => response.result),
      tap((data) => console.log('cancel valuation', JSON.stringify(data)))
    )
  }

  passComplianceChecksForValution(valuationEventId: Number, payload: any): Observable<any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationEventId}/compliance`
    return this.http.put<any>(url, payload).pipe(map((response) => response.result))
  }

  updateValuation(valuation: Valuation): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuation.valuationEventId}`
    return this.http.put<any>(url, valuation).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation', JSON.stringify(data)))
    )
  }

  saveValuationNote(valuationNote: valuationNote): Observable<Valuation | any> {
    const url = `${AppConstants.baseValuationUrl}/${valuationNote.valuationEventId}/note`
    return this.http.post<any>(url, valuationNote).pipe(
      map((response) => response.result),
      tap((data) => console.log('added valuation note', JSON.stringify(data)))
    )
  }

  getValuationPropertyInfo(propertyId: number): Observable<ValuationPropertyInfo | any> {
    const url = `${AppConstants.baseValuationUrl}/propertyInfo/${propertyId}`
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
      tap()
    )
  }

  getValuers(propertyId: number): Observable<Valuer[] | any> {
    const url = `${AppConstants.baseValuationUrl}/valuers?propertyId=${propertyId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getValuersAvailability(availability: ValuersAvailabilityOption): Observable<CalendarAvailibility | any> {
    const options = this.helperSvc.setAvailabilityQueryParams(availability)
    const url = `${AppConstants.baseValuationUrl}/valuers/availability`
    return this.http
      .get<any>(url, { params: options })
      .pipe(
        map((response) => response.result),
        tap((data) => console.log('availability', JSON.stringify(data)))
      )
  }

  // Extract to instruction service
  addInstruction(instruction: Instruction): Observable<Instruction | any> {
    const url = `${AppConstants.baseValuationUrl}/${instruction.valuationEventId}/instruct`
    return this.http.post<any>(url, instruction).pipe(
      map((response) => response),
      tap((data) => console.log('added instruction', JSON.stringify(data)))
    )
  }
}
