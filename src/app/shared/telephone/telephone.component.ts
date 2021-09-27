import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { TelephoneModalComponent } from '../telephone-modal/telephone-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TapiService } from '../../core/services/tapi.service';
import { TapiRequestInfo } from '../models/tapi-request-info';
import { SharedService, WedgeError } from '../../core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { SmsModalComponent } from '../sms-modal/sms-modal.component';
import { take } from 'rxjs/operators';
import { Person } from '../models/person';
import { StaffMember } from '../models/staff-member';
import { StaffMemberService } from '../../core/services/staff-member.service';
import { Company } from 'src/app/contact-groups/shared/contact-group';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit, OnChanges {
  @Input() person: Person;
  @Input() company: Company;
  @Input() number: string;
  @Input() isFax = false;
  @Input() staffMember: StaffMember;
  @Input() searchTerm: string;
  @Input() warning: any;
  @Input() isCallAllowed = true;
  @Input() comment: string;
  isDialing: boolean;
  sms = false;
  currentStaffMember: StaffMember;
  tapiInfo: TapiRequestInfo;
  ref: DynamicDialogRef;
  showMessage: boolean = false;

  constructor(private modalService: BsModalService,
    private tapiService: TapiService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private storage: StorageMap,
    private dialogService: DialogService,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    // if (!this.sharedService.isUKMobile(this.number)) {
    //   this.sms = false;
    // }
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        this.tapiInfo = this.setupTapiInfo(data);
      }
    });
    // this.staffMemberService.getCurrentStaffMember().subscribe(data => {
    //   if (data) {
    //     this.currentStaffMember = data;
    //     this.tapiInfo = this.setupTapiInfo(data);
    //   }
    // });
  }

  ngOnChanges() {
    if (this.person) {
      this.sms = !!this.person.phoneNumbers?.find(x => x.sendSMS) && this.sharedService.isUKMobile(this.number);

      this.showMessage = this.person.warningStatusId !== 1 || !this.person.contactByPhone ? true : false;
    }
  }

  callOrText(call: boolean) {
    event.stopPropagation();
    event.preventDefault();
    if (call) {
      if (this.warning && this.warning !== 'None') {
        this.showWarning().subscribe(res => {
          if (res) {
            this.call();
          }
        });
      } else {
        this.call();
      }
    } else {
      if (this.warning && this.warning !== 'None') {
        this.showWarning().subscribe(res => {
          if (res) {
            this.sendSMS();
          }
        });
      } else {
        this.sendSMS();
      }
    }
  }

  showWarningMessage() {
    if (!this.showMessage) { return; }
    const data = {
      isSingleAction: true,
      title: this.getWarningMessage(this.person),
      actions: ['OK']
    };

    this.ref = this.dialogService.open(ConfirmModalComponent, { data, styleClass: 'dialog dialog--hasFooter', header: 'Phone Call Warning' });
    this.ref.onClose.subscribe();
  }

  getWarningMessage(person: Person) {
    console.log({ person }, this.warning);

    if (person?.warningStatusId !== 1 && !person?.contactByPhone) { return `<p>This person has phone calls switched off and a ${person?.warning} warning.</p> <p><strong>Please check their history before phoning.</strong></p>`; }
    if (!person?.contactByPhone) { return '<p>This person has phone calls switched off.</p> <p><strong>Please check their history before phoning.</strong></p>'; }
    if (person?.warningStatusId) { return `<p>This person has a ${person?.warning} warning.</p> <p><strong>Please check their history before phoning.</strong></p>`; }
  }

  showWarning() {
    const subject = new Subject<boolean>();
    const initialState = {
      danger: this.warning,
      title: this.warning,
      actions: ['Leave', 'Proceed']
    };
    const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }

  callOrTextChoice() {
    const subject = new Subject<string>();
    const initialState = {
      warning: this.warning
    };
    const modal = this.modalService.show(TelephoneModalComponent, { initialState: initialState });
    modal.content.subject = subject;
    subject.asObservable().subscribe(res => {
      if (res === 'call') {
        this.call();
      } else {
        this.sendSMS();
      }
    });
  }

  sendSMS() {
    const subject = new Subject<boolean>();
    // const initialState = {
    //   person: this.person,
    //   company: this.company,
    //   number: this.number,
    //   salutation: this.person ? this.person.salutation : this.company.companyName,
    //   actions: ['Cancel', 'Send SMS']
    // };
    // const modal = this.modalService.show(SmsModalComponent, { initialState });
    // modal.content.subject = subject;
    const data = {
      person: this.person,
      company: this.company,
      number: this.number,
      salutation: this.person ? this.person.salutation : this.company.companyName,
      actions: ['Cancel', 'Send SMS']
    };
    this.ref = this.dialogService.open(SmsModalComponent, { data, styleClass: 'dialog dialog--hasFooter', header: 'Send SMS' });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        subject.next(true);
        subject.complete();
      }
    });
    console.log(this.ref, 'res');
    return subject.asObservable();
  }

  call() {
    if (window.innerWidth < 576) {
      document.location.href = 'tel:' + this.number;
      if (this.person) {
        this.leaveANoteBanner();
      }
    } else {
      this.isDialing = true;
      this.tapiInfo = this.setupTapiInfo(this.currentStaffMember);
      this.tapiService.putCallRequest(this.tapiInfo).subscribe(data => {
        this.calling();
        console.log(data);
      },
        (error: WedgeError) => {
          this.isDialing = false;
        });

    }
  }

  calling() {
    this.isDialing = false;
    this.endCallBanner();
    if (this.person) {
      this.leaveANoteBanner();
    }
  }

  endCallBanner() {
    if (this.sharedService.lastCallEndCallToast) {
      this.toastr.clear(this.sharedService.lastCallEndCallToast.toastId);
    }
    const receiver = this.person ? this.person.salutation : this.company.companyName;
    this.sharedService.lastCallEndCallToast = this.toastr.success('<div class="row align-items-center"><div class="col">Calling <b>' + receiver + '</b></div><div class="col-auto"><a class="btn btn-danger text-white ml-2">Hang up</a></div>', '', {
      toastClass: 'ngx-toastr toast-call',
      disableTimeOut: true
    });

    this.sharedService.lastCallEndCallToast
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        this.tapiInfo = this.setupTapiInfo(this.currentStaffMember, true);
        this.tapiService.putCallRequest(this.tapiInfo).subscribe(data => {
          console.log(data);
          this.toastr.clear(this.sharedService.lastCallEndCallToast.toastId);
        });

        console.log('hang up!');
      });
  }

  leaveANoteBanner() {
    if (this.sharedService.lastCallNoteToast) {
      this.toastr.clear(this.sharedService.lastCallNoteToast.toastId);
    }
    this.sharedService.lastCallNoteToast = this.toastr.info('<u>Leave a note</u> for the last call with ' + this.person.salutation, '', {
      toastClass: 'ngx-toastr toast-notes',
      disableTimeOut: true,
      closeButton: true
    });
    this.sharedService.lastCallNoteToast
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        const data = {
          person: this.person,
          isPersonNote: true
        };
        this.sharedService.addNote(data);
        this.toastr.clear(this.sharedService.lastCallNoteToast.toastId);
      });
  }
  setupTapiInfo(staffMember: StaffMember, isCallHangedUp: boolean = false) {
    let tapiInfo: TapiRequestInfo;
    tapiInfo = {
      // officeId: staffMember.homeOffice.officeId,
      officeId: 0,
      staffId: staffMember.staffMemberId,
      isOutGoingCall: true,
      callerNmber: staffMember.phone,
      calledNumber: this.number,
      guid: '',
      isCallHangedUp: isCallHangedUp
    };
    return tapiInfo;
  }
}
