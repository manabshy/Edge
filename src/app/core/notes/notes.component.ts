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
  originalNotes: any;
  tests: any;
  contactPeople: Person[];
  personNoteAddressees = [];
  contact: Person[];
  contactGroupIds: number[] = [];
  groupAddressee: any;
  addressee: any;
  order = ['isPinned', 'createDate'];
  reverse = true;
  isUpdating = false;
  contactGroups: BasicContactGroup[];
  personId: number;
  notes: any;

  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.contactGroupService.contactInfoForNotes$.subscribe(data =>
      {
        this.contactGroups = data; console.log('info here....', data);
        if(this.contactGroups){
          this.contactGroups.forEach(x=>{
            this.contact = x.contactPeople;
          })
          this.setPersonNoteAddressees();
          this.setAddressees();
        }
         this.addressee = this.contact.map(x=>x.addressee);
    });

    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.originalNotes = this.personNotes || this.contactGroupNotes;
    if(this.originalNotes) {
      this.notes = this.originalNotes.slice(0,16);
      console.log('scrolled notes', this.notes);
    }
   if (this.noteData) {
      this.noteData.people !== undefined ? this.contactPeople = this.noteData.people : this.contactPeople = [];
      this.noteData.group ? this.groupAddressee = this.noteData.group.addressee : this.groupAddressee = [];
   }
   if(this.personNotes){
    this.personNotes.forEach(x=>{
     if(+x.contactGroupId!==0) {
       this.contactGroupIds.push(+x.contactGroupId);
     }
     this.personId = this.personNotes.find(x=>x.personId).personId;
   })
   console.log('personid for...', this.personId)
   console.log('ids for...', this.contactGroupIds)
 }
  }

  private setPersonNoteAddressees() {
    console.log('contactgroup ids for notes', this.contactGroupIds);
    let id = new Set(this.contactGroupIds);
    let output;
    console.log('contactgroups for notes...', this.contactGroups);
    for (const item of this.contactGroups) {
      if (id.has(item.contactGroupId)) {
        id.forEach(x => {
          console.log('noooooooo....................')
          if (+item.contactGroupId === +x) {
            console.log('contact people here...', item.contactPeople, 'id:', item.contactGroupId);
            output = {
              addressee: item.contactPeople.map(x => x.addressee),
              groupId: item.contactGroupId
            }
            this.personNoteAddressees.push(output);
          }
        })
      }
    }
    console.log('result.....', this.personNoteAddressees);
  }
  private setAddressees() {
    let output;
    let person;
    this.contactGroups.forEach(c=>{
      c.contactPeople.forEach(x=>{
        person = x;
      });
    });
    output = {
      addressee:'',
      groupId: 0,
      personId: this.personId,
      personAddressee: person.addressee
    };
    this.personNoteAddressees.push(output);
    console.log('person output', output);
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

  onScrollDown() {
    AppUtils.setupInfintiteScroll(this.originalNotes, this.notes);
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }
 addNote() {
   if (this.noteData) {
      this.sharedService.addNote(this.noteData);
   }
  }
}
