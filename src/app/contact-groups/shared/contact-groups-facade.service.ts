// contact-groups-facade.service.ts
/***
 * @module ContactGroupsFacadeService
 * @description this service encapsulates all component interactions required for contact groups and acts as an interface to other services and stores
 * CURRENTLY WIP and not implemented anywhere. Focus is to get release of 4.0.0 into production.
 */

import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { mergeMap, take } from 'rxjs/operators'
import { SharedService } from 'src/app/core/services/shared.service'
import { AppUtils } from 'src/app/core/shared/utils'
import { Person } from 'src/app/shared/models/person'
import {
  ContactGroup,
  PeopleAutoCompleteResult,
  ContactGroupsTypes,
  ContactType,
  CompanyAutoCompleteResult,
  Company,
  PotentialDuplicateResult,
  ContactNote
} from './contact-group.interfaces'
import { ContactGroupsService } from './contact-groups.service'

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsFacadeService {
  
  private contactPeopleTempStore = []
  private companyTempStore
  private _contactGroupDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public contactGroupDetails$: Observable<any> = this._contactGroupDetails.asObservable()
  
  private _companyDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public companyDetails$: Observable<any> = this._companyDetails.asObservable()
  
  private firstContactGroupPerson
  private contactGroupDetails = {} as ContactGroup

  constructor(private contactGroupService: ContactGroupsService, private sharedService: SharedService) {}

  public getContactGroupsPeoplePageVm$(
    personId?: number,
    contactGroupId?: number,
    existingCompanyId?: number
  ): Observable<any> {
    console.log('initContactGroupsPeoplePage: ', personId, contactGroupId)

    return combineLatest([
      this.loadOrCreateContactGroupData(personId, contactGroupId),
      this.loadOrCreateCompanyData(existingCompanyId)
    ]).pipe(
      mergeMap(([contactGroupData, companyDetails]) => {
        return of({
          contactGroupData,
          companyDetails
        })
      })
    )
  }

  private loadOrCreateCompanyData(companyId) {
    console.log('loadCompanyData for company with id: ', companyId)

    if (companyId) {
      return this.contactGroupService.getCompany(companyId)
    } else {
      return of(null)
    }
  }

  public storeContactPeople(contactPeople): void {
    console.log('storeContactPeople: ', contactPeople)
    this.contactPeopleTempStore = contactPeople
  }

  public storeNewCompany(company) {
    this.companyTempStore = company
  }

  getContactPeopleFromStorage() {
    // const data = localStorage.getItem('contactPeople')
    // let people = []
    // people = JSON.parse(data) as Person[]
    return this.contactPeopleTempStore
  }

  loadOrCreateContactGroupData(personId: number, contactGroupId?: number) {
    console.log('loadOrCreateContactGroup: ', personId)

    if (contactGroupId) {
      return this.contactGroupService.getContactGroupById(contactGroupId)
    } else {
      return this.createNewContactGroup()
    }
  }

  getContactGroupById(contactGroupId: number) {
    const contactPeople = this.getContactPeopleFromStorage()
    this.contactGroupService.getContactGroupById(contactGroupId, true).subscribe((data) => {
      this._contactGroupDetails.next(data)
      console.log('contactGroupDetails: ', data)
      //   this.contactGroupDetails = data
      //   if (contactPeople?.length) {
      // this.pendingChanges = true
      // this.contactGroupDetails.contactPeople = [...contactPeople]
      // console.log(
      //   this.contactGroupDetails.contactPeople,
      //   'new group from merged with stroage',
      //   contactPeople,
      //   'from storage'
      // )
      //   }
      //   this.setImportantNotes()
      //   this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length

      //   this.populateFormDetails(this.contactGroupDetails)
      //   this.setSalutation()
      // this.addSelectedPeople();
      //   if (this.isCloned) {
      //     this.contactGroupDetails.referenceCount = 0
      //     this.contactGroupDetails.contactGroupId = 0
      //   }
      //   this.isTypePicked = true

      //   this.setPageLabel()
    })
  }

  public showPersonWarning(contactPeople, warnings) {
    contactPeople.forEach((x) => {
      x.warning = this.sharedService.showWarning(x.warningStatusId | 1, warnings, x.warningStatusComment)
    })
  }

  private createNewContactGroup() {
    console.log('theres no contactGroupId yet, creating a new one...')

    // CONTACT GROUP
    const contactGroupDetails = {} as ContactGroup
    contactGroupDetails.contactPeople = this.getContactPeopleFromStorage() || []
    this._contactGroupDetails.next(contactGroupDetails)

    return this.contactGroupDetails$
    //   .pipe
      //   take(1),
      //   mergeMap((contactGroupData) => {
      //     console.log('contactGroupData: ', contactGroupData)

      //     return of({

      //       contactGroup: contactGroupData
      //     })
      //   })
    //   ()

    //     // this.contactGroupDetails = {} as ContactGroup;
    //     contactGroupDetails.contactPeople = [...contactPeople]
    //     vm.showDuplicateChecker = false
    //     // this.setSalutation()
    //   }
    //   this.contactGroupDetails.contactType = AppUtils.holdingContactType || ContactType.Individual
    //   if (this.isNewCompanyContact && this.isExistingCompany) {
    //     this.isTypePicked = true
    //     this.contactGroupDetails.contactType = ContactType.CompanyContact
    //     this.getCompanyDetails(this.existingCompanyId)
    //   }
    //   if (this.isNewCompanyContact) {
    //     const newCompany = JSON.parse(localStorage.getItem('newCompany')) as Company
    //     this.isTypePicked = true
    //     this.contactGroupDetails.contactType = ContactType.CompanyContact
    //     if (newCompany) {
    //       this.companyDetails = newCompany
    //     }
    //   }
    //   if (AppUtils.holdingContactType === ContactType.CompanyContact) {
    //     this.isNewCompanyContact = true
    //   }
    //   AppUtils.holdingContactType = null
    //   this.addSelectedPeople()
  }

  getCompanyDetails(companyId: number) {
    this.contactGroupService.getCompany(companyId).subscribe((data) => {
      this._companyDetails.next(data)

      //   this.companyDetails = data
      // console.log(this.companyDetails, 'company details')
      //   this.isSearchCompanyVisible = false
      //   this.showSetMainPerson = false
    })
  }
}
