import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { TelephoneModalComponent } from '../telephone-modal/telephone-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TapiService } from '../services/tapi.service';
import { TapiInfo } from '../models/tapi-info';
import { SharedService, WedgeError } from '../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { SmsModalComponent } from '../sms-modal/sms-modal.component';
import { take } from 'rxjs/operators';
import { Person } from '../models/person';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {
  @Input() person: Person;
  @Input() number: string;
  @Input() searchTerm: string;
  @Input() sms: boolean;
  @Input() warning: any;
  isDialing: boolean = false;

  constructor(private modalService: BsModalService, private tapiService: TapiService, private sharedService: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    if(!this.sharedService.isUKMobile(this.number)){
      this.sms = false;
    }
  }

  callOrText() {
    event.stopPropagation();
    event.preventDefault();

    if (this.sms) {
      if (this.warning && this.warning.value !== 'None') {
        this.showWarning().subscribe(res => {
          if (res) {
            this.callOrTextChoice();
          }
        });
      } else {
        this.callOrTextChoice();
      }
    } else {
      if (this.warning && this.warning.value !== 'None') {
        this.showWarning().subscribe(res => {
          if (res) {
            this.call();
          }
        });
      } else {
        this.call();
      }
    }
  }

  showWarning() {
    const subject = new Subject<boolean>();
    const initialState = {
      danger: this.warning,
      title: this.warning.value,
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
      window.open('tel:' + this.number);
    } else {
      const tapiInfo: TapiInfo = {
        officeId: 10,
        staffId: 10,
        isOutGoingCall: true,
        callerNmber: '4629',
        calledNumber: '07718702809',
        guid: ''
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
    if(this.sharedService.lastCallNoteToast) {
      this.toastr.clear(this.sharedService.lastCallNoteToast.toastId);
    }
    this.isDialing = false;
    this.toastr.success('Dialing ...', '', {
      toastClass: 'ngx-toastr toast-call'
    })
    .onHidden
    .pipe(take(1))
    .subscribe(()=>{
      this.sharedService.lastCallNoteToast = this.toastr.info('<u>Leave a note</u> for the last call with ' + this.person.salutation, '', {
        toastClass: 'ngx-toastr toast-notes',
        disableTimeOut: true,
        closeButton: true
      })
      .onTap
      .pipe(take(1))
      .subscribe(()=>{
        const data = {
          person: this.person,
          isPersonNote: true
        }
        this.sharedService.addNote(data);
      })
    });
  }
}
