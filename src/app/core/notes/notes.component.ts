import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  personId: number;
  personNotes: PersonNote[];

  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.personId = +params['personId'] || 0);
    if(this.personId) {
      this.getNotes(this.personId);
    }
  }

  getNotes(personId: number){
    this.contactGroupService.getPersonNotes(personId).subscribe(data => {
      this.personNotes = data;
    });
  }
}
