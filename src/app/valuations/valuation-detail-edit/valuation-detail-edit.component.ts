import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
})
export class ValuationDetailEditComponent implements OnInit {

  staffMembers = [
    {
      id: 1,
      fullName: 'John Smith'
    },
    {
      id: 1,
      fullName: 'Bill Doe'
    }

  ]

  showCalendar: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  selectStaffMember(staffMember: any) {
    this.showCalendar = true;
  }

  getSelectedProperty(property: Property) {
    if (property) {
      console.log('selected property', property);
    }
  }
  getSelectedOwner(owner: Signer){
    if (owner) {
      console.log('selected owner', owner);
    }
  }
}
