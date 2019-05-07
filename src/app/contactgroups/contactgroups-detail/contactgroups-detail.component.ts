import { Component, OnInit, Input } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {
  contactGroupDetails: ContactGroupAutoCompleteResult[];
  contactGroupId: number;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {this.contactGroupId = params['id']; });
    this.getContactGroupById(this.contactGroupId);
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      console.log(this.contactGroupDetails);
    });
  }
}
