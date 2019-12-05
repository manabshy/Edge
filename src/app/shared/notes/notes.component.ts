import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactNote, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../models/person';
import { PropertyNote } from 'src/app/property/shared/property';
import { PropertyService } from 'src/app/property/shared/property.service';

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
  @Input() bottomReached: boolean;
  @Input() addressees: any;
  @Input() person: Person;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];
  @Input() propertyNotes: PropertyNote[];

  notes: any;
  tests: any;
  contactPeople: Person[];
  contact: Person[];
  contactGroupIds: number[] = [];
  groupAddressee: any;
  addressee: any;
  order = ['isPinned', 'createDate'];
  reverse = true;
  page: number;
  notesLength: number;
  isPropertyNote: boolean;
  isPersonNote: boolean;
  isUpdating: boolean;

  constructor(private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes || this.propertyNotes;
    this.page = this.pageNumber;
    if (this.noteData) {
      this.noteData.people !== undefined ? this.contactPeople = this.noteData.people : this.contactPeople = [];
      this.noteData.group ? this.groupAddressee = this.noteData.group.addressee : this.groupAddressee = [];
    }
    if (this.propertyNotes) {
      this.propertyNotes.filter(x => x.text) ? this.isPropertyNote = true : this.isPropertyNote = false;
    }
    if (this.personNotes) {
      this.personNotes.filter(x => x.text) ? this.isPersonNote = true : this.isPersonNote = false;
    }
  }

  setFlag(noteId: number, isImportantFlag: boolean) {
    if(this.notes.propertyId){
      return;
    }
    this.notes.forEach((x) => {
      if (x.id === noteId) {
        if (isImportantFlag) {
          x.isImportant ? x.isImportant = false : x.isImportant = true;
        } else {
          x.isPinned ? x.isPinned = false : x.isPinned = true;
        }
        switch (true) {
          case !!x.contactGroupId:
            this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
              this.contactGroupService.notesChanged(x);
            });
            break;
          case !!x.personId:
            this.contactGroupService.updatePersonNote(x).subscribe((data) => {
              this.contactGroupService.notesChanged(x);
            });
            break;
          case !!x.propertyId:
            this.propertyService.updatePropertyNote(x).subscribe((data) => {
              this.propertyService.propertyNoteChanged(x);
            });
            break;
        }
        // if (x.contactGroupId) {
        //   console.log('contact note here.....', x);
        //   this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
        //     this.contactGroupService.notesChanged(x);
        //     this.isUpdating = false;
        //   });
        // } else {
        //   console.log('person note here.....', x);
        //   this.contactGroupService.updatePersonNote(x).subscribe((data) => {
        //     this.contactGroupService.notesChanged(x);
        //     this.isUpdating = false;
        //   });
        // }
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
      if (this.contactPeople && this.contactPeople.length) {
        console.log('here for contact notes');
        this.contactGroupService.contactNotePageNumberChanged(this.page);
        console.log('page number here for contact notes...', this.page);

      }
      if (this.isPersonNote) {
        console.log('here for person notes', this.isPersonNote);
        this.contactGroupService.personNotePageNumberChanged(this.page);
        console.log('page number here for peron notes...', this.page);

      }
      if (this.isPropertyNote) {
        console.log('here for property notes', this.isPropertyNote);
        this.propertyService.propertyNotePageNumberChanged(this.page);
        console.log('page number here for property notes...', this.page);
      }
    }
  }

  addNote() {
    if (this.noteData) {
      console.log('add note', this.person);
      console.log('note data' , this.noteData);
      this.sharedService.addNote(this.noteData);
    }
  }
}
