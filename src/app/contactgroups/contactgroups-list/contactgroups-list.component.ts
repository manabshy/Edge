import { Component, OnInit, Input } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';

@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit {
@Input()  contactGroups: ContactGroupAutoCompleteResult[];
@Input() searchTerm: string;

  constructor() { }

  ngOnInit() {
  }

}
