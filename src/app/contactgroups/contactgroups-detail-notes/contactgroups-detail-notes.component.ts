import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-detail-notes',
  templateUrl: './contactgroups-detail-notes.component.html',
  styleUrls: ['./contactgroups-detail-notes.component.scss']
})
export class ContactgroupsDetailNotesComponent implements OnInit {
  person: Person;
  constructor(private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
    let personParams = this.route.snapshot.queryParamMap.get('person');
    if(personParams){
      this.person = JSON.parse(personParams);
    }
  }

  addNote() {
    event.stopPropagation();
    const data = {
      person: this.person
    }
    this.sharedService.addNote(data);
  }

}
