import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit {

  areLeadsAssignable: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
  }

  assignSelected() {
    console.log("show popup to assign leads");
  }

  selectLead() {
    if(this.areLeadsAssignable) {
      event.preventDefault();
    }
  }

}
