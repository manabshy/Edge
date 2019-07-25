import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PersonNote, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() dataNote: any;
  @Input() personNotes: PersonNote[];
  @Input() contactGroupNotes: ContactGroupsNote[];
  notes: ContactGroupsNote[];

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  setImportantFlag(noteId: number, isPersonNote?: boolean) {
    if (isPersonNote) {
      this.personNotes.forEach(x => {
        if (x.personNoteId === noteId) {
          x.isImportant = true;
        }
      });
    } else {
      this.contactGroupNotes.forEach(x => {
        if (x.contactNoteId === noteId) {
          x.isImportant = true;
        }
      });
    }
  }

  setPinnedFlag(noteId: number, isPersonNote?: boolean) {
    if (isPersonNote) {
      this.personNotes.forEach(x => {
        if (x.personNoteId === noteId) {
          x.isPinned = true;
        }
      });
    } else {
      this.contactGroupNotes.forEach(x => {
        if (x.contactNoteId === noteId) {
          x.isPinned = true;
        }
      });
    }
  }
 
 addNote(dataNote) {
   if (this.dataNote) {
      this.sharedService.addNote(this.dataNote);
   }
  }
}
