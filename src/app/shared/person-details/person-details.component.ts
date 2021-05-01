import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MarketingPreferences, Person, Referral } from '../models/person';
import { Router } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { ResultData } from '../result-data';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { PeopleService } from 'src/app/core/services/people.service';
import { Permission, PermissionEnum, StaffMember } from '../models/staff-member';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { SharedService } from 'src/app/core/services/shared.service';

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
  canRemove = true;
  dialogRef: any;
  currentStaffMember: any;
  warnings: InfoDetail[];
  warningStatus: string;

  constructor(private router: Router, private contactGroupService: ContactGroupsService,
    private peopleService: PeopleService,
    public staffMemberService: StaffMemberService, private storage: StorageMap, private sharedService: SharedService,
    private infoService: InfoService, private messageService: MessageService, private dialogService: DialogService) { }

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

    // this.performRemoval().subscribe(res => {
    //   let save = res ? 'save' : 'not saved';
    //   console.log({ res }, { save }, 'here.. for response')
    // });
    // Get referral Companies
    // this.getReferralCompanies();
  }

  ngOnChanges() {
    // Get referral Companies
    this.getInfo();
    this.getCurrentUser();

    if (this.personDetails?.phoneNumbers?.length) {
      this.preferredNumber = this.personDetails.phoneNumbers.find(x => x.isPreferred).number;
    }

    if (this.personDetails?.emailAddresses?.length) {
      this.preferredEmail = this.personDetails.emailAddresses.find(x => x.isPreferred).email;
    }
    if (this.warnings) { console.log('warnings here as input', this.warnings) }
  }

  getCurrentUser() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else { this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res); }
      this.setCanRemoveFlag(this.currentStaffMember?.permissions);
    });
  }

  setCanRemoveFlag(permissions: Permission[]) {
    this.canRemove = permissions?.find(x => x.permissionId === PermissionEnum.GdprRemoval) ? true : false;
  }

  getInfo() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) { this.referralCompanies = data.referralCompanies; this.warnings = data.personWarningStatuses; } else {
        this.infoService.getDropdownListInfo().subscribe((info: DropdownListInfo) => {
          if (info) { this.referralCompanies = info.referralCompanies; this.warnings = info.personWarningStatuses; }
        });
      }
      this.setPersonWarning(this.personDetails, this.warnings);
      this.setReferralCompanies();
    });
  }

  setPersonWarning(person: Person, warnings: InfoDetail[]) {
    console.log({ person }, 'person status', { warnings });
    if (person) {
      if (person.warningStatusId !== 1) {
        console.log('status here.....');
        this.warningStatus = warnings?.find(x => x.id === person.warningStatusId)?.value || person.warningStatusComment;
      }
    }
    console.log('status here 2.....', person);
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
    this.sharedService.setRemoveSticky(this.showRefDialog);
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
      this.sharedService.setRemoveSticky(this.showRefDialog);
    }
  }

  cancelReferral() {
    this.showRefDialog = false;
    this.sharedService.setRemoveSticky(this.showRefDialog);
  }

  toggleShowEmailModal(shouldSet: boolean) {
    shouldSet ? this.showEmailModal = true : this.showEmailModal = false;
    console.log({ shouldSet });

    this.sharedService.setRemoveSticky(this.showEmailModal);
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

  showTransactionMessage() {
    const data = {
      isSingleAction: true,
      title: `<p>${this.personDetails?.addressee} is involved in a live transaction.</p> <p><strong>Please rectify before completing this action.</strong></p>`,
      actions: ['OK']
    };

    this.dialogRef = this.dialogService.open(ConfirmModalComponent, { data, styleClass: 'dialog dialog--hasFooter', header: 'GDPR Removal Warning' });
    this.dialogRef.onClose.subscribe();

  }

  performRemoval() {
    if (this.referenceCount) {
      this.showTransactionMessage();
    } else {

      const data = {
        title: `<p>Are you sure you want to permanently remove ${this.personDetails?.addressee} from the EDGE database?</p> <p><strong>This is an irreversible action!</strong></p>`,
        actions: ['Cancel', 'OK']
      };

      this.dialogRef = this.dialogService.open(ConfirmModalComponent, { data, styleClass: 'dialog dialog--hasFooter', header: 'GDPR Removal Warning' });
      this.dialogRef.onClose.subscribe((res) => {
        if (res) {
          this.peopleService.performGdprRemoval(this.personDetails).subscribe((result) => {
            if (result) {
              this.messageService.add({
                severity: 'success',
                summary: `GDPR Removal Completed`,
                closable: false
              });
              setTimeout(() => {
                this.router.navigate(['/contact-centre']);
              }, 2000);
            }
          });
        }
      });
    }
  }
}

