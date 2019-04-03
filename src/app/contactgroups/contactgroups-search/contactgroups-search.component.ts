import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactgroups-search',
  templateUrl: './contactgroups-search.component.html',
  styleUrls: ['./contactgroups-search.component.scss']
})
export class ContactgroupsSearchComponent implements OnInit {

  searchResultCollapsed = false;
  advSearchCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
