import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContactNote, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../models/person';
import { AppUtils } from '../shared/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() personId: number;
  @Input() noteData: any;
  @Input() isPersonNote: boolean;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];
  @Input() contactGroups: BasicContactGroup[];
  originalNotes: any;
  tests: any;
  contactPeople: Person[];
  personNoteAddressees = [];
  contact: Person[];
  person: Person;
  contactGroupIds: number[] = [];
  groupAddressee: any;
  addressee: any;
  order = ['isPinned', 'createDate'];
  reverse = true;
  isUpdating = false;
  notes: any;
  addressees: any[];

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
    if (this.contactGroups && this.personId) {
      this.setPersonNoteAddressees();
    }

    // remove duplicate addressees when an updated note returns the new list of notes
     this.addressees = [...new Map(this.personNoteAddressees.map(item => [item.groupId, item])).values()];
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
    // if (this.originalNotes) {
    //   this.notes = this.originalNotes.slice(0, 10);
    // }
    if (this.noteData) {
      this.noteData.people !== undefined ? this.contactPeople = this.noteData.people : this.contactPeople = [];
      this.noteData.group ? this.groupAddressee = this.noteData.group.addressee : this.groupAddressee = [];
    }
    if (this.personNotes) {
      this.personNotes.forEach(x => {
        if (+x.contactGroupId !== 0) {
          this.contactGroupIds.push(+x.contactGroupId);
        }
      });
    }
  }

  private setPersonNoteAddressees() {
    console.log('contact groups in notes..', this.contactGroups);
    const contactGroupIds = new Set(this.contactGroupIds);
    let output;

    if (this.contactGroups) {
      for (const item of this.contactGroups) {
        if (contactGroupIds.has(item.contactGroupId)) {
          contactGroupIds.forEach(x => {
            if (+item.contactGroupId === +x) {
              output = {
                addressee: item.contactPeople.map(x => x.addressee),
                groupId: item.contactGroupId
              };
              this.personNoteAddressees.push(output);
            }
          });
        }
        if (item.contactPeople.find(p => p.personId === +this.personId)) {
          this.person = item.contactPeople.find(p => p.personId === this.personId);
        }
      }
    }
  }

  setFlag(noteId: number, isImportantFlag: boolean) {
    console.log('note id here.....', noteId);
    this.originalNotes.forEach((x: ContactNote) => {
      if (x.id === noteId) {
        if (isImportantFlag) {
          x.isImportant ? x.isImportant = false : x.isImportant = true;
        } else {
          x.isPinned ? x.isPinned = false : x.isPinned = true;
          this.isUpdating = true;
        }
        if (x.contactGroupId) {
          console.log('contact note here.....', x);
          this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
            this.contactGroupService.notesChanged(x);
            this.isUpdating = false;
          });
        } else {
          console.log('person note here.....', x);
          this.contactGroupService.updatePersonNote(x).subscribe((data) => {
            this.contactGroupService.notesChanged(x);
            this.isUpdating = false;
          });
        }
      }
    });
  }

  onScrollDown() {
    AppUtils.setupInfintiteScroll(this.originalNotes, this.notes);
    console.log('scrolled down!!');
  }

  onScrollUp() {
    AppUtils.setupInfintiteScroll(this.originalNotes, this.notes);
    console.log('scrolled up!!');
  }
  addNote() {
    if (this.noteData) {
      this.sharedService.addNote(this.noteData);
    }
  }
}
