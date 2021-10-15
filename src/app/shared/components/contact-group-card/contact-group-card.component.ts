import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactGroup, ContactNote, Signer } from 'src/app/contact-groups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service';
import { InfoDetail } from 'src/app/core/services/info.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Person, Referral } from '../../models/person';

@Component({
  selector: 'app-contact-group-card',
  templateUrl: './contact-group-card.component.html',
})
export class ContactGroupCardComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  @Input() showEmailModal = false;
  @Input() showValuationActions = true;
  @Input() adminContact: Signer;
  contactReferrals: Referral[] = [];
  referralCompanies: InfoDetail[];
  selectedReferralCompany: Referral;
  showRefDialog = false;

  numOfPeople: number;
  showAdditionalPeople = false;
  firstPerson: Person;
  importantNotes$: Observable<ContactNote[]>;
  filteredItems: MenuItem[];
  items: MenuItem[];

  constructor(
    private contactGroupService: ContactGroupsService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.items = [
      {
        id: 'editContact',
        label: 'Edit Contact',
        icon: 'pi pi-pencil',
        command: () => {
          this.router.navigate(['/contact-centre/detail/0/people/', this.contactGroup?.contactGroupId]);
        },
      },
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
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("contact groups in the card", this.contactGroup);

    this.numOfPeople = this.contactGroup?.contactPeople?.length;
    this.numOfPeople > 1 ? (this.showAdditionalPeople = true) : (this.showAdditionalPeople = false);
    this.firstPerson = this.contactGroup?.contactPeople[0];
    if (this.firstPerson?.personId) {
      this.getPersonNotes(this.firstPerson?.personId);
    }
  }

  private setReferralCompanies() {
    const refs = [];
    this.referralCompanies?.forEach((x) => {
      const ref: Referral = { referralCompanyId: x.id, referralCompany: x.value, referralDate: null };
      refs.push(ref);
      this.contactReferrals = refs;
    });
    // this.setPersonReferrals(this.personDetails?.referrals);
    // console.log('person refs', this.personReferrals);
  }

  // setPersonReferrals(referrals: Referral[]) {
  //   if (referrals?.length) {
  //     referrals.forEach(r => {
  //       this.personReferrals?.forEach(p => {
  //         if (r.referralCompanyId === p.referralCompanyId) { p.referralDate = r.referralDate; }
  //       });
  //     });
  //   }
  // }

  startReferral(company: Referral) {
    this.showRefDialog = true;
    this.sharedService.setRemoveSticky(this.showRefDialog);
    this.selectedReferralCompany = company;
  }

  viewDetails(personId: number) {
    if (personId) {
      const people = this.contactGroup?.contactPeople;
      const index = people.findIndex((x) => x.personId === personId);
      const person = people.find((x) => x.personId === personId);
      this.getPersonNotes(person.personId);
      people.splice(index, 1);
      people.unshift(person);
      console.log({ person }, { people });
    }
  }

  getPersonNotes(personId: number) {
    this.importantNotes$ = this.contactGroupService
      .getPersonNotes(personId)
      .pipe(map((x) => x.filter((n) => n.isImportant)));
  }
}
