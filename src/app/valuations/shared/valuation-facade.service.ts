// valuation-facade.service.ts
/***
 * @module ValuationFacadeService
 * @description this service encapsulates all component interactions required for valuations and acts as an interface to other services and stores
 */

import { Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, Subject, of } from 'rxjs'
import { filter, mergeMap, take, tap } from 'rxjs/operators'
import {
  Valuation,
  ValuationRequestOption,
  ValuationPropertyInfo,
  Valuer,
  ValuersAvailabilityOption,
  CalendarAvailibility,
  CancelValuation,
  valuationNote,
  ValuationPricingInfo,
  ValuationTypeEnum
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

  _contactGroupBs = new BehaviorSubject(null)
  public readonly contactGroup$: Observable<ContactGroup> = this._contactGroupBs.asObservable()

  valuationValidationSubject = new Subject<boolean>()
  valuationValidation$ = this.valuationValidationSubject.asObservable()

  validationControlBs = new BehaviorSubject(false)
  landRegisterValid = new BehaviorSubject(false)
  doValuationSearchBs = new BehaviorSubject(false)

  public readonly _valuationData: BehaviorSubject<Valuation | any> = new BehaviorSubject({})
  public readonly valuationData$: Observable<Valuation | any> = this._valuationData.asObservable()

  private readonly _valuationPricingInfo: BehaviorSubject<ValuationPricingInfo> = new BehaviorSubject({})
  public readonly valuationPricingInfo$ = this._valuationPricingInfo.asObservable()

  public readonly onLastKnownOwnerChanged$ = this.contactGroup$.pipe(
    filter((contactGroup) => {
      // console.log('contactGroup has changed. inside filter function ', contactGroup)
      const valuationData = this._valuationData.getValue()
      // console.log('valuationData: ', valuationData)
      if (!!contactGroup && contactGroup.contactGroupId && valuationData) {
        return contactGroup.contactGroupId !== valuationData.propertyOwner.contactGroupId
      }
      return false
    }),
    mergeMap((contactGroup) => {
      // call documents endpoint
      // every time contactGroupId changes, get the compliance docs for the people in that contact group
      console.log('onLastKnownOwnerChanged: contactGroup', contactGroup)
      return this.getPeopleDocsForValuation(
        contactGroup.contactGroupId,
        this._valuationData.getValue().valuationEventId
      )
    }),
    mergeMap((personDocuments) => {
      console.log('person documents are about to be updated in local model: ', personDocuments)
      return of(this.updateLocalValuation({ personDocuments }))
    }),
    mergeMap((data) => {
      console.log('data: ', data)
      return of({
        contactGroupData: this._contactGroupBs.getValue(),
        valuationData:data
      })
    })
  )

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

  /**
   * updateLocalValuation
   * @description merges incoming data object into service level model and emits updated valuation object to subscribers
   * @param data {} - containing the properties to update
   */
  public updateLocalValuation(data) {
    // console.log('updateLocalValuation: ', data)
    const valuationData = this._valuationData.getValue()
    const updatedValuationData = { ...valuationData, ...data }
    this._valuationData.next(updatedValuationData)
    return updatedValuationData
  }

  public updateLocalContactGroup(data) {
    this._contactGroupBs.next(data)
  }

  getDropDownInfo() {
    return this.infoService.getDropdownListInfo()
  }

  // CONTACT CARD / OWNER
  private _isPowerOfAttorneyChanged: BehaviorSubject<any> = new BehaviorSubject({})
  public isPowerOfAttorneyChanged$: Observable<any> = this._isPowerOfAttorneyChanged.asObservable()

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
  public termsOfBusinessFileUploaded(data) {
    // console.log('WIP: termsOfBusinessFileUploaded: ', data)

    return this.saveFileTemp(data.file)
      .pipe(
        take(1),
        tap((res) => {
          try {
            // console.log('upload ToB file res: ', res)
            const valuationData = this._valuationData.getValue()

            let eSignSignatureTob = {
              toBLetting: {},
              toBSale: {},
              ...valuationData.eSignSignatureTob
            }

            if (valuationData.valuationType === ValuationTypeEnum.Lettings) {
              console.log('LETTINGS TOB set: ')
              eSignSignatureTob.toBLetting = { ...data.model, signatureFile: res.files[0], signedOn: new Date() }
            } else if (valuationData.valuationType === ValuationTypeEnum.Sales) {
              console.log('SALES TOB set: ', data.model)

              eSignSignatureTob.toBSale = {
                instructionPriceDirection: data.model.instructionPriceDirection,
                salesAgencyTypeId: data.model.salesAgencyTypeId,
                signatureFile: res.files[0],
                signedOn: new Date()
              }
            }
            this.updateLocalValuation({ eSignSignatureTob })
            return 'that worked'
          } catch (e) {
            console.log('tap error: ', e)
          }
        })
      )
      .subscribe(
        (res) => {
          console.log('subscribe: ', res)
        },
        (err) => console.error
      )
  }

  /***
   * @description pings the send terms of business API endpoint
   */
  public sendTermsOfBusinessReminder() {
    let valuationDataClosure
    return this.valuationData$
      .pipe(
        take(1),
        mergeMap((valuationData) => {
          valuationDataClosure = valuationData
          return this._apiSvc.resendToBLink(valuationData.valuationEventId)
        }),
        tap((res): any => {
          const updatedToBDoc = valuationDataClosure.eSignSignatureTob ? valuationDataClosure.eSignSignatureTob : {}
          updatedToBDoc.dateRequestSent = new Date()
          this.updateLocalValuation({ eSignSignatureTob: updatedToBDoc })
        })
      )
      .subscribe((res) => {
        console.log('resend tob done.')
      })
  }

  // LAND REGISTRY CARD

  // COMPLIANCE CHECKS CARD FUNCTIONS

  public navigateToNewPersonScreen(newPerson) {
    this._router.navigate(['/contact-centre/detail/0/edit'], {
      queryParams: {
        showDuplicateChecker: false,
        backToOrigin: true,
        isNewPersonalContact: true,
        newPerson: JSON.stringify(newPerson),
        emailPhoneRequired: false,
        addNewEntityToComplianceChecks: true
      }
    })
  }

  public navigateToNewCompanyScreen(newCompany) {
    this._router.navigate(['/company-centre/detail/0/edit'], {
      queryParams: {
        isNewCompany: true,
        companyName: newCompany.companyName,
        backToOrigin: true,
        addNewEntityToComplianceChecks: true
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
        this.updateLocalContactGroup(contactGroupData)
      })
    )
  }

  /**
   * @function passComplianceChecksForValution
   * @description passes compliance checks for a valuationData
   */
  public passComplianceChecksForValution(payload: any): Observable<any> {
    let valuationEventIdClosure
    return this.valuationData$.pipe(
      take(1),
      mergeMap((valuationData) => {
        valuationEventIdClosure = valuationData.valuationEventId
        if (payload.companyOrContact === 'contact') {
          return this._peopleSvc.freezePeopleDocsForValuation(
            payload.savePayload.personDocuments,
            payload.contactGroupId,
            valuationData.valuationEventId
          )
        } else {
          return this._companySvc.freezeCompanyDocsForValuation(
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
      }),
      tap((res) => {
        this.updateLocalValuation({
          complianceCheck: {
            compliancePassedBy: res.compliancePassedByFullName,
            compliancePassedDate: res.compliancePassedDate
          }
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

  public togglePowerOfAttorney(adminContact) {
    if (!adminContact.isPowerOfAttorney) {
      this.getAllPersonDocs(adminContact.id).subscribe((data) => {
        this._isPowerOfAttorneyChanged.next({ action: 'add', admin: data })
      })
    } else {
      this._isPowerOfAttorneyChanged.next({ action: 'remove', id: adminContact.id })
    }
  }

  /**
   *
   * @param valuationData
   * @returns response from API as a stream
   */
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

  // public getValuersAvailability(availability: ValuersAvailabilityOption): Observable<CalendarAvailibility | any> {
  //   return this._apiSvc.getValuersAvailability(availability)
  // }

  public getValuersCalendarAvailability(
    availability: ValuersAvailabilityOption
  ): Observable<CalendarAvailibility | any> {
    return this._apiSvc.getValuersCalendarAvailability(availability)
  }

  // Extract to instruction service
  public addInstruction(instruction: Instruction): Observable<Instruction | any> {
    return this._apiSvc.addInstruction(instruction)
  }

  public getPotentialDuplicatePeople = (person) => {
    return this._contactGroupsSvc.getPotentialDuplicatePeople(person)
  }
}
