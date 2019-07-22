import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PersonNote, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() dataNote: any;
  @Input() personNotes: PersonNote[];
  @Input() contactGroupNotes: ContactGroupsNote[];
  notes: ContactGroupsNote[];

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }


 addNote(dataNote) {
   if (this.dataNote) {
      this.sharedService.addNote(this.dataNote);
   }
  }
}
