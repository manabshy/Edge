// valuation-facade.service.ts
/***
 * @module ValuationFacadeService
 * @description this service encapsulates all component interactions required for valuations and acts as an interface to other services and stores
 */

import { Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, map, mergeMap, take, tap } from 'rxjs/operators'
import {
  Valuation,
  ValuationRequestOption,
  ValuationPropertyInfo,
  Valuer,
  ValuersAvailabilityOption,
  CalendarAvailibility,
  CancelValuation,
  valuationNote,
  ValuationPricingInfo
} from './valuation'
import { Instruction } from 'src/app/shared/models/instruction'
import { ValuationApiService } from './valuation-api.service'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { FileService } from 'src/app/core/services/file.service'
import { PeopleService } from 'src/app/core/services/people.service'
import { CompanyService } from 'src/app/company/shared/company.service'
import { ContactGroup } from 'src/app/contact-groups/shared/contact-group'
import { InfoService } from 'src/app/core/services/info.service'

@Injectable({
  providedIn: 'root'
})
export class ValuationFacadeService {
  private valuationPageNumberSubject = new Subject<number>()
  valuationPageNumberChanges$ = this.valuationPageNumberSubject.asObservable()

  contactGroupBs = new BehaviorSubject(null)
  public readonly contactGroup$: Observable<ContactGroup> = this.contactGroupBs.asObservable()

  valuationValidationSubject = new Subject<boolean>()
  valuationValidation$ = this.valuationValidationSubject.asObservable()

  validationControlBs = new BehaviorSubject(false)
  landRegisterValid = new BehaviorSubject(false)
  doValuationSearchBs = new BehaviorSubject(false)

  public readonly _valuationData: BehaviorSubject<Valuation | any> = new BehaviorSubject({})
  public readonly valuationData$: Observable<Valuation | any> = this._valuationData.asObservable()

  private readonly _valuationPricingInfo: BehaviorSubject<ValuationPricingInfo> = new BehaviorSubject({})
  public readonly valuationPricingInfo$ = this._valuationPricingInfo.asObservable()

  private _infoService: InfoService
  public get infoService(): InfoService {
    if (!this._infoService) {
      this._infoService = this.injector.get(InfoService)
    }
    return this._infoService
  }

  constructor(
    private _apiSvc: ValuationApiService,
    private readonly _fileSvc: FileService,
    private _peopleSvc: PeopleService,
    private _companySvc: CompanyService,
    private _contactGroupsSvc: ContactGroupsService,
    private _router: Router,
    private injector: Injector
  ) {
    // console.log(' FACADE SERVICE INSTANTIATING =========== ')
  }

  getDropDownInfo() {
    return this.infoService.getDropdownListInfo()
  }
  // CONTACT CARD / OWNER

  // VALUATION TICKET TAB

  public getValuationById(valuationId: number): Observable<Valuation | any> {
    return this._apiSvc.getValuationById(valuationId).pipe(
      tap((valuationObj) => {
        // console.log('👷👷👷 calling _valuationData.next in valuation service: ', valuationObj)
        this._valuationData.next(valuationObj)
      })
    )
  }

  public getValuationNote(valuationEventId: number): Observable<any> {
    return this._apiSvc.getValuationNote(valuationEventId)
  }

  public getToBLink(valuationId: number): Observable<any> {
    return this._apiSvc.getToBLink(valuationId)
  }

  public createValuationESign(eSignTypeId: number, valuationEventId: number): Observable<any> {
    return this._apiSvc.createValuationESign(eSignTypeId, valuationEventId)
  }

  // NOTES TAB

  // STATUS TRAFFIC LIGHTS

  // PROPERTY INFO CARD

  // VALUATION NOTES CARD

  // PROPERTY INFO CARD

  // APPOINTMENT CARD

  // VALUES CARD

  // TERMS OF BUSINESS CARD

  // LAND REGISTRY CARD

  // COMPLIANCE CHECKS CARD FUNCTIONS

  public navigateToNewPersonScreen(newPerson) {
    this._router.navigate(['/contact-centre/detail/0/edit'], {
      queryParams: {
        showDuplicateChecker: false,
        backToOrigin: true,
        isNewPersonalContact: true,
        newPerson: JSON.stringify(newPerson),
        emailPhoneRequired: false
      }
    })
  }

  public newPersonAdded$: Observable<any> = this._contactGroupsSvc.newPerson$
  public newCompanyAdded$: Observable<any> = this._companySvc.newCompanyChanges$
  public newCompanyChanges$: Observable<any> = this._companySvc.newCompanyChanges$

  /**
   * contact group service interface
   */
  public getContactGroupById(contactGroupId) {
    return this._contactGroupsSvc.getContactGroupById(contactGroupId).pipe(
      tap((contactGroupData) => {
        this.contactGroupBs.next(contactGroupData)
      })
    )
  }
  public newPerson$ = this._contactGroupsSvc.newPerson$

  /**
   * @function passComplianceChecksForValution
   * @description passes compliance checks for a valuationData
   */
  public passComplianceChecksForValution(payload: any): Observable<any> {
    let valuationEventIdClosure
    return this.valuationData$.pipe(
      mergeMap((valuationData) => {
        // console.log('passComplianceChecksForValuation: ', valuationData)
        valuationEventIdClosure = valuationData.valuationEventId
        if (payload.companyOrContact === 'contact') {
          return this._peopleSvc.freezePeopleDocsForValuation(
            payload.savePayload.personDocuments,
            payload.contactGroupId,
            valuationData.valuationEventId
          )
        } else {
          return this._companySvc.setCompanyDocsForValuation(
            payload.savePayload,
            payload.contactGroupId,
            valuationData.valuationEventId
          )
        }
      }),
      mergeMap((res) => {
        return this._apiSvc.passComplianceChecksForValution(valuationEventIdClosure, {
          customPassedDate: new Date(),
          isPassed: true
        })
      })
    )
  }

  /***
   * People docs: For personal compliance checks
   */
  public getAllPersonDocs(personId: number) {
    return this._peopleSvc.getAllPersonDocs(personId)
  }

  public getPeopleDocsForValuation(contactGroupId: number, valuationEventId: number) {
    return this._peopleSvc.getPeopleDocsForValuation(contactGroupId, valuationEventId)
  }

  /***
   * @function updatePersonDocuments
   * @param personDocuments {object[]} - array of entities and their docs ready to save to API
   * @description emits and updated value for the valuationData in the store having updated the personDocuments array in the valuationData
   **/
  public updatePersonDocuments(personDocuments) {
    // console.log('🏃🏃🏃🏃 updatePersonDocuments running', personDocuments)
    return this.valuationData$.pipe(
      take(1),
      map((valuationData) => {
        console.log('🏆 updatePersonDocuments: this._valuationData.next ', valuationData)
        this._valuationData.next({ ...valuationData, personDocuments })
      })
    )
  }

  /***
   * updateCompanyAndPersonDocuments
   * @description updates the company and person documents for the current valuationData in the service and pushes out a new valuationData value to subscribers
   */
  public updateCompanyAndPersonDocuments(savePayload) {
    // console.log('🏃🏃🏃🏃 updateCompanyDocuments running', savePayload)
    return this.valuationData$.pipe(
      take(1),
      map((valuationData) => {
        // console.log('🏆 updateCompanyDocuments: this._valuationData.next ', valuationData)
        const updatedValuationData = {
          ...valuationData,
          companyDocuments: savePayload.companyDocuments,
          personDocuments: savePayload.personDocuments
        }
        // console.log('setting valuation data to : ', updatedValuationData)
        this._valuationData.next(updatedValuationData)
      })
    )
  }

  public unfreezePeopleDocsForValuation = (contactGroupId: number, valuationEventId: number) => {
    return this._peopleSvc.unfreezePeopleDocsForValuation(contactGroupId, valuationEventId)
  }

  /***
   * Company people docs: For company compliance checks
   */
  public getAllDocsForCompany = (companyId: number) => {
    return this._companySvc.getAllDocsForCompany(companyId)
  }

  public getCompanyDocsForValuation = (contactGroupId, valuationEventId) => {
    return this._companySvc.getCompanyDocsForValuation(contactGroupId, valuationEventId)
  }

  public unfreezeCompanyDocsForValuation = (contactGroupId: number, valuationEventId: number) => {
    return this._companySvc.deleteCompanyDocsForValuation(contactGroupId, valuationEventId)
  }

  public saveFileTemp = (tmpFiles) => {
    return this._fileSvc.saveFileTemp(tmpFiles)
  }

  // END COMPLIANCE CHECKS FUNCTIONS

  // GENERAL API FUNCTIONS
  public getValuations(request: ValuationRequestOption): Observable<Valuation[] | any> {
    return this._apiSvc.getValuations(request)
  }

  public getValuationSuggestions(searchTerm: string): Observable<any> {
    return this._apiSvc.getValuationSuggestions(searchTerm)
  }

  public valuationPageNumberChanged(nextPage: number) {
    this.valuationPageNumberSubject.next(nextPage)
  }

  public addValuation(valuationData: Valuation): Observable<Valuation | any> {
    return this._apiSvc.addValuation(valuationData)
  }

  public cancelValuation(valuationToCancel: CancelValuation): Observable<any> {
    return this._apiSvc.cancelValuation(valuationToCancel)
  }

  public updateValuation(valuationData: Valuation): Observable<Valuation | any> {
    return this._apiSvc.updateValuation(valuationData)
  }

  public saveValuationNote(valuationNote: valuationNote): Observable<Valuation | any> {
    return this._apiSvc.saveValuationNote(valuationNote)
  }

  public getValuationPropertyInfo(propertyId: number): Observable<ValuationPropertyInfo | any> {
    return this._apiSvc.getValuationPropertyInfo(propertyId)
  }

  public getValuers(propertyId: number): Observable<Valuer[] | any> {
    return this._apiSvc.getValuers(propertyId)
  }

  public getValuersAvailability(availability: ValuersAvailabilityOption): Observable<CalendarAvailibility | any> {
    return this._apiSvc.getValuersAvailability(availability)
  }

  // Extract to instruction service
  public addInstruction(instruction: Instruction): Observable<Instruction | any> {
    return this._apiSvc.addInstruction(instruction)
  }

  public getPotentialDuplicatePeople = (person) => {
    return this._contactGroupsSvc.getPotentialDuplicatePeople(person)
  }
}
