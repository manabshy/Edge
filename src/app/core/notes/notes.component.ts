import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactNote, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../models/person';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() personId: number;
  @Input() noteData: any;
  @Input() personNotesData: any;
  @Input() pageNumber: number;
  @Input() isPersonNote: boolean;
  @Input() bottomReached: boolean;
  @Input() addressees: any;
  @Input() person: Person;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];

  notes: any;
  tests: any;
  contactPeople: Person[];
  contact: Person[];
  contactGroupIds: number[] = [];
  groupAddressee: any;
  addressee: any;
  order = ['isPinned', 'createDate'];
  reverse = true;
  isUpdating = false;
  page: number;
  notesLength: number;

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
    this.page = this.pageNumber;
    if (this.noteData) {
      this.noteData.people !== undefined ? this.contactPeople = this.noteData.people : this.contactPeople = [];
      this.noteData.group ? this.groupAddressee = this.noteData.group.addressee : this.groupAddressee = [];
    }
  }

  setFlag(noteId: number, isImportantFlag: boolean) {
    this.notes.forEach((x: ContactNote) => {
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
    this.onWindowScroll();
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight && !this.bottomReached) {
      this.page++;
      if (this.contactPeople) {
        console.log('here for contact notes');
        this.contactGroupService.contactNotePageNumberChanged(this.page);
      } else {
        console.log('here for person notes');
        this.contactGroupService.personNotePageNumberChanged(this.page);
      }
      console.log('page number here...', this.page);
    }
  }

  addNote() {
    if (this.noteData) {
      this.sharedService.addNote(this.noteData);
    }
  }
}
