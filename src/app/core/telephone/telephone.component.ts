import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { TelephoneModalComponent } from '../telephone-modal/telephone-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TapiService } from '../services/tapi.service';
import { TapiInfo } from '../models/tapi-info';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {
  @Input() number: string;
  @Input() searchTerm: string;
  @Input() sms: boolean;
  @Input() warning: any;

  constructor(private modalService: BsModalService, private tapiService: TapiService) { }

  ngOnInit() {
  }

  callOrText() {
    if (this.sms) {
      if (this.warning) {
        this.showWarning().subscribe(res => {
          if (res) {
            this.callOrTextChoice();
          }
        });
      } else {
        this.callOrTextChoice();
      }
    } else {
      if (this.warning) {
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
        alert('SMS');
      }
    });
  }

  call() {
    if (window.innerWidth < 576) {
      window.open('tel:' + this.number);
    } else {
      // alert('Calling...');
      const tapiInfo: TapiInfo = {
        officeId: 10,
        staffId: 10,
        isOutGoingCall: true,
        callerNmber: '4629',
        calledNumber: '07718702809',
        IP: '192.168.10.29'
      };

      this.tapiService.putCallRequest(tapiInfo).subscribe(data => console.log(data));

    }
  }
}
