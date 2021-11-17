import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { StorageMap } from '@ngx-pwa/local-storage'
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ContactGroup, ContactNote, Signer } from 'src/app/contact-groups/shared/contact-group'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service'
import { SharedService } from 'src/app/core/services/shared.service'
import { Person, Referral } from '../../models/person'
import { ResultData } from '../../result-data'

@Component({
  selector: 'app-contact-group-card',
  templateUrl: './contact-group-card.component.html'
})
export class ContactGroupCardComponent implements OnInit, OnChanges {
  private _contactGroup: ContactGroup
  set contactGroup(value) {
    if (this._contactGroup != value) {
      this._contactGroup = value
      if (value && value.contactGroupId > 0) {
        if (value.contactPeople.findIndex((contactPeople) => contactPeople.isAdminContact) > -1) {
          let headerPerson = value.contactPeople.find(
            (contactPeople) => contactPeople.isMainPerson && !contactPeople.isAdminContact
          )
          if (headerPerson) this.contactHeader = headerPerson?.addressee
        } else this.contactHeader = value.addressee
      }
    }
  }
  @Input() get contactGroup() {
    return this._contactGroup
  }

  @Input() showEmailModal = false
  @Input() showValuationActions = true
  @Input() adminContact: Signer
  @Output() onPowerOfAttorneyChange: EventEmitter<any> = new EventEmitter()

  contactReferrals: Referral[] = []
  referralCompanies: InfoDetail[]
  selectedReferralCompany: Referral
  showRefDialog = false

  numOfPeople: number
  showAdditionalPeople = false
  firstPerson: Person
  importantNotes$: Observable<ContactNote[]>
  filteredItems: MenuItem[]
  items: MenuItem[]
  contactHeader: string

  constructor(
    private contactGroupService: ContactGroupsService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private storage: StorageMap,
    private sharedService: SharedService,
    private infoService: InfoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true
    this.items = [
      {
        id: 'editContact',
        label: 'Edit Contact',
        icon: 'pi pi-pencil',
        command: () => {
          this.router.navigate(['/contact-centre/detail/0/people/', this.contactGroup?.contactGroupId])
        }
      }
      // {
      //   id: 'removeAdmin',
      //   label: 'Remove Admin Contact',
      //   icon: 'pi pi-minus',
      //   command: () => {
      //     this.sharedService.removeContactGroupChanged.next(true);
      //   },
      // },
      // {
      //   id: 'salesTermsOfBusiness',
      //   label: 'Sales Terms of Business',
      //   icon: 'pi pi-file-pdf',
      //   command: () => {
      //     this.sharedService.eSignTriggerChanged.next(eSignTypes.Sales_Terms_Of_Business);
      //   },
      // },
      // {
      //   id: 'lettingsTermsOfBusiness',
      //   label: 'Lettings Terms of Business',
      //   icon: 'pi pi-file-pdf',
      //   command: () => {
      //     this.sharedService.eSignTriggerChanged.next(eSignTypes.Lettings_Terms_Of_Business);
      //   },
      // },
      // {
      //   id: 'landLordQuestionnaire',
      //   label: 'Land Lord Questionnaire',
      //   icon: 'pi pi-file-pdf',
      //   command: () => {
      //     this.sharedService.eSignTriggerChanged.next(eSignTypes.Property_Questionnaire);
      //   },
      // },
      // {
      //   id: 'vendorQuestionnaire',
      //   label: 'Vendor Questionnaire',
      //   icon: 'pi pi-file-pdf',
      //   command: () => {
      //     this.sharedService.eSignTriggerChanged.next(eSignTypes.Sales_Property_Questionnaire);
      //   },
      // },
      // {
      //   id: 'cancelValuation',
      //   label: 'Cancel Valuation',
      //   icon: 'pi pi-ban',
      //   command: () => {
      //     this.sharedService.cancelValuationOperationChanged.next(true);
      //   },
      // },
    ]

    this.getInfo()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("contact groups in the card", this.contactGroup);

    this.numOfPeople = this.contactGroup?.contactPeople?.length
    this.numOfPeople > 1 ? (this.showAdditionalPeople = true) : (this.showAdditionalPeople = false)
    this.firstPerson = this.contactGroup?.contactPeople[0]
    if (this.firstPerson?.personId) {
      this.getPersonNotes(this.firstPerson?.personId)
    }
  }

  getInfo() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.referralCompanies = data.referralCompanies
      } else {
        this.infoService.getDropdownListInfo().subscribe((info: DropdownListInfo) => {
          if (info) {
            this.referralCompanies = info.referralCompanies
          }
        })
      }
      this.setReferralCompanies()
    })
  }

  cancelReferral() {
    this.showRefDialog = false
    this.sharedService.setRemoveSticky(this.showRefDialog)
  }

  sendReferral() {
    if (this.firstPerson?.personId && this.selectedReferralCompany?.referralCompanyId) {
      this.contactGroupService
        .createPersonReferral(this.firstPerson, this.selectedReferralCompany.referralCompanyId)
        .subscribe((res: ResultData) => this.onSaveComplete(res.result))
    }
  }

  onSaveComplete(res: Referral[]): void {
    if (res) {
      this.setPersonReferrals(res)
      this.messageService.add({
        severity: 'success',
        summary: 'Referral successfully sent',
        closable: false,
        key: 'referralMessage'
      })
      this.showRefDialog = false
      this.sharedService.setRemoveSticky(this.showRefDialog)
    }
  }

  setPersonReferrals(referrals: Referral[]) {
    if (referrals?.length) {
      referrals.forEach((r) => {
        this.contactReferrals?.forEach((p) => {
          if (r.referralCompanyId === p.referralCompanyId) {
            p.referralDate = r.referralDate
          }
        })
      })
    }
  }

  private setReferralCompanies() {
    const refs = []
    this.referralCompanies?.forEach((x) => {
      const ref: Referral = { referralCompanyId: x.id, referralCompany: x.value, referralDate: null }
      refs.push(ref)
      this.contactReferrals = refs
    })
  }

  startReferral(company: Referral) {
    this.showRefDialog = true
    this.sharedService.setRemoveSticky(this.showRefDialog)
    this.selectedReferralCompany = company
  }

  viewDetails(personId: number) {
    if (personId) {
      const people = this.contactGroup?.contactPeople
      const index = people.findIndex((x) => x.personId === personId)
      const person = people.find((x) => x.personId === personId)
      this.getPersonNotes(person.personId)
      people.splice(index, 1)
      people.unshift(person)
      console.log({ person }, { people })
    }
  }

  getPersonNotes(personId: number) {
    this.importantNotes$ = this.contactGroupService
      .getPersonNotes(personId)
      .pipe(map((x) => x.filter((n) => n.isImportant)))
  }

  isPowerOfAttorneyChange() {
    console.log('isPowerOfAttorneyChange(): ', this.adminContact.isPowerOfAttorney)
    const powerOfA = this.adminContact.isPowerOfAttorney
    this.onPowerOfAttorneyChange.emit(powerOfA)
  }
}
