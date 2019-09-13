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
  @Input() noteData: any;
  @Input() isPersonNote: boolean;
  @Input() personName: string;
  @Input() personNotes: ContactNote[];
  @Input() contactGroupNotes: ContactNote[];
  notes: any;
  tests: any;
  contactPeople: Person[];
  contact: Person[];
  
  groupAddressee: any;
  addressee: any;
  order = ['isPinned', 'createDate'];
  reverse = true;
  isUpdating = false;
  contactGroups: BasicContactGroup[];

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.contactGroupService.contactInfoForNotes$.subscribe(data => 
      {
        this.contactGroups = data; console.log('info here....', data);
        if(this.contactGroups){
          this.contactGroups.forEach(x=>{
            this.contact = x.contactPeople;
          })
        }
         this.addressee = this.contact.map(x=>x.addressee);
    });
    
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes;
   if (this.noteData) {
      this.noteData.people !== undefined ? this.contactPeople = this.noteData.people : this.contactPeople = [];
      this.noteData.group ? this.groupAddressee = this.noteData.group.addressee : this.groupAddressee = [];
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
        console.log('contact groupid here.....', x.contactGroupId);
        console.log('personid here.....', x.personId);
       if (x.contactGroupId) {
        console.log('contact note here.....', x);
          this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
            // if (data) { location.reload(); }
            this.contactGroupService.notesChanged(x);
            this.isUpdating = false;
          });
       } else {
        console.log('person note here.....', x);
         this.contactGroupService.updatePersonNote(x).subscribe((data) => {
          // if (data) { location.reload(); }
           this.contactGroupService.notesChanged(x);
            this.isUpdating = false;
          });
       }
      }});
  }

 addNote() {
   if (this.noteData) {
      this.sharedService.addNote(this.noteData);
   }
  }
}
