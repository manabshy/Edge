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
  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  navPlaceholder: string;
  hidePrevious: boolean = false;
  searches$ = new Observable<PersonSearch[]>();

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('searches')) {
      this.getSearches();
    }
  }

  getSearches() {
    this.searches$ = this.peopleService.getSearches(this.personId, this.hidePrevious);
  }

}
