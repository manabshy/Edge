import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-lead-assignment-modal',
  templateUrl: './lead-assignment-modal.component.html',
  styleUrls: ['./lead-assignment-modal.component.scss']
})
export class LeadAssignmentModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  onOwnerChanged(event: any) {
    console.log(event);

    if (event && event.item != null) {

    } else {

    }
  }

  action(value: boolean) {
    this.bsModalRef.hide();
  }

}
