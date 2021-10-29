import { Injectable, Injector } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
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
import { map, tap } from 'rxjs/operators'
import { Instruction } from 'src/app/shared/models/instruction'
import { ValuationApiService } from './valuation-api.service'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { FileService } from 'src/app/core/services/file.service'
import { PeopleService } from 'src/app/core/services/people.service'
import { Router } from '@angular/router'
import { CompanyService } from 'src/app/company/shared/company.service'
import { ContactGroup } from 'src/app/contact-groups/shared/contact-group'
/***
 * ValuationFacadeService
 * @description this service encapsulates all component interactions required for valuations and acts as an interface to other services and stores
 */
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

  public readonly _valuation: BehaviorSubject<Valuation | any> = new BehaviorSubject({})
  public readonly valuation$: Observable<Valuation | any> = this._valuation.asObservable()

  private readonly _valuationPricingInfo: BehaviorSubject<ValuationPricingInfo> = new BehaviorSubject({})
  public readonly valuationPricingInfo$ = this._valuationPricingInfo.asObservable()

  constructor(
    private _apiSvc: ValuationApiService,
    private readonly _fileSvc: FileService,
    private _peopleSvc: PeopleService,
    private _companySvc: CompanyService,
    private _contactGroupsSvc: ContactGroupsService,
    private _router: Router
  ) {}

  // CONTACT CARD / OWNER

  // VALUATION TICKET TAB

  public getValuationById(valuationId: number): Observable<Valuation | any> {
    return this._apiSvc.getValuationById(valuationId).pipe(
      tap((valuationObj) => {
        console.log('👷 getValuation: ', valuationObj)
        this._valuation.next(valuationObj)
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
  public getPotentialDuplicatePeople = this._contactGroupsSvc.getPotentialDuplicatePeople

  public navigateToNewPersonScreen = (newPerson) => {
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
  public newCompanyChanges$ = this._companySvc.newCompanyChanges$

  /**
   * contact group service interface
   */
  public getContactGroupById = this._contactGroupsSvc.getContactGroupById
  public newPerson$ = this._contactGroupsSvc.newPerson$

  /**
   * @function passComplianceChecksForValution
   * @description passes compliance checks for a valuation
   */
  public passComplianceChecksForValution(payload: any): Observable<any> {
    return this.valuation$.pipe(
      map((valuation) => {
        return this._apiSvc.passComplianceChecksForValution(valuation.id, payload)
      })
    )
  }

  /***
   * People docs: For personal compliance checks
   */
  public getAllPersonDocs = this._peopleSvc.getAllPersonDocs
  public getPeopleDocsForValuation = this._peopleSvc.getPeopleDocsForValuation

  /**
   * entitiesToSave,
   * contactGroupId,
   */
  /***
   * @function freezePeopleDocsForValuation
   * @param {object[]} entities - entities array from the store
   * @description 🥶 freezes documents for all people (entities) for a valuation
   * @returns TODO
   */
  public freezePeopleDocsForValuation = (entities, contactGroupId) => {
    return this.valuation$.pipe(
      map((valuationData) => {
        console.log(
          '🥶 freezing docs for ' + JSON.stringify(entities) + ' contactGroupId ' + contactGroupId + ' id ',
          valuationData.id
        )
        return this._peopleSvc.freezePeopleDocsForValuation(entities, contactGroupId, valuationData.id)
      })
    )
  }
  public unfreezePersonDocuments = this._peopleSvc.unfreezePeopleDocsForValuation

  /***
   * Company people docs: For company compliance checks
   */
  public getAllDocsForCompany = this._companySvc.getAllDocsForCompany
  public getCompanyDocsForValuation = this._companySvc.getCompanyDocsForValuation

  /***
   * @function freezeCompanyDocsForValuation
   * @param {object[]} entities - entities array from the store
   * @description 🥶 freezes documents for all companies and associated people (entities) for a valuation
   * @returns TODO
   */
  public freezeCompanyDocsForValuation = (entities, contactGroupId) => {
    return this.valuation$.pipe(
      map((valuationData) => {
        console.log(
          '🥶 freezing docs for ' + JSON.stringify(entities) + ' contactGroupId ' + contactGroupId + ' id ',
          valuationData.id
        )
        return this._companySvc.setCompanyDocsForValuation(entities, contactGroupId, valuationData.id)
      })
    )
  }
  public unfreezeCompanyDocuments = this._companySvc.deleteCompanyDocsForValuation

  /***
   * updateCompanyDocuments
   * @description updates the documents for the current valuation in the service and pushes out a new valuation value to subscribers
   */
  public updateCompanyDocuments(companyDocuments) {
    const existingValuation = this._valuation.getValue() // TODO don't use get value!
    this._valuation.next({ ...existingValuation, companyDocuments })
  }

  public saveFileTemp = this._fileSvc.saveFileTemp

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

  public addValuation(valuation: Valuation): Observable<Valuation | any> {
    return this._apiSvc.addValuation(valuation)
  }

  public cancelValuation(valuationToCancel: CancelValuation): Observable<any> {
    return this._apiSvc.cancelValuation(valuationToCancel)
  }

  public updateValuation(valuation: Valuation): Observable<Valuation | any> {
    return this._apiSvc.updateValuation(valuation)
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

  // behaviour subjects
  public updatePersonDocuments(personDocuments) {
    const existingValuation = this._valuation.getValue()
    this._valuation.next({ ...existingValuation, personDocuments })
  }
}
