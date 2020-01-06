import { Component, OnInit } from '@angular/core';

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

  selectStaffMember(staffMember: any){
    this.showCalendar = true;
  }

}
