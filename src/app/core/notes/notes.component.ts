import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PersonNote, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';

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
  isUpdating = false;

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
  }

  setFlag(noteId: number, isImportantFlag: boolean) {
    this.notes.forEach(x => {
      if (x.contactNoteId === noteId || x.personNoteId === noteId) {
        if (isImportantFlag) {
          x.isImportant ? x.isImportant = false : x.isImportant = true;
        } else {
          x.isPinned ? x.isPinned = false : x.isPinned = true;
          this.isUpdating = true;
        }
       if (x.contactNoteId) {
          this.contactGroupService.updateContactGroupNote(x).subscribe(() => {
            this.contactGroupService.contactGroupNotesChanged(x);
            this.isUpdating = false;
          });
       } else {
         this.contactGroupService.updatePersonNote(x).subscribe(() => {
           this.contactGroupService.personNotesChanged(x);
            this.isUpdating = false;
          });
       }
      }});
  }

 addNote() {
   if (this.dataNote) {
      this.sharedService.addNote(this.dataNote);
   }
  }
}
