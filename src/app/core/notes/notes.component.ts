import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() dataNote: any;
  personId: number;
  personNotes: PersonNote[];
  contactGroupId: number;

  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.personId = +params['personId'] || 0;
    });
    // const id = this.contactGroupId ? this.contactGroupId : this.personId;
    // if(id) {
    //   this.getPersonNotes(id);
    // }
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

  addNote(dataNote) {
    console.log('info for note', dataNote);
    this.sharedService.addNote(this.dataNote);
  }

}
