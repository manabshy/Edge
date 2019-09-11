import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContactNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../models/person';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() dataNote: any;
  @Input() isPersonNote: boolean;
  @Input() personName: string;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];
  notes: any;
  contactPeople: Person[];
  order = ['isPinned', 'createDate'];
  reverse = true;
  isUpdating = false;

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
    console.log('data note', this.dataNote);
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
    this.dataNote.people ? this.contactPeople = this.dataNote.peopel : this.contactPeople = [];
  }

  setFlag(noteId: number, isImportantFlag: boolean) {
    console.log('note id here.....', noteId);
    this.notes.forEach((x: ContactNote) => {
      if (x.id === noteId) {
        if (isImportantFlag) {
          x.isImportant ? x.isImportant = false : x.isImportant = true;
        } else {
          x.isPinned ? x.isPinned = false : x.isPinned = true;
          this.isUpdating = true;
        }
        console.log('contact groupid here.....', x.contactGroupId);
        console.log('personid here.....', x.personId);
       if (x.contactGroupId) {
        console.log('contact note here.....', x);
          this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
            if (data) { location.reload(); }
            // this.contactGroupService.contactGroupNotesChanged(x);
            this.isUpdating = false;
          });
       } else {
        console.log('person note here.....', x);
         this.contactGroupService.updatePersonNote(x).subscribe((data) => {
          if (data) { location.reload(); }
          //  this.contactGroupService.personNotesChanged(x);
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
