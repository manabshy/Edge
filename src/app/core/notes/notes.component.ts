import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PersonNote, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() dataNote: any;
  @Input() personNotes: PersonNote[];
  @Input() contactGroupNotes: ContactGroupsNote[];
  notes: any;
  order = ['isPinned', 'createDate'];
  reverse = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
  }

  setImportantFlag(noteId: number) {
    this.notes.forEach(x => {
      if (x.contactNoteId === noteId || x.personNoteId === noteId) {
        x.isImportant = true;
      }
    });
  }

  setPinnedFlag(noteId: number) {
    this.notes.forEach(x => {
      if (x.contactNoteId === noteId || x.personNoteId === noteId) {
        x.isPinned = true;
      }
    });
  }
 
 addNote(dataNote) {
   if (this.dataNote) {
      this.sharedService.addNote(this.dataNote);
   }
  }
}
