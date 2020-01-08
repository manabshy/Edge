import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../models/person';
import { Router } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() isClickable = true;
  constructor(private router: Router, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.contactGroupService.noteChanges$.subscribe(note => {
      const notes = this.personDetails.personNotes;
      const existingNote = notes.find(x => x.id === note.id);
      if (note && note.isImportant && !existingNote) {
        notes.push(note);
      }
      if (note && !note.isImportant) {
        const index = notes.findIndex(x => +x.id === +note.id);
        notes.splice(index, 1);
      }
    });
  }

  navigate() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId, 'edit']);
  }
}
