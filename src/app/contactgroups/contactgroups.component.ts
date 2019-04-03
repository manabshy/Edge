import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {

  searchResultCollapsed = false;
  advSearchCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
