import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
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
  @Input() pageNumber: number;
  @Input() isPersonNote: boolean;
  @Input() bottomReached: boolean;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];
  @Input() contactGroups: BasicContactGroup[];
  notes: any;
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
  addressees: any[];
  page: number;
  notesLength: number;

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
    this.page = this.pageNumber;
    if (this.contactGroups && this.personId) {
      this.setPersonNoteAddressees();
    }

    if(this.notesLength !== this.notes.length - 1) {
      setTimeout(()=>{
        this.notesLength = this.notes.length - 1;
        this.itemIntoView(this.notesLength);
      });
    }

    // remove duplicate addressees when an updated note returns the new list of notes
    this.addressees = [...new Map(this.personNoteAddressees.map(item => [item.groupId, item])).values()];
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;

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
    //this.onWindowScroll()
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  itemIntoView(index: number) {
    const items = document.querySelectorAll('.list-group-item');

    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          setTimeout(()=>{
            this.onWindowScroll();
            observer.unobserve(entry.target);
          })
        }
      });
    });

    if(index > 0) {
      observer.observe(items[index]);
    }
  }

  onWindowScroll() {
    if (!this.bottomReached) {
      this.page++;
      this.contactGroupService.notePageNumberChanged(this.page);
    }
  }

  addNote() {
    if (this.noteData) {
      this.sharedService.addNote(this.noteData);
    }
  }
}
