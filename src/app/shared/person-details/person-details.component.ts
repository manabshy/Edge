import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarketingPreferences, Person } from '../models/person';
import { Router } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() isClickable = false;
  @Input() isNewContactGroup = false;
  @Input() showSetMainPerson = false;
  @Input() showViewPerson = false;
  @Input() showRemovePerson = false;
  @Input() isPersonInfoOnly = true;
  @Input() showEditOnly = true;
  @Input() contactType: number;
  @Input() referenceCount: number;
  @Input() index = 0;
  @Output() selectedPersonId = new EventEmitter<number>();
  @Output() removedPersonPersonId = new EventEmitter<number>();
  @Output() mainPersonPersonId = new EventEmitter<number>();
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

  navigateToEdit() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId, 'edit']);
  }

  navigateToView() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId]);
  }

  editSelectedPerson() {
    this.isPersonInfoOnly ? this.navigateToEdit() : this.selectedPersonId.emit(this.personDetails.personId);
  }

}
