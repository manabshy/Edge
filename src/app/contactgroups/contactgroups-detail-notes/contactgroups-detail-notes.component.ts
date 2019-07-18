import { Component, OnInit, Input } from '@angular/core';
import { Person } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { PersonNote } from '../shared/contact-group';

@Component({
  selector: 'app-contactgroups-detail-notes',
  templateUrl: './contactgroups-detail-notes.component.html',
  styleUrls: ['./contactgroups-detail-notes.component.scss']
})
export class ContactgroupsDetailNotesComponent implements OnInit {
  person: Person;
  personId: number;
  personNotes: PersonNote[];
  contactGroupId: number;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private sharedService: SharedService) { }
  // ngOnInit() {
  //   // let personParams = this.route.snapshot.queryParamMap.get('person');
  //   // if(personParams){
  //   //   this.person = JSON.parse(personParams);
  //   // }
  // }

  // addNote() {
  //   event.stopPropagation();
  //   const data = {
  //     person: this.person,
  //     isPersonNote: true
  //   }
  //   this.sharedService.addNote(data);
  // }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.personId = +params['personId'] || 0;
    });

    if(this.contactGroupId) {
      console.log('contact group id',this.contactGroupId);
      this.getContactGroupNotes(this.contactGroupId);
    } else if(this.personId){
      console.log('person id', this.personId);
      this.getPersonNotes(this.personId);
    }
  }

  getPersonNotes(personId: number){
    this.contactGroupService.getPersonNotes(personId).subscribe(data => {
      this.personNotes = data;
    });
  }
  getContactGroupNotes(personId: number){
    this.contactGroupService.getPersonNotes(personId).subscribe(data => {
      this.personNotes = data;
    });
  }

  addNote() {
    event.stopPropagation();
    const data = {
      personId: this.personId,
    }
    console.log('for notes',data);
    this.sharedService.addNote(data);
  }
}
