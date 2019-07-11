import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { TelephoneModalComponent } from '../telephone-modal/telephone-modal.component';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.scss']
})
export class TelephoneComponent implements OnInit {
  @Input() number: string;
  @Input() searchTerm: string;
  @Input() sms: boolean;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  callOrText() {
    if(this.sms) {
      const subject = new Subject<string>();
      const modal = this.modalService.show(TelephoneModalComponent);
      modal.content.subject = subject;
      subject.asObservable().subscribe(res => {
        if(res === 'call') {
          this.call();
        } else {
          alert('SMS');
        }
      });
    } else {
      this.call();
    }
  }

  call() {
    if(window.innerWidth < 576) {
      window.open('tel:'+ this.number);
    } else {
      alert('TAPI');
    }
  }
}
