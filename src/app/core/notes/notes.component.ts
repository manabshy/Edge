import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote } from 'src/app/contactgroups/shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() personNotes: PersonNote[];

  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
  }
 addNote(dataNote) {
    this.sharedService.addNote(this.personNotes);
  }
}
