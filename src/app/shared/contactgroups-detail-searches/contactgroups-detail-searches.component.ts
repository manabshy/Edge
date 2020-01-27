import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { PersonSearch } from 'src/app/shared/models/person';

@Component({
  selector: 'app-contactgroups-detail-searches',
  templateUrl: './contactgroups-detail-searches.component.html',
  styleUrls: ['./contactgroups-detail-searches.component.scss']
})
export class ContactgroupsDetailSearchesComponent implements OnInit, OnChanges {
  navPlaceholder: string;
  @Input() personId: number;
  @Input() closedCounter: number;
  isClosedIncluded: boolean = false;
  searches$ = new Observable<PersonSearch[]>();

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.personId) {
      this.getSearches();
    }
  }

  getSearches() {
    this.searches$ = this.peopleService.getSearches(this.personId, this.isClosedIncluded);
  }

}
