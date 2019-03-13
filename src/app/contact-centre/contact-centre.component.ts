import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-centre',
  templateUrl: './contact-centre.component.html',
  styleUrls: ['./contact-centre.component.css']
})
export class ContactCentreComponent implements OnInit {

  searchResultCollapsed = false;
  advSearchCollapsed = false;
  contactCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
