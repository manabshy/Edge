import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() dataNote: any;
  @Input() personNotes: PersonNote[];
  @Input() contactGroupNotes: ContactGroupsNote[];
  notes: ContactGroupsNote[];

  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    this.notes = this.contactGroupNotes;
  }

 addNote(dataNote) {
   if (this.dataNote) {
      this.sharedService.addNote(this.dataNote);
   }
  }
}
