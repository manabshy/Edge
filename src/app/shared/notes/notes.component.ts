import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactNote, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../models/person';
import { PropertyNote } from 'src/app/property/shared/property';
import { PropertyService } from 'src/app/property/shared/property.service';
import { StaffMember } from '../models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';

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
  @Input() showNoteInput: boolean = true;

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
  currentStaffMember: StaffMember;

  constructor(private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private storage: StorageMap,
    private router: Router,
    private propertyService: PropertyService) { }

  ngOnInit() {
    this.storage.get('currentUser').subscribe((staffMember: StaffMember) => {
      if (staffMember) {
        this.currentStaffMember = staffMember;
      }
    });
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
    if (this.notes.propertyId) {
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
      }
    });

  }

  onScrollDown() {
    this.onWindowScroll();
  }

  onScrollUp() {
  }

  // REFACTOR ASAP
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let scrollHeight: number, totalHeight: number;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;
    const url = this.router.url;
    const hasNotes = url.includes('showNotes=true');
    if (hasNotes) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        console.log('xxxxxxxxxxxxxxxxxxxx..........', this.notes)
        this.page++;
        if (this.contactPeople && this.contactPeople.length) {
          this.contactGroupService.contactNotePageNumberChanged(this.page);
          console.log('in contact notes..........', this.contactGroupNotes)
        }
        if (this.isPersonNote) {
          this.contactGroupService.personNotePageNumberChanged(this.page);
          console.log('in person notes..........', this.personNotes)
        }
        if (this.isPropertyNote) {
          this.propertyService.propertyNotePageNumberChanged(this.page);
          console.log('in property notes..........', this.propertyNotes)
        }
      }
    }
  }

  addNote() {
    if (this.noteData) {
      this.sharedService.addNote(this.noteData);
    }
  }
}
