import { Component, OnInit, Input } from '@angular/core';
import { Person } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ContactNote, BasicContactGroup } from '../shared/contact-group';
import { BaseComponent } from 'src/app/core/models/base-component';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-contactgroups-detail-notes',
  templateUrl: './contactgroups-detail-notes.component.html',
  styleUrls: ['./contactgroups-detail-notes.component.scss']
})
export class ContactgroupsDetailNotesComponent extends BaseComponent implements OnInit  {
  person: Person;
  personId: number;
  personNotes: ContactNote[] = [];
  contactGroupId: number;
  contactGroupNotes: ContactNote[];
  contactGroups: BasicContactGroup[];
  contactGroupIds: number[];
  contactGroupInfo: BasicContactGroup[];
  personNotesInfo: ContactNote[];
  page = 1;
  bottomReached: boolean;
  addressees: any[] = [];

  // get personNotesData() {
  //   if (this.person && this.contactGroups) {
  //     return {
  //       addressees: this.addressees,
  //       person: this.person
  //     };
  //   }
  // }
  constructor(private contactGroupService: ContactGroupsService,
              private route: ActivatedRoute,
              private sharedService: SharedService) {super(); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.personId = +params['personId'] || 0;
    });


    if (this.contactGroupId) {
      console.log('contact group id', this.contactGroupId);
      this.getContactGroupNotes(this.contactGroupId);
    } else if (this.personId) {
      console.log('person id', this.personId);
      this.getPersonNotes();
      this.getContactGroups(this.personId);
    }

    this.contactGroupService.noteChanges$.subscribe(data => {
      if (data) {
        this.getPersonNotes();
        console.log('updated notes here', this.personNotes);
       if (this.contactGroupId) {
          this.getContactGroupNotes(this.contactGroupId);
          console.log('updated notes here', this.contactGroupNotes);
       }
      }
    });

    this.contactGroupService.personNotesChanges$.subscribe(data => {
      this.personNotesInfo = data;
      console.log('person notes from service here... on  notes page....', data);
    });
    this.contactGroupService.contactInfoForNotes$.subscribe(data => {
      this.contactGroupInfo = data;
      console.log('contact groups on detail notes page....', data);
    });

    this.contactGroupService.personNotePageChanges$.subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextPersonNotesPage(this.page);
    });

  }

  getPersonNotes() {
    this.getNextPersonNotesPage(this.page);
  }

  getContactGroupNotes(personId: number) {
    this.contactGroupService.getPersonNotes(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.contactGroupNotes = data;
    });
  }

  getContactGroups(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
     if (data) {
        this.contactGroups = data;
        this.contactGroupService.contactInfoChanged(data);
        this.setPersonNoteAddressees(data);
     }
    });
  }

  private getNextPersonNotesPage(page) {
    this.contactGroupService.getPersonNotes(this.personId, 10, page).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.personNotes = this.personNotes.concat(data);
      }
      if (!data.length) {
        this.bottomReached = true;
       }
    });
  }

  private setPersonNoteAddressees(contactGroups: BasicContactGroup[]) {
    let output;
    if (contactGroups) {
      // for (const item of contactGroups) {
      //   output = {
      //     addressee: item.contactPeople.map(x => x.addressee),
      //     groupId: item.contactGroupId
      //   };
      //   this.addressees.push(output);
      //   if (item.contactPeople.find(p => p.personId === +this.personId)) {
      //     this.person = item.contactPeople.find(p => p.personId === this.personId);
      //   }
      // }
      contactGroups.forEach((item, index) => {
        output = {
              addressee: item.contactPeople.map(x => x.addressee),
              groupId: item.contactGroupId
            };
            if (item.contactPeople.find(p => p.personId === +this.personId)) {
              this.person = item.contactPeople.find(p => p.personId === this.personId);
            }
            this.addressees[index] = output;
      });
    }
  }
  addNote() {
    event.stopPropagation();
    const data = {
      personId: this.personId,
    };
    console.log('for notes', data);
    this.sharedService.addNote(data);
  }
}
