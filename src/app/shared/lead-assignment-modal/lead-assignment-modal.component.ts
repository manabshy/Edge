import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-lead-assignment-modal',
  templateUrl: './lead-assignment-modal.component.html',
  styleUrls: ['./lead-assignment-modal.component.scss']
})
export class LeadAssignmentModalComponent implements OnInit {

  selectedOwner: number;
  isAssignable: boolean;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }

  onOwnerChanged(event: any) {
    console.log('owner from child',event);

    if (event && event.item != null) {
      this.selectedOwner = event.item.staffMemberId;
      this.isAssignable = true;
    }
  }

  action(value: boolean) {
    if (value) {
      this.bsModalRef.content.subject.next(this.selectedOwner);
    }
    this.bsModalRef.hide();
  }

}
