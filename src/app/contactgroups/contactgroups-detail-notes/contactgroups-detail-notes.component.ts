import { Component, OnInit, Input } from '@angular/core';
import { Person } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ContactNote, BasicContactGroup } from '../shared/contact-group';
import { BaseComponent } from 'src/app/core/models/base-component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail-notes',
  templateUrl: './contactgroups-detail-notes.component.html',
  styleUrls: ['./contactgroups-detail-notes.component.scss']
})
export class ContactgroupsDetailNotesComponent extends BaseComponent implements OnInit  {
  person: Person;
  personId: number;
  personNotes: ContactNote[];
  contactGroupId: number;
  contactGroupNotes: ContactNote[];
  contactGroups: BasicContactGroup[];
  contactGroupIds: number[];
  contactGroupInfo: BasicContactGroup[];
  constructor(private contactGroupService: ContactGroupsService,
              private route: ActivatedRoute,
              private sharedService: SharedService) {super(); }
  // ngOnInit() {
  //   // let personParams = this.route.snapshot.queryParamMap.get('person');
  //   // if(personParams){
  //   //   this.person = JSON.parse(personParams);
  //   // }
  // }

  // addNote() {
  //   event.stopPropagation();
  //   const data = {
  //     person: this.person,
  //     isPersonNote: true
  //   }
  //   this.sharedService.addNote(data);
  // }
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
      this.getPersonNotes(this.personId);
      this.getContactGroups(this.personId);
    }
    
    this.contactGroupService.noteChanges$.subscribe(data => {
      if (data) {
        this.getPersonNotes(this.personId);
        console.log('updated notes here', this.personNotes);
       if(this.contactGroupId) {
          this.getContactGroupNotes(this.contactGroupId);
          console.log('updated notes here', this.contactGroupNotes);
       }
      }
    });

    this.contactGroupService.contactInfoForNotes$.subscribe(data => {
      this.contactGroupInfo = data;
      console.log('contact groups on detail notes page....', data)
    });
    // if(this.personNotes){
    //    this.personNotes.forEach(x=>{
    //     this.contactGroupIds.push(+x.contactGroupId);
    //   })
    //   console.log('contactgroup ids for notes', this.contactGroupIds);
    // }
  }

  getPersonNotes(personId: number) {
    this.contactGroupService.getPersonNotes(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.personNotes = data;
    });
  }

  getContactGroupNotes(personId: number) {
    this.contactGroupService.getPersonNotes(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.contactGroupNotes = data;
    });
  }
  getContactGroups(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
     if(data) {
       console.log('here notes details......', data)
        this.contactGroups = data;
        this.contactGroupService.contactInfoChanged(data);
     }
    });
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
