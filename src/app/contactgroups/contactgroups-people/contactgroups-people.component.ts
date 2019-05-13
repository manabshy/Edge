import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { ContactGroup } from '../shared/contact-group';

@Component({
  selector: 'app-contactgroups-people',
  templateUrl: './contactgroups-people.component.html',
  styleUrls: ['./contactgroups-people.component.scss']
})
export class ContactgroupsPeopleComponent implements OnInit {
  isCollapsed = {};
  personId: number;
  groupPersonId: number;
  contactGroupId: number;
  contactPeople: Person[];
  contactGroupDetails: ContactGroup;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
     this.route.params.subscribe(params => {
       this.contactGroupId = +params['contactGroupId'] || 0;
       this.groupPersonId = +params['groupPersonId'] || 0;
       this.personId = +params['personId'] || 0;
      });
     this.getContactGroupById(this.contactGroupId);
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      console.log('contact group people',this.contactGroupDetails);
    });
  }
}
