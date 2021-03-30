import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MarketingPreferences, Person, Referral } from '../models/person';
import { Router } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { ResultData } from '../result-data';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit, OnChanges {
  @Input() personDetails: Person;
  @Input() isClickable = false;
  @Input() isNewContactGroup = false;
  @Input() showSetMainPerson = false;
  @Input() showViewPerson = false;
  @Input() showRemovePerson = false;
  @Input() isPersonInfoOnly = true;
  @Input() showEditOnly = true;
  @Input() contactType: number;
  @Input() referenceCount: number;
  @Input() index = 0;
  @Input() showEmailModal = false;
  @Output() selectedPersonId = new EventEmitter<number>();
  @Output() removedPersonPersonId = new EventEmitter<number>();
  @Output() mainPersonPersonId = new EventEmitter<number>();
  preferredNumber: string;
  preferredEmail: string;
  showRefDialog = false;
  referralCompanies: InfoDetail[];
  selectedCompany: Referral;
  personReferrals: Referral[] = [];

  constructor(private router: Router, private contactGroupService: ContactGroupsService, private storage: StorageMap,
    private infoService: InfoService, private messageService: MessageService) { }

  ngOnInit() {
    this.contactGroupService.noteChanges$.subscribe(note => {
      const notes = this.personDetails.personNotes;
      const existingNote = notes.find(x => x.id === note.id);
      if (note && note.isImportant && !existingNote) {
        notes.push(note);
      }
      if (note && !note.isImportant) {
        const index = notes.findIndex(x => +x.id === +note.id);
        notes.splice(index, 1);
      }
    });

    // Get referral Companies
    // this.getReferralCompanies();
  }

  ngOnChanges() {
    // Get referral Companies
    this.getReferralCompanies();

    if (this.personDetails?.phoneNumbers?.length) {
      this.preferredNumber = this.personDetails.phoneNumbers.find(x => x.isPreferred).number;
      console.log(this.preferredNumber, 'pref');
    }

    if (this.personDetails?.emailAddresses?.length) {
      this.preferredEmail = this.personDetails.emailAddresses.find(x => x.isPreferred).email;
    }
  }

  getReferralCompanies() {
    // Lead Types
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) { this.referralCompanies = data.referralCompanies; } else {
        this.infoService.getDropdownListInfo().subscribe((info: ResultData | any) => {
          if (info) { this.referralCompanies = data.referralCompanies; }
        });
      }
      this.setReferralCompanies();
    });
  }

  private setReferralCompanies() {
    const refs = [];
    this.referralCompanies?.forEach(x => {
      const ref: Referral = { referralCompanyId: x.id, referralCompany: x.value, referralDate: null };
      refs.push(ref);
      this.personReferrals = refs;
    });
    this.setPersonReferrals(this.personDetails?.referrals);
    console.log('person refs', this.personReferrals);
  }

  setPersonReferrals(referrals: Referral[]) {
    if (referrals?.length) {
      referrals.forEach(r => {
        this.personReferrals?.forEach(p => {
          if (r.referralCompanyId === p.referralCompanyId) { p.referralDate = r.referralDate; }
        });
      });
    }
  }

  startReferral(company: Referral) {
    this.showRefDialog = true;
    this.selectedCompany = company;
  }

  sendReferral() {
    if (this.personDetails?.personId && this.selectedCompany?.referralCompanyId) {
      this.contactGroupService.createPersonReferral(this.personDetails, this.selectedCompany.referralCompanyId)
        .subscribe((res: ResultData) => this.onSaveComplete(res.result));
    }
  }

  onSaveComplete(res: Referral[]): void {
    if (res) {
      this.setPersonReferrals(res);
      this.messageService.add({ severity: 'success', summary: 'Referral successfully sent', closable: false, key: 'referralMessage' });
      this.showRefDialog = false;
    }
  }

  navigateToEdit() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId, 'edit']);
  }

  navigateToView() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId]);
  }

  editSelectedPerson() {
    this.isPersonInfoOnly ? this.navigateToEdit() : this.selectedPersonId.emit(this.personDetails.personId);
  }

}

