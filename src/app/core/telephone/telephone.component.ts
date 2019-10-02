import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { TelephoneModalComponent } from '../telephone-modal/telephone-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TapiService } from '../services/tapi.service';
import { TapiRequestInfo } from '../models/tapi-request-info';
import { SharedService, WedgeError } from '../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { SmsModalComponent } from '../sms-modal/sms-modal.component';
import { take } from 'rxjs/operators';
import { Person } from '../models/person';
import { StaffMember } from '../models/staff-member';
import { AppUtils } from '../shared/utils';
import { StaffMemberService } from '../services/staff-member.service';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {
  @Input() person: Person;
  @Input() number: string;
  @Input() staffMember: StaffMember;
  @Input() searchTerm: string;
  @Input() warning: any;
  isDialing: boolean;
  sms: boolean = true;
  currentStaffMember: StaffMember;

  constructor(private modalService: BsModalService,
              private tapiService: TapiService,
              private sharedService: SharedService,
              private toastr: ToastrService,
              private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    if (!this.sharedService.isUKMobile(this.number)) {
      this.sms = false;
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
    const initialState = {
      person: this.person,
      number: this.number,
      salutation: this.person.salutation,
      actions: ['Cancel', 'Send SMS']
    };
    const modal = this.modalService.show(SmsModalComponent, {initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }

  call() {
    if (window.innerWidth < 576) {
      document.location.href = 'tel:' + this.number;
      this.leaveANoteBanner();
    } else {

      if (AppUtils.currentStaffMemberGlobal) {
        this.currentStaffMember = AppUtils.currentStaffMemberGlobal;
        console.log('global staff member in home in ngOnInit', this.currentStaffMember);
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(data => {
        this.currentStaffMember = data;
        }, (error: WedgeError) => {
          this.sharedService.showError(error);
        });
      }

      const tapiInfo: TapiRequestInfo = {
        officeId: this.currentStaffMember.homeOffice.officeId,
        staffId: this.currentStaffMember.staffMemberId,
        isOutGoingCall: true,
        callerNmber: this.currentStaffMember.phone,
        calledNumber: this.number,
        guid: '',
        isCallHangedUp: false
      };

      this.isDialing = true;
      this.tapiService.putCallRequest(tapiInfo).subscribe(data => {
        this.calling();
        console.log(data);
      },
      (error: WedgeError) => {
        this.isDialing = false;
        this.sharedService.showError(error);
      });

    }
  }

  calling() {
    this.isDialing = false;
    this.endCallBanner()
    this.leaveANoteBanner();
  }

  endCallBanner() {
    if (this.sharedService.lastCallEndCallToast) {
      this.toastr.clear(this.sharedService.lastCallEndCallToast.toastId);
    }
    this.sharedService.lastCallEndCallToast = this.toastr.success('Calling ' + this.person.salutation + ' ... <a class="btn btn-danger text-white ml-2">Hang up</a>', '', {
      toastClass: 'ngx-toastr toast-call',
      disableTimeOut: true
    });
    
    this.sharedService.lastCallEndCallToast
    .onTap
    .pipe(take(1))
    .subscribe(() => {
      const tapiInfo: TapiRequestInfo = {
        officeId: this.currentStaffMember.homeOffice.officeId,
        staffId: this.currentStaffMember.staffMemberId,
        isOutGoingCall: true,
        callerNmber: this.currentStaffMember.phone,
        calledNumber: this.number,
        guid: '',
        isCallHangedUp: true
      };

      this.tapiService.putCallRequest(tapiInfo).subscribe(data => {
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
}
