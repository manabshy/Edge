import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../models/person';
import { Router } from '@angular/router';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() isClickable = true;
  constructor(private router: Router, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.contactGroupService.noteChanges$.subscribe(note => {
      if (note && note.isImportant) {
        this.personDetails.personNotes.push(note);
      }
    });
  }

  navigate() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId, 'edit']);
  }
}
